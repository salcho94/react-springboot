package com.back.salcho.chat;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.io.IOException;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

public class ChatHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper = new ObjectMapper(); // JSON 변환용 객체
    private static final SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm:ss");

    private Set<WebSocketSession> sessions = new HashSet<>();
    private Set<String> typingUsers = new HashSet<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        session.setTextMessageSizeLimit(1024 * 1024); // 1MB
        sessions.add(session);
        System.out.println("새로운 연결이 설정되었습니다: " + session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        try {
            // JSON 문자열 가져오기
            String payload = message.getPayload();
            if (payload == null || payload.trim().isEmpty()) {
                System.err.println("📢 경고: payload가 null이거나 비어 있음");
                return;
            }

            // JSON을 Map으로 변환
            Map<String, Object> jsonMessage = objectMapper.readValue(payload, Map.class);
            String sender = jsonMessage.getOrDefault("sender", "").toString().trim();
            String text = jsonMessage.getOrDefault("text", "").toString().trim();
            String type = jsonMessage.getOrDefault("type", "").toString().trim();

            // 날짜 형식 지정
            SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm:ss");
            String today = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
            String currentTime = timeFormat.format(new Date());

            // 저장할 폴더 경로 설정 (OS 호환성 고려)
            String folderPath = "D:" + File.separator + "chat" + File.separator + today;
            Files.createDirectories(Paths.get(folderPath)); // 폴더 생성

            // 보낸 사람별 텍스트 파일 저장
            if (!sender.isEmpty() && !text.isEmpty()) {
                String filePath = folderPath + File.separator + sender + ".txt";
                File file = new File(filePath);

                try (BufferedWriter writer = new BufferedWriter(new FileWriter(file, true))) {
                    writer.write("[" + currentTime + "] " + text);
                    writer.newLine();
                    System.out.println("✅ 대화 기록 저장 완료: " + filePath);
                }
            }

            // WebSocket 관련 처리
            if ("connect".equals(type)) {
                Map<String, Object> userObject = (Map<String, Object>) jsonMessage.get("user");
                if (userObject != null) {
                    String nickName = (String) userObject.get("nickName");
                    if (nickName != null) {
                        session.getAttributes().put("nickName", nickName);
                        System.out.println("사용자 연결됨: " + nickName);
                    }
                }
            } else if ("endTyping".equals(type)) {
                String nickName = jsonMessage.getOrDefault("user", "").toString();
                if (!nickName.isEmpty()) {
                    typingUsers.remove(nickName);
                    broadcastTypingUsers();
                }
            } else if ("typing".equals(type)) {
                String nickName = jsonMessage.getOrDefault("user", "").toString();
                if (!nickName.isEmpty()) {
                    typingUsers.add(nickName);
                    broadcastTypingUsers();
                }
            }

            // 현재 접속 중인 사용자 목록 만들기
            List<String> userList = sessions.stream()
                    .map(s -> (String) s.getAttributes().get("nickName"))
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());

            // 사용자 목록 전송
            broadcastUserList(userList);

            // 원래 메시지를 모든 세션에 전송
            broadcastMessage(message);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // 입력 중인 사용자 목록을 모든 세션에 전송
    private void broadcastTypingUsers() {
        try {
            Map<String, Object> typingMessage = new HashMap<>();
            typingMessage.put("type", "typing");
            typingMessage.put("typingUsers", typingUsers);

            String json = objectMapper.writeValueAsString(typingMessage);
            broadcastMessage(new TextMessage(json));

        } catch (JsonProcessingException e) {
            e.printStackTrace(); // 예외 발생 시 로그 출력
        }
    }

    // 사용자 목록을 모든 세션에 전송

    private void broadcastUserList(List<String> userList) throws IOException {
       try{
            Map<String, Object> responseMessage = new HashMap<>();
            responseMessage.put("type", "userList");
            responseMessage.put("userList", userList);

            String jsonResponse = objectMapper.writeValueAsString(responseMessage);
            broadcastMessage(new TextMessage(jsonResponse));
        } catch (JsonProcessingException e) {
            e.printStackTrace(); // 예외 발생 시 로그 출력
        }
    }

    // 모든 세션에 메시지 전송
    private void broadcastMessage(TextMessage message) {
        for (WebSocketSession s : sessions) {
            if (s.isOpen()) {
                try {
                    s.sendMessage(message);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }


    @Override
    public void afterConnectionClosed(WebSocketSession session, org.springframework.web.socket.CloseStatus status) {
        // 세션에서 닉네임을 가져옴
        String nickName = (String) session.getAttributes().get("nickName");

        // 세션 제거
        sessions.remove(session);
        System.out.println("연결 종료됨: " + session.getId());

        if (nickName == null) {
            System.out.println("닉네임을 찾을 수 없습니다. 연결 종료 시점에서 문제가 발생했을 수 있습니다.");
            return;  // 닉네임이 없으면 종료
        }

        System.out.println("연결 종료된 사용자 닉네임: " + nickName);

        // JSON 형태로 접속 종료 메시지 생성
        Map<String, Object> disconnectMessage = new HashMap<>();
        disconnectMessage.put("type", "disconnect");
        disconnectMessage.put("nickName", nickName);

        // 현재 접속 중인 사용자 목록 만들기 (세션에 저장된 닉네임 목록)
        List<String> userList = sessions.stream()
                .map(s -> (String) s.getAttributes().get("nickName"))
                .collect(Collectors.toList());

        // userList를 포함한 메시지 생성
        Map<String, Object> userListMessage = new HashMap<>();
        userListMessage.put("type", "userList");
        userListMessage.put("userList", userList);

        try {
            // JSON으로 변환
            String disconnectJson = objectMapper.writeValueAsString(disconnectMessage);
            String userListJson = objectMapper.writeValueAsString(userListMessage);

            TextMessage disconnectTextMessage = new TextMessage(disconnectJson);
            TextMessage userListTextMessage = new TextMessage(userListJson);

            // 모든 연결된 세션에 사용자 퇴장 알림 및 업데이트된 userList 전송
            for (WebSocketSession s : sessions) {
                try {
                    s.sendMessage(disconnectTextMessage);  // 퇴장 메시지 전송
                    s.sendMessage(userListTextMessage);   // 업데이트된 userList 전송
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
