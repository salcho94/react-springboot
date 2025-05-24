package com.back.salcho.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
@Configuration
public class SecurityConfig  {

    private final JwtTokenProvider jwtTokenProvider;

    public SecurityConfig(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    /**
     * PasswordEncoder를 Bean으로 등록
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Spring Security Filter Chain 설정
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .httpBasic().disable() // 기본 인증 비활성화
                .csrf().disable() // CSRF 비활성화
                .cors().configurationSource(corsConfigurationSource()) // CORS 설정 적용
                .and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS) // 세션 정책 설정
                .and()
                .authorizeRequests()
                .antMatchers(
                        "/api/member/signin",
                        "/api/member/signup",
                        "/api/kakao",
                        "/api/member/duplicate",
                        "/swagger-ui/**",  // Swagger UI
                        "/v3/api-docs/**", // Swagger API Docs
                        "/favicon.ico",
                        "/ws/chat/**",
                        "/"
                ).permitAll() // 인증 없이 접근 가능
                .anyRequest().authenticated() // 나머지는 인증 필요
                .and()
                .addFilterBefore(new JwtTokenFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class) // JWT 필터 추가
                .formLogin()
                .disable() // Swagger UI에서 로그인 페이지로 리다이렉트되지 않도록 비활성화
                .logout()
                .logoutSuccessUrl("/"); // 로그아웃 성공 시 이동할 URL

        return http.build();
    }

    /**
     * CORS 설정
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOriginPattern("*"); // 모든 Origin 허용
        config.addAllowedHeader("*"); // 모든 Header 허용
        config.addAllowedMethod("*"); // 모든 HTTP Method 허용
        config.setAllowCredentials(true); // Credentials 허용

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config); // 모든 경로에 대해 설정 적용
        return source;
    }
}
