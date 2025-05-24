package com.back.salcho.member.controller;

import com.back.salcho.config.JwtTokenProvider;
import com.back.salcho.member.entity.MemberEntity;
import com.back.salcho.member.service.MemberService;
import com.back.salcho.menu.entity.MenuEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/member")
public class MemberController {

    private final JwtTokenProvider jwtProvider;

    @Autowired
    private MemberService memberService;

    @Autowired
    public MemberController(JwtTokenProvider jwtProvider) {
        this.jwtProvider = jwtProvider;
    }

    @GetMapping("/duplicate")
    @ResponseBody
    public Map<String, String> duplicateCheck(@RequestParam String nickName) {
        Map<String, String> res = new HashMap<>();
        MemberEntity reqMember = new MemberEntity();
        reqMember.setNickName(nickName);
        reqMember.setType("normal");
        MemberEntity member = memberService.duplicateCheck(reqMember);
        if (member == null) {
            res.put("msg", "사용 가능한 닉네임 입니다.");
            res.put("success", "Y");
        } else {
            res.put("msg", "이미 사용중인 닉네임 입니다. 다른 닉네임을 입력해 주세요");
            res.put("success", "N");
        }
        return res;
    }

    @PostMapping("/signup")
    @ResponseBody
    public Map<String, String> signup(@RequestBody MemberEntity memberEntity) {
        Map<String, String> res = new HashMap<>();
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        memberEntity.setPassword(encoder.encode(memberEntity.getPassword())); // 비밀번호 암호화
        memberEntity.setType("normal");
        int result = memberService.signupMember(memberEntity);
        if (result > 0) {
            res.put("success", "Y");
            res.put("msg", "가입을 성공 하였습니다. 로그인 후 이용해 주세요");
        } else {
            res.put("success", "N");
            res.put("msg", "가입을 실패 하였습니다.");
        }
        return res;
    }

    @PostMapping("/signin")
    @ResponseBody
    public Map<String, Object> signIn(@RequestBody MemberEntity memberEntity) {
        Map<String, Object> res = new HashMap<>();
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        memberEntity.setType("normal");

        // DB에서 회원 정보 조회
        MemberEntity member = memberService.duplicateCheck(memberEntity);

        // 디버깅용 출력
        System.out.println("입력한 비밀번호 (평문): " + memberEntity.getPassword());
        if (member != null) {
            System.out.println("DB에 저장된 비밀번호 (암호화): " + member.getPassword());
        } else {
            System.out.println("회원 정보가 존재하지 않습니다.");
        }

        if (member != null && encoder.matches(memberEntity.getPassword(), member.getPassword())) {
            // JWT 생성
            String token = jwtProvider.createToken(member.getNickName(), member.getAuth());

            res.put("id", String.valueOf(member.getMemberId()));
            res.put("nickName", member.getNickName());
            res.put("email", member.getEmail());
            res.put("type", member.getType());
            res.put("auth", member.getAuth());
            res.put("success", "Y");
            res.put("token", token); // JWT 토큰 반환
        } else {
            res.put("success", "N");
            res.put("msg", "로그인 실패. 아이디 또는 비밀번호를 확인해주세요.");
        }
        return res;
    }


    @GetMapping("/getMember")
    @ResponseBody
    public Map<String, String> getMember(@RequestHeader("Authorization") String authHeader,
                                         @RequestParam String memberId) {
        Map<String, String> res = new HashMap<>();
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwtProvider.validateToken(token)) {
                res = memberService.getMember(memberId);
                res.put("userId", memberId);
            } else {
                res.put("msg", "토큰이 유효하지 않습니다.");
                res.put("success", "N");
            }
        } else {
            res.put("msg", "토큰이 필요합니다.");
            res.put("success", "N");
        }
        return res;
    }

    @GetMapping("/getMemberList")
    @ResponseBody
    public List<MemberEntity> getMemberList() {
        return memberService.getMemberList();
    }


    @PostMapping("/authUpdate")
    @ResponseBody
    public ResponseEntity<String> authUpdate(@RequestBody MemberEntity member) {
        try {
            memberService.authUpdate(member);  // 메뉴 업데이트 호출
            // 업데이트가 성공적으로 이루어졌다면 200 OK와 함께 성공 메시지 반환
            return ResponseEntity.ok("권한수정에 성공하였습니다.");
        } catch (Exception e) {
            // 예외가 발생한 경우, 예를 들어 데이터베이스 오류 등
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("권한을 수정하는중 오류가 발생하였습니다. " + e.getMessage());
        }
    }


    @PostMapping("/memberDelete")
    @ResponseBody
    public ResponseEntity<String> memberDelete(@RequestBody MemberEntity member) {
        try {
            memberService.memberDelete(member);  // 메뉴 업데이트 호출
            // 삭제가 성공적으로 이루어졌다면 200 OK와 함께 성공 메시지 반환
            return ResponseEntity.ok("제거가 성공하였습니다.");
        } catch (Exception e) {
            // 예외가 발생한 경우, 예를 들어 데이터베이스 오류 등
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("제거하는중 오류가 발생하였습니다. " + e.getMessage());
        }
    }

}
