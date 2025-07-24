package com.back.salcho.chat.entity;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ChatRoom {
    private Long id;
    private String name;
    private String password;
    private LocalDateTime createdAt;
    private Boolean isDeleted;
    private String writer;
}
