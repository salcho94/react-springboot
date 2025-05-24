package com.back.salcho.util;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/api/file")
public class FileController {

    private static final String CHAT_UPLOAD_DIR = "C:/study/salcho/client/public/chat"; // 기본 저장 경로
    private static final long MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB 제한



    @GetMapping("/board/download")
    @ResponseBody
    public ResponseEntity<Resource> downloadFile(@RequestParam String filePath) {
        try {
            Path fileUrl = Paths.get(filePath).normalize();
            Resource resource = new UrlResource(fileUrl.toUri());

            if (!resource.exists()) {
                throw new FileNotFoundException("파일을 찾을 수 없습니다: " + fileUrl);
            }

            String contentType = Files.probeContentType(fileUrl);

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/chat/download")
    @ResponseBody
    public ResponseEntity<Resource> downloadChatFile(@RequestParam String filePath) {
        try {
            // 보안: filePath를 절대경로로 변환 후 기본 업로드 디렉토리 내에 있는지 검증
            Path absolutePath = Paths.get(filePath).toAbsolutePath().normalize();
            Path rootPath = Paths.get(CHAT_UPLOAD_DIR).toAbsolutePath().normalize();

            if (!absolutePath.startsWith(rootPath)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null); // 잘못된 경로 요청 방지
            }

            Resource resource = new UrlResource(absolutePath.toUri());

            if (!resource.exists()) {
                throw new FileNotFoundException("파일을 찾을 수 없습니다: " + absolutePath);
            }

            String contentType = Files.probeContentType(absolutePath);

            return ResponseEntity.ok()
                    .contentType(contentType != null ? MediaType.parseMediaType(contentType) : MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @PostMapping("/chat/upload")
    public Map<String, Object> uploadFiles(@RequestParam("files") MultipartFile[] files) {
        Map<String, Object> response = new HashMap<>();
        List<Map<String, String>> fileList = new ArrayList<>();

        // 오늘 날짜 폴더 생성 (yyyyMMdd 형식)
        String dateFolderName = new SimpleDateFormat("yyyyMMdd").format(new Date());
        Path uploadPath = Paths.get(CHAT_UPLOAD_DIR, dateFolderName);

        if (!Files.exists(uploadPath)) {
            try {
                Files.createDirectories(uploadPath); // 폴더가 없으면 생성
            } catch (IOException e) {
                response.put("error", "업로드 폴더 생성 실패: " + e.getMessage());
                return response;
            }
        }

        for (MultipartFile file : files) {
            if (file.isEmpty()) {
                response.put("error", "파일이 비어 있습니다.");
                return response;
            }

            // 파일 크기 제한 확인
            if (file.getSize() > MAX_FILE_SIZE) {
                response.put("error", "파일 크기는 50MB 이하여야 합니다: " + file.getOriginalFilename());
                return response;
            }

            try {
                // UUID를 사용하여 파일 이름 충돌 방지
                String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                Path filePath = uploadPath.resolve(fileName);
                file.transferTo(filePath.toFile());

                // 파일 정보 저장
                Map<String, String> fileInfo = new HashMap<>();


                fileInfo.put("type", file.getContentType());
                fileInfo.put("name", file.getOriginalFilename());
                fileInfo.put("url",  filePath.toString().replace("\\", "/"));

                if (file.getContentType() != null && file.getContentType().startsWith("image")) {
                    fileInfo.put("preview",dateFolderName +'/'+fileName);
                }else{
                    fileInfo.put("preview", "");
                }

                fileList.add(fileInfo);

            } catch (IOException e) {
                response.put("error", "파일 업로드 중 오류 발생: " + e.getMessage());
                return response;
            }
        }

        response.put("files", fileList);
        return response;
    }

}
