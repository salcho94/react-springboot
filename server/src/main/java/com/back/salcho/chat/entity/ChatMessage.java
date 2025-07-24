package com.back.salcho.chat.entity;

import lombok.Data;

import java.time.LocalDateTime;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ChatMessage {
    private Long id;
    private String roomId;
    private String sender;
    private String text;
    private LocalDateTime timestamp;
    private String type;
    private String attachments; // JSON string
}
