package com.luxor.shoppingcartapi.Mappers;

import com.luxor.shoppingcartapi.Entities.CartItem;
import com.luxor.shoppingcartapi.dtos.CartItemDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CartItemMapper {

    @Mapping(source="product.id" , target="productId" )
    CartItemDto toDto(CartItem cartItem);
}
