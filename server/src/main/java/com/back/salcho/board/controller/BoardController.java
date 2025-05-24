package com.back.salcho.board.controller;

import com.back.salcho.board.entity.BoardEntity;
import com.back.salcho.board.service.BoardService;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/api/board")
public class BoardController {

    @Autowired
    BoardService boardService;


    @GetMapping("/list")
    @ResponseBody
    public List<BoardEntity> boardList() {
        return boardService.getBoardList();
    }

    @PostMapping("/insert")
    @ResponseBody
    public String insertBoard(
            @ModelAttribute BoardEntity board,
            @RequestParam(value = "files", required = false) List<MultipartFile> files) {

        // 비밀번호 암호화 처리
        if (board.getPassword() != null && !board.getPassword().isEmpty()) {
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            board.setPassword(encoder.encode(board.getPassword()));
        }

        board.setBoardType("normal");
        boardService.insertBoard(board); // 게시글 정보 저장

        if (files != null && !files.isEmpty()) {
            String baseUploadPath = "C:/uploads/";

            // 날짜 기반 폴더명 생성 (yyyyMMdd)
            String dateFolderName = new SimpleDateFormat("yyyyMMdd").format(new Date());
            Path uploadPath = Paths.get(baseUploadPath, dateFolderName);

            try {
                // 디렉터리 생성 (필요 시 자동 생성)
                Files.createDirectories(uploadPath);

                for (MultipartFile file : files) {
                    if (!file.isEmpty()) {
                        // 파일 저장 경로
                        String uniqueFileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                        String savedFilePath = uploadPath.resolve(uniqueFileName).toString();

                        // 파일 저장
                        file.transferTo(new File(savedFilePath));

                        // DB에 파일 정보 저장
                        BoardEntity fileBoard = new BoardEntity();
                        fileBoard.setBoardId(board.getBoardId());
                        fileBoard.setFileName(file.getOriginalFilename());
                        fileBoard.setFileSize(file.getSize());
                        fileBoard.setFileType(file.getContentType());
                        fileBoard.setFilePath(savedFilePath); // 파일 경로 정보 추가
                        boardService.insertFile(fileBoard);
                    }
                }
            } catch (IOException e) {
                return "파일 업로드 실패. 잠시 후 다시 시도해주세요.";
            }
        }

        return "글 작성 성공 하였습니다.";
    }


    @PostMapping("/checkPass")
    @ResponseBody
    public String checkPass(@RequestBody BoardEntity board) {
        Map<String, Object> res = new HashMap<>();
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        // DB에서 게시글 정보 조회
        BoardEntity checkBoard = boardService.checkPass(board);

        if (checkBoard != null && encoder.matches(board.getPassword(), checkBoard.getPassword())) {
            return "Y";
        } else {
            return "N";
        }
    }


    @GetMapping("/getBoard")
    @ResponseBody
    public List<BoardEntity> getBoard(@RequestParam Map<String, Object> params) {
        return boardService.getBoard(params);
    }

    @GetMapping("/updateCount")
    @ResponseBody
    public String updateCount(@RequestParam Map<String, Object> params) {
        try{
            boardService.updateCount(params);
        }catch(Exception e) {
            return "조회수 업데이트 실패";
        }
        return "조회수 업데이트 완료";
    }


    @PostMapping("/update")
    @ResponseBody
    public String updateBoard(
            @ModelAttribute BoardEntity board,
            @RequestParam(value = "files", required = false) List<MultipartFile> files) {

        if (board.getDeleteFiles() != null) {
            for (int fileId : board.getDeleteFiles()) {
                try {
                    boardService.deleteFileById(fileId);  // 파일 삭제
                    System.out.println("File with ID " + fileId + " has been deleted.");
                } catch (Exception e) {
                    // 예외 처리 (예: 삭제 실패 시 처리)
                    System.err.println("Failed to delete file with ID " + fileId + ": " + e.getMessage());
                }
            }
        } else {
            System.out.println("No files to delete.");
        }


        // 비밀번호 암호화 처리
        if (board.getPassword() != null && !board.getPassword().isEmpty()) {
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            board.setPassword(encoder.encode(board.getPassword()));
        }


        board.setBoardType("normal");
        boardService.updateBoard(board); // 게시글 정보 수정

        if (files != null && !files.isEmpty()) {
            String baseUploadPath = "C:/uploads/";

            // 날짜 기반 폴더명 생성 (yyyyMMdd)
            String dateFolderName = new SimpleDateFormat("yyyyMMdd").format(new Date());
            Path uploadPath = Paths.get(baseUploadPath, dateFolderName);

            try {
                // 디렉터리 생성 (필요 시 자동 생성)
                Files.createDirectories(uploadPath);

                for (MultipartFile file : files) {
                    if (!file.isEmpty()) {
                        // 파일 저장 경로
                        String uniqueFileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                        String savedFilePath = uploadPath.resolve(uniqueFileName).toString();

                        // 파일 저장
                        file.transferTo(new File(savedFilePath));

                        // DB에 파일 정보 저장
                        BoardEntity fileBoard = new BoardEntity();
                        fileBoard.setBoardId(board.getBoardId());
                        fileBoard.setFileName(file.getOriginalFilename());
                        fileBoard.setFileSize(file.getSize());
                        fileBoard.setFileType(file.getContentType());
                        fileBoard.setFilePath(savedFilePath); // 파일 경로 정보 추가
                        boardService.insertFile(fileBoard);
                    }
                }
            } catch (IOException e) {
                return "파일 업로드 실패. 잠시 후 다시 시도해주세요.";
            }
        }

        return "글 수정에 성공 하였습니다.";
    }


    @PostMapping("/delete")
    @ResponseBody
    public String updateBoard(
            @ModelAttribute BoardEntity board) {
        try{
            boardService.deleteBoard(board);
        }catch(Exception e) {
            return "게시글 삭제 실패";
        }
        return "글 삭제를 완료하였습니다.";
    }

    @PostMapping("/comment")
    @ResponseBody
    public String insertComment(
            @ModelAttribute BoardEntity board) {
        try{
            boardService.insertComment(board);
        }catch(Exception e) {
            return "댓글 등록을 실패 하였습니다.";
        }
        return "댓글 등록을 성공하였습니다.";
    }

    @GetMapping("/getComment")
    @ResponseBody
    public List<BoardEntity> getComment(@RequestParam Map<String, Object> params) {
        return boardService.getComment(params);
    }

    @PostMapping("/commentDelete")
    @ResponseBody
    public String commentDelete(
            @ModelAttribute BoardEntity board) {
        try{
            boardService.commentDelete(board);
        }catch(Exception e) {
            return "댓글 삭제를 실패 하였습니다.";
        }
        return "댓글 삭제를 성공하였습니다.";
    }


    @PostMapping("/imageFile")
    public ResponseEntity<?> uploadImage(@RequestParam("image") MultipartFile file) {
        try {
            String uploadDir = "C:/study/salcho/client/public/uploads/"; // 이미지 저장 경로
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir + fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String imageUrl = "http://js94.kro.kr:3000/uploads/" + fileName; // 프론트에서 접근 가능한 URL
            // ✅ Map.of() 대신 HashMap 사용
            Map<String, String> response = new HashMap<>();
            response.put("imageUrl", imageUrl);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일 업로드 실패");
        }
    }


}