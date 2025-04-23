import React, { useContext, useEffect, useState } from 'react'
import './ExploreMenu.css'
import { StoreContext } from '../../Context/StoreContext'

const ExploreMenu = ({ category, setCategory }) => {

  const { menu_list, categories } = useContext(StoreContext);
  const [menuItems, setMenuItems] = useState([]);

  // 将API分类和静态菜单项合并
  useEffect(() => {
    if (categories && categories.length > 0) {
      // 合并现有菜单项和API获取的分类
      const existingCategories = menu_list.map(item => item.menu_name);

      // 创建新分类菜单项
      const newCategoryItems = categories
        .filter(cat => !existingCategories.includes(cat))
        .map(cat => ({
          menu_name: cat,
          menu_image: '/images/default-category.png' // 使用默认图片
        }));

      // 合并两个列表
      const combined = [...menu_list, ...newCategoryItems];
      setMenuItems(combined);
    } else {
      // 如果没有API分类，使用静态菜单
      setMenuItems(menu_list);
    }
  }, [categories, menu_list]);

  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Explore our menu</h1>
      <p className='explore-menu-text'>Choose from a diverse menu featuring a delectable array of dishes. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.</p>
      <div className="explore-menu-list">
        {menuItems.map((item, index) => {
          return (
            <div onClick={() => setCategory(prev => prev === item.menu_name ? "All" : item.menu_name)} key={index} className='explore-menu-list-item'>
              <img src={item.menu_image} className={category === item.menu_name ? "active" : ""} alt="" />
              <p>{item.menu_name}</p>
            </div>
          )
        })}
      </div>
      <hr />
    </div>
  )
}

export default ExploreMenu
