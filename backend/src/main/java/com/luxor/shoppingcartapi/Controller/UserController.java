package com.luxor.shoppingcartapi.Controller;

import com.luxor.shoppingcartapi.dtos.CreateUserRequest;
import com.luxor.shoppingcartapi.dtos.UserDto;
import com.luxor.shoppingcartapi.service.UserService;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@Data
public class UserController {
    private final UserService userService;

    @PostMapping
    public ResponseEntity<UserDto> createUser(@RequestBody CreateUserRequest request){
        return ResponseEntity.ok(userService.createUser(request));
    }

    @GetMapping("/me")
    public UserDto getUser(Authentication authentication){
        String email = authentication.getName();
        return userService.getCurrentUser(email);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/Admin-test")
    public String  HelloAdmin(){
        return "Helllo Admin !";
    }

}
