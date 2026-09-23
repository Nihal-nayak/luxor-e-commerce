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
}
