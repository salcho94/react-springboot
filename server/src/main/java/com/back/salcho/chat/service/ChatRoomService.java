package com.back.salcho.chat.service;

import com.back.salcho.chat.entity.ChatRoom;
import com.back.salcho.chat.mapper.ChatRoomMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatRoomService {

    private final ChatRoomMapper chatRoomMapper;

    public ChatRoomService(ChatRoomMapper chatRoomMapper) {
        this.chatRoomMapper = chatRoomMapper;
    }

    // 채팅방 생성
    public void createRoom(ChatRoom room) {
        chatRoomMapper.insertChatRoom(room);
    }

    // 채팅방 전체 조회 (삭제되지 않은)
    public List<ChatRoom> getAllRooms() {
        return chatRoomMapper.getAllChatRooms();
    }

    // ID로 채팅방 조회
    public ChatRoom getRoomById(Long id) {
        return chatRoomMapper.getChatRoomById(id);
    }

    // 채팅방 논리 삭제
    public void deleteRoom(Long id) {
        chatRoomMapper.deleteChatRoom(id);
    }


    // 비밀번호 검증 메소드
    public boolean verifyPassword(Long roomId, String inputPassword) {
        String storedPassword = chatRoomMapper.getPasswordById(roomId);
        return storedPassword != null && storedPassword.equals(inputPassword);
    }
}
