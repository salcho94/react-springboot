package com.back.salcho.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtTokenProvider {

    private final Key secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);  // 256비트 이상 비밀 키 생성

    @Value("${jwt.expirationTime}")
    private long expirationTime; // application.properties에서 만료 시간 읽어옴

    public String createToken(String username, String roles) {
        Claims claims = Jwts.claims().setSubject(username); // 사용자 이름 설정
        claims.put("roles", roles); // 역할 추가

        Date now = new Date();
        Date validity = new Date(now.getTime() + expirationTime); // 만료 시간 설정

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(validity)
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }

    public String extractUsername(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(secretKey)
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject(); // JWT 토큰에서 사용자 이름을 추출
        } catch (JwtException | IllegalArgumentException e) {
            // 토큰이 유효하지 않거나 오류가 발생하면 null 반환
            return null;
        }
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(secretKey) // secretKey는 검증에 사용하는 키
                    .build()
                    .parseClaimsJws(token);
            return true; // 토큰이 유효하면 true 반환
        } catch (JwtException | IllegalArgumentException e) {
            throw new JwtException("토큰이 유효하지 않습니다."); // 예외를 던짐
        }
    }

}
