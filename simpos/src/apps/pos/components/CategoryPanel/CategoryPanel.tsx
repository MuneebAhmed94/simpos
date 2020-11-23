import { Box } from '@chakra-ui/react';
import React, { useEffect, useMemo, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { PosCategory, posCategoryRepository } from '../../../../services/db';
import { CategoryButton } from './CategoryButton';

export const CategoryPanel: React.FunctionComponent = () => {
  const [categories, setCategories] = useState<PosCategory[]>([]);
  const [selectedCategoryId, setSelectedCategory] = useState<number>(0);
  const fetchCategories = async () => {
    setCategories(await posCategoryRepository.treeCategories());
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const childCategories = useMemo(() => {
    const selectedCategory = categories.find(
      ({ id }) => id === selectedCategoryId,
    );
    if (selectedCategory && selectedCategory.children) {
      return selectedCategory.children;
    }
    return [];
  }, [selectedCategoryId, categories]);

  const onClickCategory = (category: PosCategory) => {
    console.log(category.id);
  };
  const onClickRootCategory = (category: PosCategory) => {
    if (category.children && category.children.length > 0) {
      setSelectedCategory(category.id);
    } else {
      setSelectedCategory(0);
      onClickCategory(category);
    }
  };
  return (
    <Box px={4} mb={2}>
      <Swiper spaceBetween={8} slidesPerView="auto">
        {categories.map((category) => (
          <SwiperSlide key={category.id} style={{ width: 'auto' }}>
            <CategoryButton
              name={category.name}
              onClick={() => onClickRootCategory(category)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <Box h={2} />
      {!!selectedCategoryId && (
        <Swiper spaceBetween={8} slidesPerView="auto">
          {childCategories.map((category) => (
            <SwiperSlide key={category.id} style={{ width: 'auto' }}>
              <CategoryButton
                name={category.name}
                onClick={() => onClickCategory(category)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </Box>
  );
};
