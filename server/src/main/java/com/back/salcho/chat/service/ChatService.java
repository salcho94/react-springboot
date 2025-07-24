package com.back.salcho.chat.service;

import com.back.salcho.chat.entity.ChatMessage;
import com.back.salcho.chat.mapper.ChatMapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMapper chatMapper;

    public void saveMessage(ChatMessage message) {
        chatMapper.insertMessage(message);
    }

    public List<ChatMessage> getMessagesByRoom(String roomId) {
        return chatMapper.selectMessagesByRoomId(roomId);
    }
}
