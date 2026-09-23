package com.luxor.shoppingcartapi.Mappers;

import com.luxor.shoppingcartapi.Entities.Order;
import com.luxor.shoppingcartapi.dtos.OrderDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = OrderItemMapper.class)
public interface OrderMapper {

    @Mapping(source = "user.id", target = "userId")
    OrderDto toDto(Order order);
}