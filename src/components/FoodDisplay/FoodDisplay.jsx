import React, { useContext } from 'react'
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
  const { products, loading, error } = useContext(StoreContext);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // 将当前所选类别转换为API格式
  const normalizedCategory = normalizeCategory(category);

  return (
    <div className='food-display' id='food-display'>
      <h2>Top dishes near you</h2>
      <div className='food-display-list'>
        {products.map((item) => {
          if (category === "All" || normalizedCategory === item.category) {
            return (
              <FoodItem
                key={item._id}
                id={item._id}
                name={item.name}
                price={item.price}
                desc={item.description}
                image={item.imageUrl}
                in_stock={item.isInStock}
              />
            )
          }
          return null;
        })}
      </div>
    </div>
  )
}

export default FoodDisplay
