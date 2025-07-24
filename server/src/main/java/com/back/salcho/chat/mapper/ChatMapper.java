package com.back.salcho.chat.mapper;

import com.back.salcho.chat.entity.ChatMessage;
import com.back.salcho.chat.entity.ChatRoom;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ChatMapper {
    void insertMessage(ChatMessage message);
    List<ChatMessage> selectMessagesByRoomId(String roomId);
}
