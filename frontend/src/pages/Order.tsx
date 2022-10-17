import React, { useState } from "react";

type Props = {};

const Order = (props: Props) => {
    const [category, setCategory] = useState("A");

    const categories = [ "A", "B", "C" ]

    const items = [
        { name: "Item A1", category: "A", price: 99.99, qty: 10 },
        { name: "Item A2", category: "A", price: 99.99, qty: 10 },
        { name: "Item A3", category: "A", price: 99.99, qty: 10 },
        { name: "Item B1", category: "B", price: 99.99, qty: 10 },
        { name: "Item B2", category: "B", price: 99.99, qty: 10 },
        { name: "Item B3", category: "B", price: 99.99, qty: 10 },
        { name: "Item C1", category: "C", price: 99.99, qty: 10 },
        { name: "Item C2", category: "C", price: 99.99, qty: 10 },
        { name: "Item C3", category: "C", price: 99.99, qty: 10 },
        
    ]

    const catClick = (cat: string) => {
        setCategory(cat);
    }

    return (
        <div>
            <div className="text-center p-5">Order</div>
            {/* Categories */}
            <div className="flex flex-wrap justify-center">
                { categories.map((cat) => (
                    <div>
                        <button className="bg-orange-300 m-1 rounded-lg hover:bg-orange-500" onClick={() => catClick(cat)}>
                            <div className="w-40">{cat}</div>
                        </button>
                    </div>
                ))}
            </div>

            {/* Items */}
            <div className="flex flex-wrap justify-center">
                {items.map(item => {
                    return item.category === category
                            ?   <div>
                                    <button className="flex flex-row w-max bg-blue-300 m-1 rounded-lg hover:bg-blue-500">
                                        <div className="basis-1/2 m-3 whitespace-nowrap">{item.name}</div>
                                        <div className="basis-1/4 m-3">{item.price}</div>
                                        <div className="basis-1/4 m-3">{item.qty}</div>
                                    </button>
                                </div>
                            :   <div/>
                })}
            </div>
        </div>
    );
};

export default Order;