package com.luxor.shoppingcartapi.service;

import com.luxor.shoppingcartapi.Entities.Role;
import com.luxor.shoppingcartapi.Entities.User;
import com.luxor.shoppingcartapi.Mappers.UserMapper;
import com.luxor.shoppingcartapi.dtos.CreateUserRequest;
import com.luxor.shoppingcartapi.dtos.UserDto;
import com.luxor.shoppingcartapi.repositories.userRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Data
@AllArgsConstructor
@Service
public class UserService {

    private final userRepository userRepo;
    private final UserMapper Umapper;
    private final PasswordEncoder passwordEncoder;

    public UserDto createUser(CreateUserRequest request){
        User user = Umapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(Role.USER);
        User savedUser = userRepo.save(user);

        return Umapper.toDto(savedUser);
    }

    public UserDto getCurrentUser(String email){
        var user = userRepo.findByEmail(email).orElseThrow();
        return Umapper.toDto(user);
    }

    public List<UserDto> getAllUsersForAdmin() {
        return userRepo.findAllByOrderByIdAsc()
                .stream()
                .map(Umapper::toDto)
                .toList();
    }

    public UserDto updateUserRole(Long userId, Role role, String authenticatedAdminEmail) {

        if (role == null) {
            throw new IllegalArgumentException("Role must be USER or ADMIN");
        }

        User targetUser = userRepo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        User adminUser = userRepo.findByEmail(authenticatedAdminEmail)
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found"));

        if (targetUser.getId().equals(adminUser.getId()) && role == Role.USER) {
            throw new IllegalArgumentException("You cannot remove your own admin role");
        }

        targetUser.setRole(role);
        User savedUser = userRepo.save(targetUser);

        return Umapper.toDto(savedUser);
    }
}
