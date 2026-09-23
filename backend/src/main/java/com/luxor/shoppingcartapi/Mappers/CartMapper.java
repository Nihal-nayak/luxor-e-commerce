package com.luxor.shoppingcartapi.Mappers;

import com.luxor.shoppingcartapi.Entities.Cart;
import com.luxor.shoppingcartapi.dtos.CartDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring",
        uses = CartItemMapper.class)
public interface CartMapper {

    @Mapping(source = "user.id",target="userId")
    @Mapping(source = "totalPrice", target = "totalPrice")
    CartDto toDto(Cart cart);
}
