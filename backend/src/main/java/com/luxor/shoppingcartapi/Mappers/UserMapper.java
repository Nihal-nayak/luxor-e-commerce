package com.luxor.shoppingcartapi.Mappers;

import ch.qos.logback.core.model.ComponentModel;
import com.luxor.shoppingcartapi.Entities.User;
import com.luxor.shoppingcartapi.dtos.CreateUserRequest;
import com.luxor.shoppingcartapi.dtos.UserDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDto toDto(User user);


    User toEntity(CreateUserRequest request);
}
