package com.back.salcho.chat.controller;

import com.back.salcho.chat.entity.ChatMessage;
import com.back.salcho.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/message")
    public void saveMessage(@RequestBody ChatMessage message) {
        chatService.saveMessage(message);
    }

    @GetMapping("/history/{roomId}")
    public List<ChatMessage> getMessages(@PathVariable String roomId) {
        return chatService.getMessagesByRoom(roomId);
    }
}
