package com.luxor.shoppingcartapi.repositories;

import com.luxor.shoppingcartapi.Entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category , Long> {
}
