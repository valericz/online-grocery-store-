import React, { useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext'
import FoodItem from '../../components/FoodItem/FoodItem'
import './SearchResults.css'

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const { food_list } = useContext(StoreContext);
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        if (query.trim()) {
            const results = food_list.filter(item =>
                item.food_name.toLowerCase().includes(query.toLowerCase()) ||
                item.food_desc.toLowerCase().includes(query.toLowerCase())
            );
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    }, [query, food_list]);

    return (
        <div className='search-results'>
            <h2>Search Results for "{query}"</h2>
            {searchResults.length === 0 ? (
                <p className="no-results">No products found matching your search.</p>
            ) : (
                <div className="food-display-list">
                    {searchResults.map((item) => (
                        <FoodItem
                            key={item.food_id}
                            id={item.food_id}
                            name={item.food_name}
                            price={item.food_price}
                            desc={item.food_desc}
                            image={item.food_image}
                            in_stock={item.in_stock}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default SearchResults 