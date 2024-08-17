import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cartSlice";
import axios from "axios";
import { getStoreUserData } from "../../../store/storeUser/storeUserSlice";

// Define the Loader component
// Define the Loader component
const Loader = () => (
  <div className="loader relative w-14 h-14 rounded-lg mx-auto my-6">
    {Array.from({ length: 12 }).map((_, index) => (
      <div
        key={index}
        className={`w-[8%] h-[24%] bg-gray-500 absolute left-1/2 top-[30%] opacity-0 rounded-full shadow-[0_0_3px_rgba(0,0,0,0.2)] animate-fade458`}
        style={{ 
          transform: `rotate(${index * 30}deg) translate(0, -130%)`,
          animationDelay: `${-index * 0.1}s`
        }}
      ></div>
    ))}
  </div>
);


const ItemCard = React.memo(({ selectedCategory }) => {
  console.log("RenderComponent");
  
  const dispatch = useDispatch();
  const store_user = useSelector(getStoreUserData);
  const [items, setItems] = useState({ firstColumn: [], secondColumn: [], thirdColumn: [] });
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axios.get('https://tyem.invenro.site/api/user/ExcelItems'); 
        const fetchedItems = response.data;

        // Filter items based on the selected category
        const filteredItems = selectedCategory === 'All' 
          ? fetchedItems 
          : fetchedItems.filter(item => item.category === selectedCategory);

        // Split items into three columns
        const firstColumn = filteredItems.slice(0, Math.ceil(filteredItems.length / 3));
        // const secondColumn = filteredItems.slice(Math.ceil(filteredItems.length / 3), Math.ceil(2 * filteredItems.length / 3));
        // const thirdColumn = filteredItems.slice(Math.ceil(2 * filteredItems.length / 3));

        setItems({ firstColumn });
        setLoading(false); // End loading
      } catch (error) {
        console.error('There was an error fetching the items!', error);
        setLoading(false); // End loading on error
      }
    };
    fetchItems();
  }, [selectedCategory]);

  const onItemClick = React.useCallback((item) => {
    const cartItem = {
      name: item.ItemName,
      price: item.Price,
      quantity: 1,
    };
    dispatch(addToCart(cartItem));
  }, [dispatch]); // Use useCallback to prevent onItemClick from being recreated on every render

  return (
    <div className="flex justify-between gap-x-10 p-6">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="flex flex-col space-y-9">
            {items.firstColumn.map((item, index) => (
              <div
                key={item.id || index}
                onClick={() => onItemClick(item)}
                className="bg-teal-600 text-white p-6 rounded-md flex flex-col justify-between hover:bg-teal-700 cursor-pointer"
                style={{ width: '180px', height: '120px' }} 
              >
                <h3 className="text-sm font-bold capitalize truncate">{item.ItemName}</h3>
                <h3 className="text-md font-medium mt-1">₹{parseFloat(item.Price).toFixed(2)}</h3>
              </div>
            ))}
          </div>
          <div className="flex flex-col space-y-9">
            {/* Repeat for second and third columns if needed */}
          </div>
          <div className="flex flex-col space-y-9">
            {/* Repeat for second and third columns if needed */}
          </div>
        </>
      )}
    </div>
  );
});

export default ItemCard;
