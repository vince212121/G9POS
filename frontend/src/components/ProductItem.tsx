import React, { useState } from "react";

type Props = {
  selected: boolean;
  item: any;
  clickItem: any;
};

const ProductItem = ({ selected, item, clickItem }: Props) => {
  const [selectedItem, setSelectedItem] = useState(selected);
  return (
    <button
      type="button"
      className={`${
        selectedItem
          ? "border-black bg-black text-white"
          : "border-gray-700 text-gray-700"
      } rounded-lg p-1 border`}
      onClick={() => {
        clickItem(item);
        setSelectedItem(!selectedItem);
      }}
    >
      {item.name} - {item.brand}
    </button>
  );
};

export default ProductItem;
