import { createContext, useEffect, useState } from "react";
import { food_list, menu_list } from "../assets/assets";

export const StoreContext = createContext(null);

const getDefaultCart = () => {
    let cart = {};
    return cart;
}

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState(getDefaultCart());
    const [ordersData, setOrdersData] = useState(() => {
        const savedOrders = localStorage.getItem('ordersData');
        return savedOrders ? JSON.parse(savedOrders) : [];
    });
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userCredentials, setUserCredentials] = useState([]);
    const MAX_QUANTITY = 10;

    // Load cart items, orders, and user credentials from localStorage on component mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cartItems');
        const savedOrders = localStorage.getItem('ordersData');
        const savedCredentials = localStorage.getItem('userCredentials');
        const savedUser = localStorage.getItem('user');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
        if (savedOrders) {
            setOrdersData(JSON.parse(savedOrders));
        }
        if (savedCredentials) {
            setUserCredentials(JSON.parse(savedCredentials));
        }
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            setIsAdmin(parsedUser?.email === 'admin@admin.com');
        }
    }, []);

    // Save cart items, orders, and user credentials to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        localStorage.setItem('ordersData', JSON.stringify(ordersData));
        localStorage.setItem('userCredentials', JSON.stringify(userCredentials));
        localStorage.setItem('user', JSON.stringify(user));
    }, [cartItems, ordersData, userCredentials, user]);

    const validateQuantity = (itemId) => {
        const currentQuantity = cartItems[itemId] || 0;
        return currentQuantity < MAX_QUANTITY;
    };

    const addToCart = (itemId) => {
        if (!validateQuantity(itemId)) {
            return false;
        }
        const item = food_list.find(item => item.food_id === itemId);
        if (item && item.in_stock && item.quantity > 0) {
            setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
            return true;
        }
        return false;
    };

    const removeFromCart = (itemId) => {
        if (cartItems[itemId] === 0) return;
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product.food_id === Number(item));
                if (itemInfo && itemInfo.in_stock) {
                    totalAmount += itemInfo.food_price * cartItems[item];
                }
            }
        }
        return totalAmount;
    };

    const registerUser = async (email, phone, password) => {
        // Check if user already exists
        if (userCredentials.some(cred => cred.email === email)) {
            return { success: false, message: "Email already registered" };
        }

        // Directly add the user to credentials
        const newUser = { email, phone, password };
        setUserCredentials(prev => [...prev, newUser]);

        // Automatically log in the user
        setUser({ email, name: email.split('@')[0] });
        setIsAdmin(false);

        return {
            success: true,
            message: "Registration successful!",
            requiresVerification: false
        };
    };

    const resetCredentials = () => {
        setUserCredentials([]);
        setUser(null);
        setIsAdmin(false);
        localStorage.removeItem('userCredentials');
        localStorage.removeItem('user');
    };

    const login = (email, password) => {
        try {
            // Admin login check
            if (email === 'admin@admin.com' && password === 'admin123') {
                const user = { email, name: 'Admin' };
                setUser(user);
                setIsAdmin(true);
                localStorage.setItem('user', JSON.stringify(user));
                return { success: true };
            }

            // Regular user login
            const existingUser = userCredentials.find(cred => cred.email === email);

            if (!existingUser) {
                return {
                    success: false,
                    message: "Invalid email or password"
                };
            }

            if (existingUser.password !== password) {
                return {
                    success: false,
                    message: "Invalid email or password"
                };
            }

            // Successful login
            const user = { email, name: email.split('@')[0] };
            setUser(user);
            setIsAdmin(false);
            localStorage.setItem('user', JSON.stringify(user));
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: "An error occurred during login"
            };
        }
    };

    const logout = () => {
        setUser(null);
        setIsAdmin(false);
    };

    const placeOrder = (deliveryData) => {
        const orderItems = [];
        let totalAmount = 0;

        // Check if all items are still in stock
        for (const itemId in cartItems) {
            const item = food_list.find(item => item.food_id === Number(itemId));
            if (!item || !item.in_stock) {
                return { success: false, message: "Some items are no longer in stock" };
            }
            orderItems.push({
                ...item,
                quantity: cartItems[itemId]
            });
            totalAmount += item.food_price * cartItems[itemId];
        }

        // Create the order object
        const order = {
            id: Date.now(),
            items: orderItems,
            totalAmount: totalAmount + 5, // Including delivery fee
            deliveryData,
            date: new Date().toISOString(),
            status: 'pending',
            userEmail: user?.email // Use the logged-in user's email
        };

        // Add the order to ordersData
        setOrdersData(prev => {
            const newOrders = [...prev, order];
            // Save to localStorage immediately
            localStorage.setItem('ordersData', JSON.stringify(newOrders));
            return newOrders;
        });

        // Clear the cart
        setCartItems({});
        localStorage.removeItem('cartItems');

        return { success: true, order };
    };

    const getOrders = () => {
        if (isAdmin) {
            return ordersData;
        }
        // Filter orders for the current user
        return ordersData.filter(order => order.userEmail === user?.email);
    };

    const updateOrderStatus = (orderId, newStatus) => {
        if (!isAdmin) return false;

        setOrdersData(prev => prev.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        ));
        return true;
    };

    const clearCart = () => {
        setCartItems({});
        localStorage.removeItem('cartItems');
    };

    const contextValue = {
        food_list,
        menu_list,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        placeOrder,
        login,
        logout,
        registerUser,
        resetCredentials,
        user,
        isAdmin,
        getOrders,
        updateOrderStatus,
        MAX_QUANTITY,
        validateQuantity,
        clearCart
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;