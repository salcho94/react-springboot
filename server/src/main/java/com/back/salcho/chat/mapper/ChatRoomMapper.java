package com.back.salcho.chat.mapper;

import com.back.salcho.chat.entity.ChatRoom;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ChatRoomMapper {

    void insertChatRoom(ChatRoom chatRoom);

    List<ChatRoom> getAllChatRooms(); // is_deleted = 0 인 것만

    ChatRoom getChatRoomById(Long id);

    void deleteChatRoom(Long id); // is_deleted = 1로 변경

    String getPasswordById(Long id);
}
