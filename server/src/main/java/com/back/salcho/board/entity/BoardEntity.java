package com.back.salcho.board.entity;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
@Data
public class BoardEntity {
    private int idx;
    private int boardId;
    private int likes;
    private int counts;
    private int fileId;
    private int[] deleteFiles;
    private long fileSize;
    private int reviewId;

    private String comment;
    private String boardType;
    private String title;
    private String nickName;
    private String contents;
    private String userId;
    private String regDate;
    private String uptDate;
    private String passYn;
    private String fileYn;
    private String delYn;
    private String password;
    private String fileName;
    private String fileType;
    private String filePath;


    private List<MultipartFile> files;

}
