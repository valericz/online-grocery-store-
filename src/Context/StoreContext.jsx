import { createContext, useEffect, useState } from "react";
import { menu_list } from "../assets/assets";

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
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const MAX_QUANTITY = 10;

    // 动态加载图片的工具函数
    const getProductImage = (imageUrl) => {
        if (!imageUrl) return null;

        // 如果是完整URL，直接返回
        if (imageUrl.startsWith('http')) return imageUrl;

        // 使用public文件夹中的图片
        return `/images/${imageUrl}`;
    };

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                console.log('Fetching products from API...');
                const response = await fetch('http://localhost:3000/api/products');

                console.log('Response status:', response.status);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => null);
                    console.error('Response not OK:', errorData || response.statusText);
                    throw new Error(
                        errorData?.message ||
                        `Failed to fetch products: ${response.status} ${response.statusText}`
                    );
                }

                const data = await response.json();
                console.log('Products fetched successfully:', data.length || 0, 'items');
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                setError(error.message);
                setLoading(false);

                // Fallback to static data if available
                // If you have static data as backup, you can use it here
            }
        };

        fetchProducts();
    }, []);

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
        const item = products.find(item => item._id === itemId);
        if (!item) {
            console.error('Tried to add non-existent item to cart:', itemId);
            return false;
        }

        if (!item.isInStock) {
            // Item is out of stock, can't add to cart
            console.warn('Attempted to add out-of-stock item to cart:', item.name);
            // You could show a toast notification here if you want
            return false;
        }

        setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
        return true;
    };

    const removeFromCart = (itemId) => {
        if (!cartItems[itemId]) return;
        setCartItems((prev) => {
            const newQuantity = prev[itemId] - 1;
            if (newQuantity <= 0) {
                const newCart = { ...prev };
                delete newCart[itemId];
                return newCart;
            }
            return { ...prev, [itemId]: newQuantity };
        });
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = products.find((product) => product._id === item);
                if (itemInfo && itemInfo.isInStock) {
                    totalAmount += itemInfo.price * cartItems[item];
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

    const placeOrder = async (deliveryData) => {
        const orderItems = [];
        let totalAmount = 0;

        // Check if all items are still in stock
        const outOfStockItems = [];
        const insufficientStockItems = [];

        for (const itemId in cartItems) {
            const item = products.find(item => item._id === itemId);
            if (!item || !item.isInStock) {
                outOfStockItems.push(item ? item.name : 'Unknown item');
            } else if (item.countInStock < cartItems[itemId]) {
                // Check if requested quantity exceeds available stock
                insufficientStockItems.push({
                    name: item.name,
                    requested: cartItems[itemId],
                    available: item.countInStock
                });
            } else {
                orderItems.push({
                    food_id: item._id,
                    name: item.name,
                    imageUrl: item.imageUrl,
                    price: item.price,
                    quantity: cartItems[itemId],
                    category: item.category
                });
                totalAmount += item.price * cartItems[itemId];
            }
        }

        if (outOfStockItems.length > 0) {
            return {
                success: false,
                message: `The following items are out of stock: ${outOfStockItems.join(', ')}`,
                outOfStockItems
            };
        }

        if (insufficientStockItems.length > 0) {
            const itemsMessage = insufficientStockItems.map(item =>
                `${item.name} (requested: ${item.requested}, available: ${item.available})`
            ).join(', ');

            return {
                success: false,
                message: `Insufficient stock for: ${itemsMessage}`,
                insufficientStockItems
            };
        }

        // Total amount includes delivery fee
        const finalTotalAmount = totalAmount + 5;

        try {
            // Create order in backend
            const response = await fetch('http://localhost:3000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: orderItems,
                    deliveryData,
                    totalAmount: finalTotalAmount
                }),
            });

            const responseData = await response.json();

            if (!response.ok) {
                // Check if the error is due to insufficient stock
                if (responseData.insufficientItems && responseData.insufficientItems.length > 0) {
                    const itemNames = responseData.insufficientItems.map(item =>
                        `${item.name} (requested: ${item.requested}, available: ${item.available})`
                    ).join(', ');

                    return {
                        success: false,
                        message: `Insufficient stock for: ${itemNames}`,
                        insufficientStockItems: responseData.insufficientItems
                    };
                }

                throw new Error(responseData.message || 'Failed to create order');
            }

            // Create a frontend order object with the backend order data
            const order = {
                id: responseData.order._id,
                items: orderItems,
                totalAmount: finalTotalAmount, // Including delivery fee
                deliveryData,
                date: responseData.order.date,
                status: responseData.order.status,
                userEmail: user?.email // Use the logged-in user's email
            };

            // Add the order to ordersData (for display in frontend)
            setOrdersData(prev => {
                const newOrders = [...prev, order];
                // Save to localStorage immediately
                localStorage.setItem('ordersData', JSON.stringify(newOrders));
                return newOrders;
            });

            // Refresh products data to reflect the new stock quantities
            const productsResponse = await fetch('http://localhost:3000/api/products');
            if (productsResponse.ok) {
                const updatedProducts = await productsResponse.json();
                setProducts(updatedProducts);
            }

            // Clear the cart
            setCartItems({});
            localStorage.removeItem('cartItems');

            return { success: true, order };
        } catch (error) {
            console.error('Order placement error:', error);
            return { success: false, message: error.message || 'Failed to place order' };
        }
    };

    const getOrders = async () => {
        try {
            // Fetch orders from backend
            const response = await fetch('http://localhost:3000/api/orders');
            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }

            const backendOrders = await response.json();

            // Map backend orders to frontend format
            const formattedOrders = backendOrders.map(order => ({
                id: order._id,
                items: order.items,
                totalAmount: order.totalAmount,
                deliveryData: order.deliveryData,
                date: order.date,
                status: order.status,
                userEmail: user?.email // Assuming this for now
            }));

            // Update local orders state
            setOrdersData(formattedOrders);

            // Return the orders (filtered by user if not admin)
            if (isAdmin) {
                return formattedOrders;
            }
            // Filter orders for current user
            return formattedOrders.filter(order => order.userEmail === user?.email);
        } catch (error) {
            console.error('Error fetching orders:', error);
            // Fallback to local storage orders
            if (isAdmin) {
                return ordersData;
            }
            return ordersData.filter(order => order.userEmail === user?.email);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        if (!isAdmin) return false;

        try {
            // Call backend API to update order status
            const response = await fetch(`http://localhost:3000/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error('Failed to update order status');
            }

            // If successful, update local state
            setOrdersData(prev => prev.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            ));

            return true;
        } catch (error) {
            console.error('Error updating order status:', error);
            return false;
        }
    };

    const clearCart = () => {
        setCartItems({});
        localStorage.removeItem('cartItems');
    };

    const contextValue = {
        products,
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
        clearCart,
        loading,
        error,
        getProductImage
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;