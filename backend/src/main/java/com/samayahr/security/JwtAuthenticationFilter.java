package com.samayahr.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.samayahr.util.JwtUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        try {
            final String authHeader = request.getHeader("Authorization");

            // ── No header or wrong prefix → continue without auth ──────────
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                filterChain.doFilter(request, response);
                return;
            }

            final String jwt = authHeader.substring(7).trim();

            // ── Empty token after "Bearer " → continue without auth ────────
            // This is the case causing your 403:
            // "JWT strings must contain exactly 2 period characters. Found: 0"
            // The token was empty — we just skip auth and continue.
            if (jwt.isEmpty()) {
                filterChain.doFilter(request, response);
                return;
            }

            // ── Basic JWT structure check — must have 2 dots ───────────────
            // Avoids the "Found: 0 period characters" exception entirely
            // by never passing a malformed string to the JWT parser.
            if (jwt.chars().filter(ch -> ch == '.').count() != 2) {
                System.err.println("JWT filter: skipping malformed token for "
                        + request.getRequestURI());
                filterChain.doFilter(request, response);
                return;
            }

            // ── Valid format — try to authenticate ─────────────────────────
            final String username = jwtUtil.extractUsername(jwt);

            if (username != null
                    && SecurityContextHolder.getContext()
                                            .getAuthentication() == null) {

                UserDetails userDetails =
                        userDetailsService.loadUserByUsername(username);

                if (jwtUtil.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities());

                    authToken.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request));

                    SecurityContextHolder.getContext()
                                         .setAuthentication(authToken);
                }
            }

            filterChain.doFilter(request, response);

        } catch (Exception e) {
            // ── Never crash the filter chain ───────────────────────────────
            System.err.println("JWT Authentication failed: " + e.getMessage());
            SecurityContextHolder.clearContext();
            filterChain.doFilter(request, response);
        }
    }
}