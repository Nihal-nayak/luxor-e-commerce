package com.luxor.shoppingcartapi.service;

import com.luxor.shoppingcartapi.Entities.Category;
import com.luxor.shoppingcartapi.Mappers.CategoryMapper;
import com.luxor.shoppingcartapi.dtos.CategoryDto;
import com.luxor.shoppingcartapi.repositories.CategoryRepository;
import com.luxor.shoppingcartapi.repositories.productRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class CategoryService {

    private final CategoryMapper categoryMapper;
    private final CategoryRepository categoryRepository;
    private final productRepository productRepo;

    public CategoryDto createCategory(CategoryDto categoryDto) {
        String name = categoryDto.getName();
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Category name must not be blank.");
        }
        if (categoryRepository.existsByNameIgnoreCase(name.trim())) {
            throw new IllegalArgumentException("A category with this name already exists.");
        }
        categoryDto.setName(name.trim());
        Category category = categoryMapper.toEntity(categoryDto);
        return categoryMapper.toDto(categoryRepository.save(category));
    }

    public List<CategoryDto> getAllCategory() {
        return categoryRepository.findAll()
                .stream()
                .map(categoryMapper::toDto)
                .toList();
    }

    public CategoryDto updateCategory(Long id, CategoryDto categoryDto) {
        String name = categoryDto.getName();
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Category name must not be blank.");
        }
        Category existing = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found with id: " + id));

        // Allow keeping the same name (case-insensitive), but reject if another category has that name
        if (!existing.getName().equalsIgnoreCase(name.trim())) {
            if (categoryRepository.existsByNameIgnoreCase(name.trim())) {
                throw new IllegalArgumentException("A category with this name already exists.");
            }
        }

        existing.setName(name.trim());
        return categoryMapper.toDto(categoryRepository.save(existing));
    }

    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new IllegalArgumentException("Category not found with id: " + id);
        }
        if (productRepo.existsByCategoryId(id)) {
            throw new IllegalArgumentException(
                    "Cannot delete category because products are assigned to it. " +
                    "Reassign or remove those products first."
            );
        }
        categoryRepository.deleteById(id);
    }
}
