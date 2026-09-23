package com.luxor.shoppingcartapi.dtos;

import lombok.Data;

@Data
public class UserDto {

    private Long id;
    private String name ;
    private String email;
    private com.luxor.shoppingcartapi.Entities.Role role;
}
