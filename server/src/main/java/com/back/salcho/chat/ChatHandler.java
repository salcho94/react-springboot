package com.back.salcho.chat;

import com.back.salcho.chat.entity.ChatMessage;
import com.back.salcho.chat.service.ChatService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.*;
import java.nio.file.*;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

public class ChatHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private static final SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm:ss");
    private final Set<WebSocketSession> sessions = new HashSet<>();
    private final Set<String> typingUsers = new HashSet<>();
    private final Map<String, Set<WebSocketSession>> chatRooms = new HashMap<>();

    @Autowired
    private ChatService chatService;

    public ChatHandler(ChatService chatService) {
        this.chatService = chatService;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        session.setTextMessageSizeLimit(1024 * 1024);
        sessions.add(session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        try {
            String payload = message.getPayload();
            if (payload == null || payload.trim().isEmpty()) return;

            Map<String, Object> jsonMessage = objectMapper.readValue(payload, Map.class);
            String sender = getString(jsonMessage, "sender");
            String text = getString(jsonMessage, "text");
            String type = getString(jsonMessage, "type");
            String roomId = getString(jsonMessage, "roomId");

            saveToFile(roomId, sender, text);
            saveToDB(jsonMessage, sender, text, type, roomId);

            if ("connect".equals(type)) {
                handleConnect(session, jsonMessage, roomId);
            } else if ("typing".equals(type)) {
                handleTyping(jsonMessage, roomId);
            } else if ("endTyping".equals(type)) {
                handleEndTyping(jsonMessage, roomId);
            } else {
                broadcastToRoom(roomId, message);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void saveToFile(String roomId, String sender, String text) {
        if (sender.isEmpty() || text.isEmpty()) return;

        try {
            String today = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
            String currentTime = timeFormat.format(new Date());
            String folderPath = "D:" + File.separator + "chat" + File.separator + today + File.separator + roomId;
            Files.createDirectories(Paths.get(folderPath));

            String filePath = folderPath + File.separator + sender + ".txt";
            try (BufferedWriter writer = new BufferedWriter(new FileWriter(filePath, true))) {
                writer.write("[" + currentTime + "] " + text);
                writer.newLine();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void saveToDB(Map<String, Object> jsonMessage, String sender, String text, String type, String roomId) {
        if (sender.isEmpty() || (!"message".equals(type) && !type.isEmpty())) return;

        try {
            ChatMessage chatMessage = new ChatMessage();
            chatMessage.setRoomId(roomId);
            chatMessage.setSender(sender);
            chatMessage.setText(text);
            chatMessage.setType(type);
            chatMessage.setTimestamp(LocalDateTime.now());

            if (jsonMessage.containsKey("attachments")) {
                chatMessage.setAttachments(objectMapper.writeValueAsString(jsonMessage.get("attachments")));
            }

            chatService.saveMessage(chatMessage);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void handleConnect(WebSocketSession session, Map<String, Object> jsonMessage, String roomId) throws JsonProcessingException {
        Map<String, Object> userObject = (Map<String, Object>) jsonMessage.get("user");
        if (userObject != null) {
            String nickName = getString(userObject, "nickName");
            if (nickName != null) {
                session.getAttributes().put("nickName", nickName);
                session.getAttributes().put("roomId", roomId);
                if (!chatRooms.containsKey(roomId)) {
                    chatRooms.put(roomId, new HashSet<WebSocketSession>());
                }
                chatRooms.get(roomId).add(session);

                Map<String, Object> connectMsg = new HashMap<String, Object>();
                connectMsg.put("type", "connect");
                Map<String, String> userMap = new HashMap<String, String>();
                userMap.put("nickName", nickName);
                connectMsg.put("user", userMap);
                broadcastToRoom(roomId, new TextMessage(objectMapper.writeValueAsString(connectMsg)));

                broadcastUserListToRoom(roomId);
            }
        }
    }

    private void handleTyping(Map<String, Object> jsonMessage, String roomId) throws JsonProcessingException {
        String nickName = getString(jsonMessage, "user");
        if (!nickName.isEmpty()) {
            typingUsers.add(nickName);
            broadcastTypingUsersToRoom(roomId);
        }
    }

    private void handleEndTyping(Map<String, Object> jsonMessage, String roomId) throws JsonProcessingException {
        String nickName = getString(jsonMessage, "user");
        if (!nickName.isEmpty()) {
            typingUsers.remove(nickName);
            broadcastTypingUsersToRoom(roomId);
        }
    }

    private void broadcastTypingUsersToRoom(String roomId) throws JsonProcessingException {
        Map<String, Object> typingMessage = new HashMap<String, Object>();
        typingMessage.put("type", "typing");
        typingMessage.put("typingUsers", typingUsers);
        broadcastToRoom(roomId, new TextMessage(objectMapper.writeValueAsString(typingMessage)));
    }

    private void broadcastUserListToRoom(String roomId) throws JsonProcessingException {
        Set<WebSocketSession> roomSessions = chatRooms.getOrDefault(roomId, Collections.<WebSocketSession>emptySet());
        List<String> userList = new ArrayList<String>();
        for (WebSocketSession s : roomSessions) {
            String name = (String) s.getAttributes().get("nickName");
            if (name != null) userList.add(name);
        }

        Map<String, Object> response = new HashMap<String, Object>();
        response.put("type", "userList");
        response.put("userList", userList);
        broadcastToRoom(roomId, new TextMessage(objectMapper.writeValueAsString(response)));
    }

    private void broadcastToRoom(String roomId, TextMessage message) {
        Set<WebSocketSession> roomSessions = chatRooms.getOrDefault(roomId, Collections.emptySet());

        for (WebSocketSession session : roomSessions) {
            if (session.isOpen()) {
                try {
                    // 동기화: 한 세션에서 동시에 메시지 보내지 않도록 막음
                    synchronized (session) {
                        session.sendMessage(message);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }


    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.remove(session);
        String nickName = (String) session.getAttributes().get("nickName");
        String roomId = (String) session.getAttributes().get("roomId");

        if (roomId != null) {
            Set<WebSocketSession> roomSessions = chatRooms.get(roomId);
            if (roomSessions != null) {
                roomSessions.remove(session);
            }

            if (nickName != null) {
                try {
                    Map<String, Object> disconnectMsg = new HashMap<String, Object>();
                    disconnectMsg.put("type", "disconnect");
                    Map<String, String> userMap = new HashMap<String, String>();
                    userMap.put("nickName", nickName);
                    disconnectMsg.put("user", userMap);
                    broadcastToRoom(roomId, new TextMessage(objectMapper.writeValueAsString(disconnectMsg)));
                } catch (JsonProcessingException e) {
                    e.printStackTrace();
                }
            }

            try {
                broadcastUserListToRoom(roomId);
            } catch (JsonProcessingException e) {
                e.printStackTrace();
            }
        }

        typingUsers.remove(nickName);
    }

    private String getString(Map<String, Object> map, String key) {
        Object val = map.get(key);
        return val != null ? val.toString().trim() : "";
    }
}
