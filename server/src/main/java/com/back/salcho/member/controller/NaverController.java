package com.back.salcho.member.controller;



import com.back.salcho.member.entity.MemberEntity;
import com.back.salcho.member.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.Map;

@RestController
public class NaverController {
    @Autowired
    private MemberService memberService;

    private String naverUrl = "https://nid.naver.com";
    private String naverApiUrl = "https://openapi.naver.com";

    @Value("${naver.clientId}")
    private String clientId;

    @Value("${naver.clientSecretKey}")
    private String clientSecretKey;

    @GetMapping("/api/naver")
    @ResponseBody
    public Map<String,String> naverLogin(@RequestParam String code) {
        System.out.println(code);
        System.out.println(clientId);
        System.out.println(clientSecretKey);
        /**
         * code값을 이용하여 token정보 가져오기
         */
        // webClient 설정
        WebClient kakaoWebClient =
                WebClient.builder()
                        .baseUrl(naverUrl)
                        .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                        .build();

        // token api 호출
        Map<String, Object> tokenResponse =
                kakaoWebClient
                        .post()
                        .uri(uriBuilder -> uriBuilder
                                .path("/oauth2.0/token")
                                .queryParam("grant_type", "authorization_code")
                                .queryParam("client_id", clientId)
                                .queryParam("client_secret", clientSecretKey)
                                .queryParam("code", code)
                                .build())
                        .retrieve()
                        .bodyToMono(Map.class)
                        .block();

        String accessToken = (String) tokenResponse.get("access_token");

        /**
         * accessToken으로 로그인 사용자가 동의한 정보 확인하기
         */
        // webClient 설정
        WebClient kakaoApiWebClient =
                WebClient.builder()
                        .baseUrl(naverApiUrl)
                        .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                        .build();

        // info api 설정
        Map<String, Object> infoResponse =
                kakaoApiWebClient
                        .post()
                        .uri(uriBuilder -> uriBuilder
                                .path("/v1/nid/me")
                                .build())
                        .header("Authorization", "Bearer " + accessToken)
                        .retrieve()
                        .bodyToMono(Map.class)
                        .block();

        Map<String, String> infoResponseMap = (Map<String, String>) infoResponse.get("response");
        Map<String, String> responseMap = new HashMap<>();
        int resultYn =0;
        MemberEntity reqMember = new MemberEntity();
        if (StringUtils.hasText(infoResponseMap.get("email"))) {
            reqMember.setEmail(infoResponseMap.get("email"));
        }
        if (StringUtils.hasText(infoResponseMap.get("name"))) {
            reqMember.setNickName(infoResponseMap.get("name"));
        }
        reqMember.setType("naver");
        MemberEntity member = memberService.duplicateCheck(reqMember);
        reqMember.setEmail(infoResponseMap.get("email"));
        reqMember.setNickName(infoResponseMap.get("name"));

        if(member == null) {
            reqMember.setType("naver");
            resultYn = memberService.signupMember(reqMember);
        }

        MemberEntity getMember = memberService.duplicateCheck(reqMember);
        infoResponseMap.put("id", String.valueOf(getMember.getMemberId()));
        infoResponseMap.put("type",getMember.getType());
        infoResponseMap.put("target",getMember.getTarget());
        infoResponseMap.put("success",resultYn>0 ?"Y" :"N");
        // 결과 반환
        return infoResponseMap;
    }
}
// 연락처 이메일 주소 담기
   /*     if (StringUtils.hasText(infoResponseMap.get("mobile_e164"))) {
                responseMap.put("phoneEmail", infoResponseMap.get("mobile_e164"));
                }
                // 별명 정보 담기
                if (StringUtils.hasText(infoResponseMap.get("nickname"))) {
                responseMap.put("nickname", infoResponseMap.get("nickname"));
                }
                // 프로필 사진 정보 담기
                if (StringUtils.hasText(infoResponseMap.get("profile_image"))) {
                responseMap.put("profileImageUrl", infoResponseMap.get("profile_image"));
                }
                // 성별 정보 담기
                if (StringUtils.hasText(infoResponseMap.get("gender"))) {
                responseMap.put("gender", infoResponseMap.get("gender"));
                }
                // 생일 정보 담기
                if (StringUtils.hasText(infoResponseMap.get("birthday"))) {
                responseMap.put("birthday", infoResponseMap.get("birthday"));
                }
                // 연령대 정보 담기
                if (StringUtils.hasText(infoResponseMap.get("age"))) {
                responseMap.put("ageRange", infoResponseMap.get("age"));
                }
                // 출생연도 정보 담기
                if (StringUtils.hasText(infoResponseMap.get("birthyear"))) {
                responseMap.put("birthyear", infoResponseMap.get("birthyear"));
                }
                // 휴대전화번호 정보 담기
                if (StringUtils.hasText(infoResponseMap.get("mobile"))) {
                responseMap.put("phone", infoResponseMap.get("mobile"));
                }*/