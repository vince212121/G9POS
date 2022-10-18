import { stringify } from "querystring";
import React, { useState, useReducer } from "react";

type Props = {};

const categories = [ "A", "B", "C" ]

const items = [
    { id: 0, name: "Item A1", category: "A", price: 99.99, stock: 10 },
    { id: 1, name: "Item A2", category: "A", price: 99.99, stock: 10 },
    { id: 2, name: "Item A3", category: "A", price: 99.99, stock: 10 },
    { id: 3, name: "Item B1", category: "B", price: 99.99, stock: 10 },
    { id: 4, name: "Item B2", category: "B", price: 99.99, stock: 10 },
    { id: 5, name: "Item B3", category: "B", price: 99.99, stock: 10 },
    { id: 6, name: "Item C1", category: "C", price: 99.99, stock: 10 },
    { id: 7, name: "Item C2", category: "C", price: 99.99, stock: 10 },
    { id: 8, name: "Item C3", category: "C", price: 99.99, stock: 10 },
]

const Order = (props: Props) => {
    const [selectedCategory, setSelectedCategory] = useState(categories[0]);
    const [cart, setCart] = useState<{name: string, category: string, price: number, qty: number}[]>([],);

    const categoryClick = (category: string) => {
        setSelectedCategory(category);
    }

    const productClick = (itemToAdd: any) => {
        if(cart.length !== 0)
        {
            // loop through cart, if found increment qty and update price
            var cartItem;
            if(cartItem = cart.find((cart) => cart.name === itemToAdd.name))
            {
                cartItem.qty++;
                cartItem.price += itemToAdd.price;
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
        items[itemToAdd.id].stock--;
    }

    return (
        <div>
            <div className="text-center p-5">Order</div>
            {/* Categories */}
            <div className="flex flex-wrap justify-center">
                { categories.map((category) => (
                    <div>
                        <button className="bg-orange-300 m-1 rounded-lg hover:bg-orange-500" onClick={() => categoryClick(category)}>
                            <div className="w-40">{category}</div>
                        </button>
                    </div>
                ))}
            </div>

            {/* Items */}
            <div className="flex flex-wrap justify-center">
                {items.map(item => {
                    return item.category === selectedCategory
                            ?   <div>
                                    <button className="flex flex-row w-max bg-blue-300 m-1 rounded-lg hover:bg-blue-500" onClick={() => productClick(item)}>
                                        <div className="basis-1/2 m-3 whitespace-nowrap">{item.name}</div>
                                        <div className="basis-1/4 m-3">${item.price}</div>
                                        <div className="basis-1/4 m-3">{item.stock}</div>
                                    </button>
                                </div>
                            :   <div/>
                })}
            </div>

            {/* Cart
                WIP: Will only show updated cart if a new item is added to cart, added same product will not refresh display
            */}
            <div className="flex flex-col mt-52 p-2 bg-slate-100">
                Cart:
                {cart.map(product => (
                    <div className="flex flex-row">
                        <div className="basis-1/2 m-3 whitespace-nowrap">{product.name}</div>
                        <div className="basis-1/4 m-3">${product.price}</div>
                        <div className="basis-1/4 m-3 text-right">{product.qty}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Order;