package com.back.salcho.member.controller;

import com.back.salcho.config.JwtTokenProvider;
import com.back.salcho.member.entity.MemberEntity;
import com.back.salcho.member.service.MemberService;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
public class KakaoController {
    @Autowired
    private MemberService memberService;

    private final JwtTokenProvider jwtProvider;

    @Autowired
    public KakaoController(JwtTokenProvider jwtProvider) {
        this.jwtProvider = jwtProvider;
    }

    @GetMapping("/api/kakao")
    @ResponseBody
    public Map<String,String> kakaoCallback(@RequestParam String accessToken) {
        Map<String, String> res = new HashMap<>();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        //HttpHeader 담기
        RestTemplate rt = new RestTemplate();
        HttpEntity<MultiValueMap<String, String>> httpEntity = new HttpEntity<>(headers);
        ResponseEntity<String> response = rt.exchange(
                "https://kapi.kakao.com/v2/user/me",
                HttpMethod.POST,
                httpEntity,
                String.class
        );
        //Response 데이터 파싱
        JSONParser jsonParser = new JSONParser();
        JSONObject jsonObj    = null;
        try {
            jsonObj = (JSONObject) jsonParser.parse(response.getBody());
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
        JSONObject account = (JSONObject) jsonObj.get("kakao_account");
        JSONObject profile = (JSONObject) account.get("profile");

        long id = (long) jsonObj.get("id");
        String email = String.valueOf(account.get("email"));
        String nickName = String.valueOf(profile.get("nickname"));
        MemberEntity reqMember = new MemberEntity();
        reqMember.setNickName(nickName);
        reqMember.setType("kakao");
        MemberEntity member = memberService.duplicateCheck(reqMember);
        int resultYn =0;
        res.put("email",email);
        res.put("nickName",nickName);

        reqMember.setNickName(nickName);
        reqMember.setEmail(email);

        if(member == null) {
            reqMember.setType("kakao");
            resultYn = memberService.signupMember(reqMember);
        }

        MemberEntity getMember = memberService.duplicateCheck(reqMember);
        String token = jwtProvider.createToken(String.valueOf(getMember.getMemberId()),"user");
        res.put("id", String.valueOf(getMember.getMemberId()));
        res.put("auth", String.valueOf(getMember.getAuth()));
        res.put("type",getMember.getType());
        res.put("token",token);
        res.put("target",getMember.getTarget());
        res.put("success",resultYn > 0 ? "Y" : "N");

        return res;
    }

}
