
package com.luxor.shoppingcartapi.Mappers;

import com.luxor.shoppingcartapi.Entities.OrderItem;
import com.luxor.shoppingcartapi.dtos.OrderItemDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrderItemMapper {

    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "product.name", target = "productName")
    @Mapping(source = "product.imageUrl", target = "productImageUrl")
    OrderItemDto toDto(OrderItem orderItem);
}