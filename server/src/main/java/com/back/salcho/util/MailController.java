package com.back.salcho.util;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/mail")
public class MailController {
    private final JavaMailSender mailSender;
    private final ConcurrentHashMap<String, Long> userCooldowns = new ConcurrentHashMap<>();

    public MailController(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @PostMapping("/send")
    public String sendMail(@RequestParam String to) {
        long currentTime = System.currentTimeMillis();

        // 5초 동안 재요청 방지
        if (userCooldowns.containsKey(to) && (currentTime - userCooldowns.get(to)) < 5000) {
            return "5초 후 다시 시도하세요.";
        }

        userCooldowns.put(to, currentTime); // 요청 시간 저장

        try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom("js94.kro.kr");
                message.setTo("rlaqwe8@gmail.com");
                message.setSubject("채팅신청");
                message.setText(to + "님이 채팅에서 호출하였습니다.");

            mailSender.send(message);

            return "메일 전송 완료!";
        } catch (Exception e) {
            return "메일 전송 실패: " + e.getMessage();
        }
    }
}
