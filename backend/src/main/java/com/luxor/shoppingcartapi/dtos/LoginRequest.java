package com.luxor.shoppingcartapi.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "password cannot be blank ")
    private String password;

    @Email
    private String email;
}
