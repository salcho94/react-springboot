package com.back.salcho.config;

import io.jsonwebtoken.JwtException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.List;

public class JwtTokenFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final List<String> excludedUrls;

    public JwtTokenFilter(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;

        // JWT 검증을 생략할 URL 목록
        this.excludedUrls = Arrays.asList(
                "/api/member/signin",
                "/api/member/signup",
                "/api/kakao",
                "/api/member/duplicate",
                "/swagger-ui/**",
                "/v3/api-docs/**",
                "/swagger-ui/index.html",
                "/favicon.ico",
                "/ws/chat"
        );
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String requestUri = request.getRequestURI();

        // 검증을 생략할 URL인지 확인
        if (isExcluded(requestUri) || (requestUri.contains("swagger") || requestUri.contains("v3"))) {
            filterChain.doFilter(request, response); // 필터 건너뛰기
            return;
        }

        String token = resolveToken(request);

        try {
            if (token != null && jwtTokenProvider.validateToken(token)) {
                String username = jwtTokenProvider.extractUsername(token);
                SecurityContextHolder.getContext().setAuthentication(
                        new UsernamePasswordAuthenticationToken(username, null, new ArrayList<>())
                );
            } else if (token == null) {
                throw new JwtException("로그인 후 이용해 주세요");
            }
            filterChain.doFilter(request, response); // 다음 필터로 전달
        } catch (JwtException e) {
            // JWT 검증 실패 처리
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401 상태 코드
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"error\": \"Unauthorized\", \"message\": \"" + e.getMessage() + "\"}");
        }
    }

    // URL 검증을 생략할지 확인
    private boolean isExcluded(String uri) {
        return excludedUrls.stream().anyMatch(uri::startsWith);
    }

    // 토큰을 헤더에서 추출
    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // "Bearer " 이후 토큰 값만 추출
        }
        return null;
    }
}
