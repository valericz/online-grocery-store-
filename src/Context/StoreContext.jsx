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
        // 检查是否超过最大允许数量
        if (!validateQuantity(itemId)) {
            return false;
        }

        // 查找商品
        const item = products.find(item => item._id === itemId);

        // 检查商品是否存在且有库存
        if (!item || !item.isInStock) {
            return false;
        }

        // 计算新的购物车数量
        const currentQuantity = cartItems[itemId] || 0;
        const newQuantity = currentQuantity + 1;

        // 检查库存是否足够
        if (newQuantity > item.countInStock) {
            console.log(`库存不足: 当前库存 ${item.countInStock}, 尝试添加到 ${newQuantity}`);
            return false;
        }

        // 更新购物车
        setCartItems((prev) => ({ ...prev, [itemId]: newQuantity }));
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

    const placeOrder = (deliveryData) => {
        const orderItems = [];
        let totalAmount = 0;

        // 检查所有商品库存是否足够
        for (const itemId in cartItems) {
            const item = products.find(item => item._id === itemId);

            // 检查商品是否存在且有库存
            if (!item || !item.isInStock) {
                return {
                    success: false,
                    message: `商品不存在或已下架`
                };
            }

            // 检查库存数量是否足够
            if (cartItems[itemId] > item.countInStock) {
                return {
                    success: false,
                    message: `商品"${item.name}"库存不足，当前库存: ${item.countInStock}, 购物车数量: ${cartItems[itemId]}`
                };
            }

            // 转换API属性名为前端期望的格式
            orderItems.push({
                food_id: item._id,
                food_name: item.name,
                food_price: item.price,
                food_image: item.imageUrl,
                food_desc: item.description,
                in_stock: item.isInStock,
                quantity: cartItems[itemId]
            });

            totalAmount += item.price * cartItems[itemId];
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
        error
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;