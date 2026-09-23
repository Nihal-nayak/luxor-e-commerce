package com.luxor.shoppingcartapi.service;

import com.luxor.shoppingcartapi.Entities.Category;
import com.luxor.shoppingcartapi.Mappers.CategoryMapper;
import com.luxor.shoppingcartapi.dtos.CategoryDto;
import com.luxor.shoppingcartapi.repositories.CategoryRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class CategoryService {
    private final CategoryMapper categoryMapper;
    private final CategoryRepository categoryRepository;

    public CategoryDto createCategory(CategoryDto categoryDto){

        Category category = categoryMapper.toEntity(categoryDto);

        return categoryMapper.toDto(categoryRepository.save(category));

    }

    public List<CategoryDto> getAllCategory(){
        return categoryRepository.findAll()
                .stream()
                .map(categoryMapper::toDto)
                .toList();
    }


}
