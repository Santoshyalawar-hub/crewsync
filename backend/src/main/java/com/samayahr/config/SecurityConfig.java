////package com.hireconnect.config;
////
////import java.util.Arrays;
////import org.springframework.beans.factory.annotation.Autowired;
////import org.springframework.context.annotation.Bean;
////import org.springframework.context.annotation.Configuration;
////import org.springframework.security.authentication.AuthenticationManager;
////import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
////import org.springframework.security.config.annotation.web.builders.HttpSecurity;
////import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
////import org.springframework.security.config.http.SessionCreationPolicy;
////import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
////import org.springframework.security.crypto.password.PasswordEncoder;
////import org.springframework.security.web.SecurityFilterChain;
////import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
////import org.springframework.web.cors.CorsConfiguration;
////import org.springframework.web.cors.CorsConfigurationSource;
////import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
////
////import com.hireconnect.security.JwtAuthenticationFilter;
////
////@Configuration
////@EnableWebSecurity
////public class SecurityConfig {
////    
////    @Autowired
////    private JwtAuthenticationFilter jwtAuthenticationFilter;
////    
////    @Bean
////    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
////        http
////            .csrf(csrf -> csrf.disable())
////            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
////            .sessionManagement(session ->
////                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
////            )
////            .authorizeHttpRequests(auth -> auth
////                // Public endpoints - NO AUTHENTICATION REQUIRED
////                .requestMatchers("/api/auth/**").permitAll()
////                .requestMatchers("/error").permitAll()
////                .requestMatchers("/uploads/**").permitAll() // Access uploaded files
////                .requestMatchers("/api/users/*/upload-photo").permitAll() // Upload photo
////                .requestMatchers("/api/users/me/upload-photo").permitAll() // Upload photo
////                .requestMatchers("/api/users/*/photo").permitAll() // Get/Delete photo
////                .requestMatchers("/api/users/me/photo").permitAll() // Get/Delete photo
////                
////                // All other endpoints
////                .anyRequest().permitAll()
////            )
////            .addFilterBefore(
////                jwtAuthenticationFilter,
////                UsernamePasswordAuthenticationFilter.class
////            );
////        
////        return http.build();
////    }
////    
////    @Bean
////    public CorsConfigurationSource corsConfigurationSource() {
////        CorsConfiguration configuration = new CorsConfiguration();
////        configuration.setAllowedOrigins(
////            Arrays.asList("http://localhost:3000", "http://localhost:5173")
////        );
////        configuration.setAllowedMethods(
////            Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
////        );
////        configuration.setAllowedHeaders(Arrays.asList("*"));
////        configuration.setAllowCredentials(true);
////        configuration.setExposedHeaders(Arrays.asList("Authorization"));
////        
////        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
////        source.registerCorsConfiguration("/**", configuration);
////        return source;
////    }
////    
////    @Bean
////    public PasswordEncoder passwordEncoder() {
////        return new BCryptPasswordEncoder();
////    }
////    
////    @Bean
////    public AuthenticationManager authenticationManager(
////            AuthenticationConfiguration config) throws Exception {
////        return config.getAuthenticationManager();
////    }
////}
//
//package com.samayahr.config;
//
//import java.util.Arrays;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.http.HttpMethod;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//import org.springframework.web.cors.CorsConfiguration;
//import org.springframework.web.cors.CorsConfigurationSource;
//import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
//
//import com.samayahr.security.JwtAuthenticationFilter;
//
//@Configuration
//@EnableWebSecurity
//public class SecurityConfig {
//    
//    @Autowired
//    private JwtAuthenticationFilter jwtAuthenticationFilter;
//    
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http
//            .csrf(csrf -> csrf.disable())
//            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
//            .sessionManagement(session ->
//                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
//            )
////            .authorizeHttpRequests(auth -> auth
////                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
////                .requestMatchers("/api/global-admin/companies/company-login").permitAll()
////                .requestMatchers("/api/auth/**").permitAll()
////                .requestMatchers("/error").permitAll()
////                .requestMatchers("/api/users/**").permitAll()
////                .requestMatchers("/api/tickets/**").permitAll()
////                .requestMatchers("/uploads/**").permitAll()
////                .requestMatchers("/api/users/*/upload-photo").permitAll()
////                .requestMatchers("/api/users/me/upload-photo").permitAll()
////                .requestMatchers("/api/users/*/photo").permitAll()
////                .requestMatchers("/api/users/me/photo").permitAll()
////                .requestMatchers("/api/company/**").permitAll()
////                .requestMatchers("/api/performance/**").permitAll()
////                .requestMatchers("/api/global-admin/**").permitAll()
////                .anyRequest().permitAll()
//            
//            .authorizeHttpRequests(auth -> auth
//            	    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
//            	    .requestMatchers("/api/global-admin/companies/company-login").permitAll()
//            	    .requestMatchers("/api/auth/**").permitAll()
//            	    .requestMatchers("/error").permitAll()
//            	    .requestMatchers("/uploads/**").permitAll()
//
//            	    // ✅ FIXED TICKETS PATH
//            	    .requestMatchers("/api/tickets/**").permitAll()
//
//            	    .requestMatchers("/api/users/**").permitAll()
//            	    .requestMatchers("/api/company/**").permitAll()
//            	    .requestMatchers("/api/performance/**").permitAll()
//            	    .requestMatchers("/api/global-admin/**").permitAll()
//            	    .requestMatchers(HttpMethod.GET,  "/api/login-access/password-summary").authenticated()
//            	    .requestMatchers(HttpMethod.POST, "/api/login-access/change-password").authenticated()
//            	    .requestMatchers("/api/login-access/**").authenticated()
//
//            	    .anyRequest().permitAll()
//            	
//
//            )
//            .addFilterBefore(
//                jwtAuthenticationFilter,
//                UsernamePasswordAuthenticationFilter.class
//            );
//
//        return http.build();
//    }
//
//    
//    @Bean
//    public CorsConfigurationSource corsConfigurationSource() {
//        CorsConfiguration configuration = new CorsConfiguration();
//
//        configuration.setAllowedOrigins(Arrays.asList(
//            "http://localhost:3000",
//            "http://localhost:5173",
//            "http://34.180.28.179:3000",
//            "http://192.168.68.58:3000"
//        ));
//
//        configuration.setAllowedMethods(Arrays.asList(
//            "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
//        ));
//
//        // ✅ IMPORTANT: explicit headers
//        configuration.setAllowedHeaders(Arrays.asList(
//            "Authorization",
//            "Content-Type",
//            "X-Tenant-Code",
//            "X-Company-Id"
//        ));
//
//        configuration.setExposedHeaders(Arrays.asList("Authorization"));
//        configuration.setAllowCredentials(true);
//        configuration.setMaxAge(3600L);
//
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/**", configuration);
//        return source;
//    }
//
//    
//    @Bean
//    public PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }
//    
//    @Bean
//    public AuthenticationManager authenticationManager(
//            AuthenticationConfiguration config) throws Exception {
//        return config.getAuthenticationManager();
//    }
//}

package com.samayahr.config;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.samayahr.security.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Value("${cors.allowed-origins:http://localhost:3000,http://localhost:5173,https://crewsync-lexu.vercel.app}")
    private String allowedOriginsRaw;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/api/global-admin/companies/company-login").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/error").permitAll()
                .requestMatchers("/uploads/**").permitAll()
                .requestMatchers("/api/tickets/**").permitAll()
                .requestMatchers("/api/users/**").permitAll()
                .requestMatchers("/api/company/**").permitAll()
                .requestMatchers("/api/performance/**").permitAll()
                .requestMatchers("/api/global-admin/**").permitAll()
                .requestMatchers("/api/login-access/**").permitAll()
                .requestMatchers("/api/auto-payroll/**").permitAll()
                .requestMatchers("/api/policies/**").permitAll()
                .requestMatchers("/api/hierarchy/**").permitAll()
                .requestMatchers("/api/leaves/**").permitAll()
                .requestMatchers("/api/admin/attendance/**").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        List<String> allowedOrigins = Arrays.stream(allowedOriginsRaw.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());

        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(allowedOrigins);
        configuration.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));
        configuration.setAllowedHeaders(Arrays.asList(
            "Authorization",
            "Content-Type",
            "X-Tenant-Code",
            "X-Company-Id"
        ));
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}