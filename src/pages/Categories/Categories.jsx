import React, { useContext } from 'react'
import './Categories.css'
import { StoreContext } from '../../Context/StoreContext'
import FoodItem from '../../components/FoodItem/FoodItem'

const Categories = () => {
    const { food_list } = useContext(StoreContext);

    return (
        <div className='categories'>
            <h1>All Categories</h1>
            <div className='food-display-list'>
                {food_list.map((item) => (
                    <FoodItem
                        key={item.food_id}
                        image={item.food_image}
                        name={item.food_name}
                        desc={item.food_desc}
                        price={item.food_price}
                        id={item.food_id}
                        in_stock={item.in_stock}
                    />
                ))}
            </div>
        </div>
    )
}

export default Categories 