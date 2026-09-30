package com.luxor.shoppingcartapi.dtos;

import com.luxor.shoppingcartapi.Entities.Role;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateUserRoleRequestDto {

    @NotNull(message = "Role is required")
    private Role role;
}
