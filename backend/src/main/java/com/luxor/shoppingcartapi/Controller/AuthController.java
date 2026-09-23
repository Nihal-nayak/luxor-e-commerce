package com.luxor.shoppingcartapi.Controller;

import com.luxor.shoppingcartapi.Entities.User;
import com.luxor.shoppingcartapi.dtos.LoginRequest;
import com.luxor.shoppingcartapi.dtos.JwtResponse;
import com.luxor.shoppingcartapi.repositories.userRepository;
import com.luxor.shoppingcartapi.service.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/Auth")
@AllArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final userRepository userRepo;

    @PostMapping("/Login")
    public ResponseEntity<JwtResponse> login(
            @RequestBody LoginRequest request , HttpServletResponse response) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepo.findByEmail(authentication.getName())
                .orElseThrow();

        String accessToken = jwtService.generateAccessToken(user.getId());
        String refreshToken = jwtService.generateRefreshToken(user.getId());

        Cookie cookie = new Cookie("refreshToken", refreshToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/Auth/Refresh");
        cookie.setMaxAge(7 * 24 * 60 * 60);
        response.addCookie(cookie);

        return ResponseEntity.ok(
                new JwtResponse(accessToken)
        );

    }

    @PostMapping("/Refresh")
    public ResponseEntity<JwtResponse> refresh(
            @CookieValue("refreshToken") String refreshToken) {

        String tokenType = jwtService.extractTokenType(refreshToken);

        if (!tokenType.equals("refresh")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Long username = Long.valueOf(jwtService.ExtractUsername(refreshToken));

        String accessToken = jwtService.generateAccessToken(username);

        return ResponseEntity.ok(
                new JwtResponse(accessToken)
        );
    }


    @PostMapping("/Logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {

        Cookie cookie = new Cookie("refreshToken", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/Auth/Refresh");
        cookie.setMaxAge(0);

        response.addCookie(cookie);

        return ResponseEntity.ok().build();
    }
}