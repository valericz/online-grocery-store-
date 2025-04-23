import React, { useContext } from 'react'
import './Categories.css'
import { StoreContext } from '../../Context/StoreContext'
import FoodItem from '../../components/FoodItem/FoodItem'

const Categories = () => {
    const { products, loading, error, getProductImage } = useContext(StoreContext);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className='categories'>
            <h1>All Categories</h1>
            <div className='food-display-list'>
                {products.map((item) => (
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

export default Categories 