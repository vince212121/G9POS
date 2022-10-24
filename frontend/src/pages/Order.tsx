import { stringify } from "querystring";
import React, { useState, useReducer } from "react";

type Props = {};

const categories = [ "Tops", "Bottoms", "Accessories" ]

const items = [
    { name: "White T-shirt", category: "Tops", price: 19.99, stock: 20 },
    { name: "Black T-shirt", category: "Tops", price: 19.99, stock: 20 },
    { name: "Red T-shirt", category: "Tops", price: 19.99, stock: 20 },
    { name: "Blue T-shirt", category: "Tops", price: 19.99, stock: 20 },
    { name: "Green T-shirt", category: "Tops", price: 19.99, stock: 20 },
    { name: "Sweater", category: "Tops", price: 29.99, stock: 15 },
    { name: "Coat", category: "Tops", price: 49.99, stock: 10 },
    { name: "Pants", category: "Bottoms", price: 19.99, stock: 20 },
    { name: "Jeans", category: "Bottoms", price: 29.99, stock: 15 },
    { name: "Shorts", category: "Bottoms", price: 14.99, stock: 20 },
    { name: "Swimming Trunks", category: "Bottoms", price: 14.99, stock: 10 },
    { name: "White Socks", category: "Accessories", price: 2.99, stock: 10 },
    { name: "Black Socks", category: "Accessories", price: 2.99, stock: 10 },
    { name: "Hat", category: "Accessories", price: 9.99, stock: 5 },
    { name: "Beanie", category: "Accessories", price: 9.99, stock: 5 },
    { name: "Necklace", category: "Accessories", price: 19.99, stock: 3 },
]

const Order = (props: Props) => {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [cart, setCart] = useState<{name: string, category: string, price: number, qty: number}[]>([],);

    // using this state to force the page to rerender elements
    // as updating the property value of a cart item wasnt rerendering
    const [reset, forceUpdate] = useReducer(x => x + 1, 0);

    const categoryClick = (category: string) => {
        setSelectedCategory(category);
    }

    const productClick = (itemToAdd: any) => {
        if(itemToAdd.stock > 0)
        {
            if(cart.length !== 0)
            {
                // loop through cart, if found increment qty and update price
                var cartItem;
                if(cartItem = cart.find((cart) => cart.name === itemToAdd.name))
                {
                    cartItem.qty++;
                    cartItem.price += itemToAdd.price;

                    forceUpdate();
                }
                // if item was not in cart, add to cart with inital qty of 1
                else
                    setCart([...cart, { name: itemToAdd.name, category: itemToAdd.category, price: itemToAdd.price, qty: 1}]);
            }
            else
            {
                setCart([{ name: itemToAdd.name, category: itemToAdd.category, price: itemToAdd.price, qty: 1}]);
            }
            // decrement stock
            itemToAdd.stock--;
        }
    }

    const removeCartItem = (itemToRemove: any) => {
        setCart(cart.filter(product => product.name !== itemToRemove.name))

        var correspondingItem;
        if(correspondingItem = items.find(product => product.name === itemToRemove.name))
            correspondingItem.stock += itemToRemove.qty;
    }

    const getTotal = () => {
        let total = 0;
        cart.map(product => total += product.price);
        return total.toFixed(2);
    }

    return (
        <div className="w-screen p-5">
            {/* Categories */}
            <div className="border-2 rounded-lg pt-5 pb-5">
                <div className="text-center font-bold pb-5">Categories</div>
                <div className="flex flex-wrap justify-center">
                    {categories.map((category) => (
                        <div>
                            <button className="m-1 rounded-lg pt-3 pb-3 bg-orange-300 hover:bg-orange-500" onClick={() => categoryClick(category)}>
                                <div className="w-40">{category}</div>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Items */}
            <div className="border-2 rounded-lg pt-5 pb-5 mt-5">
                <div className="text-center font-bold pb-5">Products</div>
                <div className="flex flex-wrap justify-center">
                    {items.map(item => {
                        return item.category === selectedCategory
                                ?   <div>
                                        <button className={"flex flex-row w-max m-1 rounded-lg pt-3 pb-3 " + (item.stock !== 0 ? "bg-blue-300 hover:bg-blue-500" : "bg-red-300")} onClick={() => productClick(item)}>
                                            <div className="basis-1/2 m-3 whitespace-nowrap">{item.name}</div>
                                            <div className="basis-1/4 m-3">${item.price}</div>
                                            <div className="basis-1/4 m-3">{item.stock}</div>
                                        </button>
                                    </div>
                                :   <div/>
                    })}
                </div>
            </div>

            {/* Cart */}
            {cart.length > 0 && <div className="flex flex-col mt-20 p-2 bg-slate-100 border-2 rounded-lg">
                Cart:
                {cart.map(product => {
                    let linePrice = product.price.toFixed(2);
                    return <div className="flex flex-row p-1" key={product.name}>
                        <div className="basis-1/2 m-3 whitespace-nowrap">{product.name}</div>
                        <div className="basis-1/4 m-3">${linePrice}</div>
                        <div className="basis-1/4 m-3 text-right">{product.qty}</div>
                        <button className="bg-slate-200 hover:bg-slate-300 p-2 rounded-md" onClick={() => removeCartItem(product)}>Remove</button>
                    </div>
                })}
                <div className="text-end pt-20 font-bold">Total: ${getTotal()}</div>
            </div>}
        </div>
    );
};

export default Order;