import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cartSlice";
import axios from "axios";
import { getStoreUserData } from "../../../store/storeUser/storeUserSlice";

const ItemCard = React.memo(({ selectedCategory }) => {
  const dispatch = useDispatch();
  const store_user = useSelector(getStoreUserData);
  const [items, setItems] = useState({ firstColumn: [], secondColumn: [], thirdColumn: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://tyem.invenro.site/api/user/ExcelItems');
        const fetchedItems = response.data;

        const filteredItems = selectedCategory === 'All' ? fetchedItems : fetchedItems.filter(item => item.category === selectedCategory);

        const totalItems = filteredItems.length;
        const itemsPerColumn = Math.ceil(totalItems / 3);

        console.log('Filtered Items:', filteredItems);
        console.log('Items Per Column:', itemsPerColumn);

        setItems({
          firstColumn: filteredItems.slice(0, itemsPerColumn),
          secondColumn: filteredItems.slice(itemsPerColumn, 2 * itemsPerColumn),
          thirdColumn: filteredItems.slice(2 * itemsPerColumn),
        });
      } catch (error) {
        console.error('There was an error fetching the items!', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [selectedCategory]);

  const onItemClick = useCallback((item) => {
    const cartItem = {
      id: item.Id,
      name: item.ItemName,
      price: item.Price,
    };
    dispatch(addToCart(cartItem));
  }, [dispatch]);

  const { firstColumn, secondColumn, thirdColumn } = useMemo(() => items, [items]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-between gap-x-10 p-6">
      <div className="flex flex-col space-y-9">
        {renderItems(firstColumn)}
      </div>
      <div className="flex flex-col space-y-9">
        {renderItems(secondColumn)}
      </div>
      <div className="flex flex-col space-y-9">
        {renderItems(thirdColumn)}
      </div>
    </div>
  );
});

export default ItemCard;