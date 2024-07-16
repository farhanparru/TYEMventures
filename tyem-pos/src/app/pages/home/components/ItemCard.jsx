import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { WEBSITE_API_URL, WEBSITE_IMAGE_URL } from "../../../config/index";
import { Switch } from "antd";
import axios from "axios";
import { getStoreUserData } from "../../../store/storeUser/storeUserSlice";
import { getItems } from "../store/homeSlice";

const ItemCard = ({ item, show_toggle }) => {
  const dispatch = useDispatch();
  const store_user = useSelector(getStoreUserData);

  const [active, setActive] = useState(item?.is_inactive)

  const onItemClick = () => {
    dispatch(addToCart(item));
  };

  
  function onChange(checked) {
    console.log(`switch to ${checked}`);
    setActive(checked)
    const headers = {
      "Authorization": `Bearer ${store_user?.accessToken}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    };

    // Cash Register Does Not Exist.
    axios
      .post(WEBSITE_API_URL + "/product-toggle", {
        id: item?.id,

      }, { headers }).then((result) => {
        dispatch(getItems(store_user?.accessToken));
        // window.location.reload();
      }).catch((err) => {

      });;
  }
  return (
    <div
      onClick={onItemClick}
      className="home__item  flex flex-col   gap-2 justify-around bg-ch-headers-500 text-white p-3 rounded-md shadow-xl cursor-pointer transition-all ease-in-out hover:bg-slate-300 hover:scale-95 hover:shadow-sm"
    >
      {/* <img
        src={WEBSITE_IMAGE_URL + "/" + item.image}
        alt=""
        className="w-full h-16 object-cover"
      /> */}
      <h3 className="text-sm font-bold text-transform: capitalize">
        {item.name} 
      </h3>
      <h3 className="text-xs font-medium">₹ {parseFloat(item.product_variations[0].variations[0].sell_price_inc_tax).toFixed(3)}</h3>
      {show_toggle == true &&
        <Switch checked={active} onChange={onChange} className={`w-10 ${!active ? 'bg-red-500' : 'bg-green-500'}`} />
      }
      {/* {item.addon_categories && item.addon_categories.length !== 0 && 
      
      <>

      </>
      } */}
    </div>
  );
};

export default ItemCard;
