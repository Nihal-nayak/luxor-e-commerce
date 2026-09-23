package com.luxor.shoppingcartapi.dtos;

import lombok.Data;

@Data
public class CreateUserRequest {
    private String email;
    private String name;
    private String password;
}
