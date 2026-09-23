package com.luxor.shoppingcartapi.Mappers;

import ch.qos.logback.core.model.ComponentModel;
import com.luxor.shoppingcartapi.Entities.Category;
import com.luxor.shoppingcartapi.dtos.CategoryDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    CategoryDto toDto(Category category);

    Category toEntity(CategoryDto categoryDto);
}
