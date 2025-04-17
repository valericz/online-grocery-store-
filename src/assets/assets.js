import basket_icon from './basket_icon.png'
import logo from './logo.png'
import header_img from './header_img.png'
import search_icon from './search_icon.png'
import frozen_icon from './menu_1.png'
import fresh_icon from './menu_2.png'
import beverages_icon from './menu_3.png'
import home_icon from './menu_4.png'
import pet_icon from './menu_5.png'
import dairy_icon from './menu_6.png'
import bakery_icon from './menu_7.png'
import pantry_icon from './menu_8.png'
import rating_starts from './rating_starts.png'
import product_1 from './food_1.png'
import product_2 from './food_2.png'
import product_3 from './food_3.png'
import product_4 from './food_4.png'
import product_5 from './food_5.png'
import product_6 from './food_6.png'
import product_7 from './food_7.png'
import product_8 from './food_8.png'
import product_9 from './food_9.png'
import product_10 from './food_10.png'
import product_11 from './food_11.png'
import product_12 from './food_12.png'
import product_13 from './food_13.png'
import product_14 from './food_14.png'
import product_15 from './food_15.png'
import product_16 from './food_16.png'
import product_17 from './food_17.png'
import product_18 from './food_18.png'
import product_19 from './food_19.png'
import product_20 from './food_20.png'
import product_21 from './food_21.png'
import product_22 from './food_22.png'
import product_23 from './food_23.png'
import product_24 from './food_24.png'
import product_25 from './food_25.png'
import product_26 from './food_26.png'
import product_27 from './food_27.png'
import product_28 from './food_28.png'
import product_29 from './food_29.png'
import product_30 from './food_30.png'
import product_31 from './food_31.png'
import product_32 from './food_32.png'

import add_icon_white from './add_icon_white.png'
import add_icon_green from './add_icon_green.png'
import remove_icon_red from './remove_icon_red.png'
import app_store from './app_store.png'
import play_store from './play_store.png'
import linkedin_icon from './linkedin_icon.png'
import facebook_icon from './facebook_icon.png'
import twitter_icon from './twitter_icon.png'
import cross_icon from './cross_icon.png'
import selector_icon from './selector_icon.png'
import order_icon from './basket_icon.png'

export const assets = {
    logo,
    basket_icon,
    header_img,
    search_icon,
    rating_starts,
    add_icon_green,
    add_icon_white,
    remove_icon_red,
    app_store,
    play_store,
    linkedin_icon,
    facebook_icon,
    twitter_icon,
    cross_icon,
    selector_icon,
    order_icon
}

export const menu_list = [
    {
        menu_name: "Frozen",
        menu_image: frozen_icon
    },
    {
        menu_name: "Fresh",
        menu_image: fresh_icon
    },
    {
        menu_name: "Beverages",
        menu_image: beverages_icon
    },
    {
        menu_name: "Home",
        menu_image: home_icon
    },
    {
        menu_name: "Pet Food",
        menu_image: pet_icon
    },
    {
        menu_name: "Dairy",
        menu_image: dairy_icon
    },
    {
        menu_name: "Bakery",
        menu_image: bakery_icon
    },
    {
        menu_name: "Pantry",
        menu_image: pantry_icon
    }
]

export const food_list = [
    {
        food_id: 1,
        food_name: "Frozen Pizza",
        food_image: product_1,
        food_price: 8.99,
        food_desc: "12-inch pepperoni pizza, ready to bake",
        food_category: "Frozen",
        in_stock: true,
        quantity: 100
    },
    {
        food_id: 2,
        food_name: "Frozen Vegetables",
        food_image: product_2,
        food_price: 4.99,
        food_desc: "Mixed vegetables, 1kg pack",
        food_category: "Frozen",
        in_stock: false,
        quantity: 0
    },
    {
        food_id: 3,
        food_name: "Fresh Apples",
        food_image: product_3,
        food_price: 2.99,
        food_desc: "Red delicious apples, 1kg",
        food_category: "Fresh",
        in_stock: true,
        quantity: 100
    },
    {
        food_id: 4,
        food_name: "Fresh Bananas",
        food_image: product_4,
        food_price: 1.99,
        food_desc: "Ripe bananas, 1kg",
        food_category: "Fresh",
        in_stock: false,
        quantity: 0
    },
    {
        food_id: 5,
        food_name: "Orange Juice",
        food_image: product_5,
        food_price: 3.99,
        food_desc: "Freshly squeezed orange juice, 1L",
        food_category: "Beverages",
        in_stock: true,
        quantity: 100
    },
    {
        food_id: 6,
        food_name: "Mineral Water",
        food_image: product_6,
        food_price: 1.99,
        food_desc: "Natural mineral water, 1.5L",
        food_category: "Beverages",
        in_stock: true,
        quantity: 100
    },
    {
        food_id: 7,
        food_name: "Laundry Detergent",
        food_image: product_7,
        food_price: 12.99,
        food_desc: "Eco-friendly laundry detergent, 2L",
        food_category: "Home",
        in_stock: true,
        quantity: 100
    },
    {
        food_id: 8,
        food_name: "Dish Soap",
        food_image: product_8,
        food_price: 3.99,
        food_desc: "Lemon-scented dish soap, 500ml",
        food_category: "Home",
        in_stock: false,
        quantity: 0
    },
    {
        food_id: 9,
        food_name: "Dog Food",
        food_image: product_9,
        food_price: 24.99,
        food_desc: "Premium dry dog food, 5kg",
        food_category: "Pet Food",
        in_stock: true,
        quantity: 100
    },
    {
        food_id: 10,
        food_name: "Cat Food",
        food_image: product_10,
        food_price: 19.99,
        food_desc: "Grain-free cat food, 2kg",
        food_category: "Pet Food",
        in_stock: true,
        quantity: 100
    },
    {
        food_id: 11,
        food_name: "Milk",
        food_image: product_11,
        food_price: 2.99,
        food_desc: "Fresh whole milk, 2L",
        food_category: "Dairy",
        in_stock: true,
        quantity: 100
    },
    {
        food_id: 12,
        food_name: "Cheese",
        food_image: product_12,
        food_price: 4.99,
        food_desc: "Cheddar cheese, 200g",
        food_category: "Dairy",
        in_stock: false,
        quantity: 0
    },
    {
        food_id: 13,
        food_name: "Bread",
        food_image: product_13,
        food_price: 2.49,
        food_desc: "Whole grain bread, 500g",
        food_category: "Bakery",
        in_stock: true,
        quantity: 100
    },
    {
        food_id: 14,
        food_name: "Croissants",
        food_image: product_14,
        food_price: 3.99,
        food_desc: "Fresh butter croissants, pack of 4",
        food_category: "Bakery",
        in_stock: true,
        quantity: 100
    },
    {
        food_id: 15,
        food_name: "Pasta",
        food_image: product_15,
        food_price: 1.99,
        food_desc: "Spaghetti pasta, 500g",
        food_category: "Pantry",
        in_stock: true,
        quantity: 100
    },
    {
        food_id: 16,
        food_name: "Rice",
        food_image: product_16,
        food_price: 3.99,
        food_desc: "Basmati rice, 1kg",
        food_category: "Pantry",
        in_stock: true,
        quantity: 100
    }
]
