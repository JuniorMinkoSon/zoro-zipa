package com.vitrinezoro.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final CorsConfigurationSource corsConfigurationSource;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public: auth endpoints, uploaded files, health check for uptime monitoring
                .requestMatchers("/api/auth/**", "/uploads/**", "/static/**", "/error", "/health").permitAll()

                // Public: browsing the catalogue (read-only)
                .requestMatchers(HttpMethod.GET,
                    "/api/artists/**", "/api/artworks/**", "/api/galleries/**",
                    "/api/exhibitions/**", "/api/solo-shows/**", "/api/media/**",
                    "/api/performances/**", "/api/products/**", "/api/masterclasses/**"
                ).permitAll()

                // Public: visitors can submit reservations and purchase orders
                .requestMatchers(HttpMethod.POST, "/api/reservations/**", "/api/orders/**").permitAll()

                // Public: entry screen — register a visitor, read/close their own session.
                // Listing every visitor (GET /api/visitors) stays admin-only via the rule below.
                .requestMatchers(HttpMethod.POST, "/api/visitors").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/visitors/me").permitAll()
                .requestMatchers(HttpMethod.DELETE, "/api/visitors/me").permitAll()

                // Everything else (all write operations, /api/users, /api/upload, /api/stats) requires ADMIN
                .anyRequest().hasRole("ADMIN")
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
