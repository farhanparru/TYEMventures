import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cartSlice";
import axios from "axios";
import { getStoreUserData } from "../../../store/storeUser/storeUserSlice";

// Define the Loader component
const Spinner = () => {
  const spinnerDivs = Array.from({ length: 10 }).map((_, index) => {
    const rotation = 36 * (index + 1);
    const translation = 150;
    const delay = 0.1 * (index + 1);

    return (
      <div
        key={index}
        className="absolute w-[50%] h-[150%] bg-black"
        style={{
          transform: `rotate(${rotation}deg) translate(0, ${translation}%)`,
          animation: `spinner-fzua35 1s ${delay}s infinite ease`,
        }}
      ></div>
    );
  });

  return <div className="relative w-[9px] h-[9px]">{spinnerDivs}</div>;
};

const ItemCard = React.memo(({ selectedCategory }) => {
  console.log('Recat Rendring');
  
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
        const columnLength = Math.ceil(filteredItems.length / 3);
        // const firstColumn = filteredItems.slice(0, columnLength);
        const secondColumn = filteredItems.slice(columnLength, 2 * columnLength);
        // const thirdColumn = filteredItems.slice(2 * columnLength);

        setItems({ secondColumn });
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
      Id: item.Id,  // Ensure this matches with cartSlice reducer
      name: item.ItemName,
      price: item.Price,
    };
  
    dispatch(addToCart(cartItem)); 
  }, [dispatch]);

  return (
    <div className="flex justify-between gap-x-10 p-6">
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="flex flex-col space-y-9">
            {/* {items.firstColumn.map((item) => (
              <div
                key={item.Id}
                onClick={() => onItemClick(item)}
                className="bg-teal-600 text-white p-6 rounded-md flex flex-col justify-between hover:bg-teal-700 cursor-pointer"
                style={{ width: '180px', height: '120px' }} 
              >
                <h3 className="text-sm font-bold capitalize truncate">{item.ItemName}</h3>
                <h3 className="text-md font-medium mt-1">₹{parseFloat(item.Price).toFixed(2)}</h3>
              </div>
            ))} */}
          </div>
          <div className="flex flex-col space-y-9">
            {items.secondColumn.map((item) => (
              <div
                key={item.Id}
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
            {/* {items.thirdColumn.map((item) => (
              <div
                key={item.Id}
                onClick={() => onItemClick(item)}
                className="bg-teal-600 text-white p-6 rounded-md flex flex-col justify-between hover:bg-teal-700 cursor-pointer"
                style={{ width: '180px', height: '120px' }} 
              >
                <h3 className="text-sm font-bold capitalize truncate">{item.ItemName}</h3>
                <h3 className="text-md font-medium mt-1">₹{parseFloat(item.Price).toFixed(2)}</h3>
              </div>
            ))} */}
          </div>
        </>
      )}
    </div>
  );
});

export default ItemCard;
