package com.luxor.shoppingcartapi.service;

import com.luxor.shoppingcartapi.Security.JwtConfig;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.io.Decoders;
import lombok.Data;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@Data
public class JwtService {

    private final JwtConfig jwtConfig;

    public String generateAccessToken(Long userId) {
        return generateToken(
                userId,
                "access",
                jwtConfig.getAccessTokenExpiration()
        );
    }

    public String generateRefreshToken(Long userId) {
        return generateToken(
                userId,
                "refresh",
                jwtConfig.getRefreshTokenExpiration()
        );
    }

    private String generateToken(
            Long userId,
            String tokenType,
            Long expirationTime
    ) {
        return Jwts.builder()
                .subject(userId.toString())
                .claim("tokenType", tokenType)
                .issuedAt(new Date())
                .expiration(
                        new Date(System.currentTimeMillis() + expirationTime)
                )
                .signWith(
                        Keys.hmacShaKeyFor(
                                Decoders.BASE64.decode(jwtConfig.getSecret())
                        )
                )
                .compact();
    }

    public String ExtractUsername(String token) {
        var claims = Jwts.parser()
                .verifyWith(
                        Keys.hmacShaKeyFor(
                                Decoders.BASE64.decode(jwtConfig.getSecret())
                        )
                )
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.getSubject();
    }

    public String extractTokenType(String token) {
        var claims = Jwts.parser()
                .verifyWith(
                        Keys.hmacShaKeyFor(
                                Decoders.BASE64.decode(jwtConfig.getSecret())
                        )
                )
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.get("tokenType", String.class);
    }
}