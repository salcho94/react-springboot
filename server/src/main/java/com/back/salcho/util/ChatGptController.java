package com.back.salcho.util;

import org.springframework.http.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.Path;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/chat")
public class ChatGptController {

    @Value("${openai.api.key}")
    private String openaiApiKey;

    private final String OPENAI_URL = "https://api.openai.com/v1/chat/completions";
    private final RestTemplate restTemplate = new RestTemplate();
    private static final SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm:ss");
    @CrossOrigin(origins = "*")
    @PostMapping("/gpt")
    public ResponseEntity<String> chatWithGpt(@RequestBody Map<String, Object> request) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(openaiApiKey);  // Bearer 토큰 설정

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
            ResponseEntity<Map> response = restTemplate.exchange(OPENAI_URL, HttpMethod.POST, entity, Map.class);

            // 응답에서 choices[0].message.content 추출
            Map<String, Object> responseBody = response.getBody();
            if (responseBody != null && responseBody.containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> choice = choices.get(0);
                    Map<String, Object> message = (Map<String, Object>) choice.get("message");
                    String content = (String) message.get("content");

                    return ResponseEntity.ok(content);
                }
            }
            return ResponseEntity.ok("응답이 없습니다.");

        } catch (Exception e) {
            // 상세한 오류 로그 출력
            System.out.println("오류오류오류오류오류" +e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("API 호출 오류: " + e.getMessage());
        }
    }

    @PostMapping("/gpt/question")
    public void gptQuestion(@RequestBody Map<String, Object> request) {
        try {
            // 날짜 형식 지정
            SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm:ss");
            String today = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
            String currentTime = timeFormat.format(new Date());

            // 저장할 폴더 경로 설정 (OS 호환성 고려)
            String folderPath = "D:" + File.separator + "chat" + File.separator + today;
            Files.createDirectories(Paths.get(folderPath)); // 폴더 생성

            String filePath = folderPath + File.separator + "gpt.txt";
            File file = new File(filePath);

            try (BufferedWriter writer = new BufferedWriter(new FileWriter(file, true))) {
                writer.write("[" + currentTime + "] " + request.get("question"));
                writer.newLine();
                System.out.println("✅ 질문 기록 저장 완료: " + filePath);
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    @GetMapping("/txtHistory")
    public String getChatHistory(@RequestParam Map<String, Object> params) {
        // 로그로 받은 파라미터 확인
        System.out.println(params.toString());

        // 파라미터에서 날짜나 사용자 이름을 받는다고 가정 (예시: "date"나 "user" 파라미터)
        String date = (String) params.get("date");
        String nickName = (String) params.get("nickName");

        // 파일 경로 설정 (여기서는 예시로 D:/chat 경로 사용)
        String filePath = "D:/chat/" + date + "/" + nickName + ".txt";
        Path path = Paths.get(filePath);

        // 파일 존재 여부 확인
        if (!Files.exists(path)) {
            return "채팅 기록 파일을 찾을 수 없습니다";
        }

        try {
            // 파일 읽기
            String content = new String(Files.readAllBytes(path));
            if (content.isEmpty()) {
                return "기록이 존재하지 않습니다.";
            } else {
                return content;  // 파일 내용 반환
            }
        } catch (IOException e) {
            throw new RuntimeException("파일을 읽는 중 오류가 발생했습니다.", e);
        }
    }


    @GetMapping("/users")
    public List<String> getChatUsersByDate(@RequestParam String date) {
        String folderPath = "D:/chat/" + date;
        File dateFolder = new File(folderPath);

        if (!dateFolder.exists() || !dateFolder.isDirectory()) {
            return new ArrayList<>(); // 폴더가 없으면 빈 리스트 반환
        }

        List<String> nicknames = Arrays.stream(dateFolder.listFiles((dir, name) -> name.endsWith(".txt")))
                .map(file -> file.getName().replaceFirst("[.][^.]+$", "")) // 확장자 제거
                .distinct()
                .collect(Collectors.toList());

        return nicknames;
    }



}
