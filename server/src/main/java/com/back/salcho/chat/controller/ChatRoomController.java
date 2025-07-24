package com.back.salcho.chat.controller;

import com.back.salcho.chat.entity.ChatRoom;
import com.back.salcho.chat.service.ChatRoomService;
import lombok.Data;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/chat/rooms")
@CrossOrigin(origins = {"http://localhost:3000", "http://js94.kro.kr:3000"})
public class ChatRoomController {

    private final ChatRoomService chatRoomService;

    public ChatRoomController(ChatRoomService chatRoomService) {
        this.chatRoomService = chatRoomService;
    }

    // 전체 채팅방 조회
    @GetMapping
    public List<ChatRoom> getAllRooms() {
        return chatRoomService.getAllRooms(); // is_deleted = 0 조건 포함됨
    }

    // 채팅방 생성
    @PostMapping
    public ChatRoom createRoom(@RequestBody CreateRoomRequest request) {
        ChatRoom room = new ChatRoom();
        room.setName(request.getName());
        room.setPassword(request.getPassword());
        room.setWriter(request.getWriter());
        chatRoomService.createRoom(room);
        return room;
    }

    // 채팅방 삭제 (논리 삭제)
    @DeleteMapping("/{id}")
    public void deleteRoom(@PathVariable Long id) {
        chatRoomService.deleteRoom(id);
    }

    // 비밀번호 확인 API
    @PostMapping("/{id}/check")
    public Map<String, Object> checkPassword(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String inputPassword = request.get("password");
        boolean isPasswordCorrect = chatRoomService.verifyPassword(id, inputPassword);
        Map<String, Object> result = new HashMap<>();
        result.put("success", isPasswordCorrect);
        return result;
    }

    @Data
    public static class CreateRoomRequest {
        private String name;
        private String password;
        private String writer;
    }
}
