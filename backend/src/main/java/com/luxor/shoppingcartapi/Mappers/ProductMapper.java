package com.luxor.shoppingcartapi.Mappers;

import com.luxor.shoppingcartapi.Entities.Product;
import com.luxor.shoppingcartapi.dtos.ProductDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(source ="category.id" , target="categoryId" )
    ProductDto toDto(Product product);

    Product toEntity(ProductDto productDto);
}
