import React, { useContext, useEffect, useState } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../Context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

// 辅助函数：将菜单类别名称转换为与API类别名称匹配的格式
const normalizeCategory = (category) => {
  // 转换菜单类别为API类别格式
  const categoryMap = {
    "Pet Food": "Pet-food"
  };

  return categoryMap[category] || category;
};

const FoodDisplay = ({ category }) => {
  const { products, loading, error, getProductImage } = useContext(StoreContext);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // 当产品或类别改变时，过滤产品
  useEffect(() => {
    if (products.length > 0) {
      if (category === "All") {
        setFilteredProducts(products);
      } else {
        const normalizedCategory = normalizeCategory(category);
        const filtered = products.filter(item => item.category === normalizedCategory);
        setFilteredProducts(filtered);
      }
    }
  }, [products, category]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='food-display' id='food-display'>
      <h2>Shop fresh around you</h2>
      <div className='food-display-list'>
        {filteredProducts.map((item) => (
          <FoodItem
            key={item._id}
            id={item._id}
            name={item.name}
            price={item.price}
            desc={item.description}
            image={getProductImage(item.imageUrl)}
            in_stock={item.isInStock}
          />
        ))}
      </div>
    </div>
  )
}

export default FoodDisplay
