package com.luxor.shoppingcartapi.Controller;

import com.luxor.shoppingcartapi.dtos.UpdateUserRoleRequestDto;
import com.luxor.shoppingcartapi.dtos.UserDto;
import com.luxor.shoppingcartapi.service.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/users")
@AllArgsConstructor
public class AdminUserController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsersForAdmin());
    }

    @PatchMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> updateUserRole(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRoleRequestDto request,
            Authentication authentication) {

        return ResponseEntity.ok(
                userService.updateUserRole(
                        id,
                        request.getRole(),
                        authentication.getName()
                )
        );
    }
}
