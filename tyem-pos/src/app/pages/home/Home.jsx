import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import HomeCartSection from "./sections/cart/HomeCartSection";
import HomeCategorySection from "./sections/HomeCategorySection";
import HomeItemsSection from "./sections/body/components/HomeItemsSection";
import HomeTopBar from "./sections/HomeTopBar";
import {
  getItemCategories,
  getItems,
  getPaymentMethods,
  getPriceGroups,
  getPrinters,
  getSelectedBodySection,
  getSelectedCategory,
  getSelectedTab,
  getTaxTypes,
  getUnits,
} from "./store/homeSlice";
import HomeBodySection from "./sections/body/HomeBodySection";
import { homeBodySection } from "./constants";
import { getStoreUserData } from "../../store/storeUser/storeUserSlice";
import { getBookedTablesForToday, getFloorsTables } from "./store/tableSlice";
import { getOrders } from "./store/orderSlice";
import { getStoreCustomers } from "./store/customerSlice";
import { useNavigate } from "react-router-dom";
import EditCart from "./sections/editCart";

const Home = () => {
  const selectedCategory = useSelector(getSelectedCategory);
  const selectedBodySection = useSelector(getSelectedBodySection);
  const selectedTab = useSelector(getSelectedTab);
  const dispatch = useDispatch();
  const store_user = useSelector(getStoreUserData);
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const editOrder = useSelector((state) => state.order.editOrder);

  const navigate = useNavigate()
  useEffect(() => {
    if (store_user && store_user?.accessToken) {
      const kdsRoles = store_user.roles.filter(role => role.name.toUpperCase().startsWith("KDS"));
      const hasExactKDSRole = kdsRoles.some(role => role.name.includes("KDS"));

      if (hasExactKDSRole) {
        //to fix routing issue
        navigate('/kds', { replace: true });
        console.log(hasExactKDSRole, 'kds');
        // setisLoggedIn(true)

      }
    } else {
      setisLoggedIn(false);

    }

  }, [store_user, navigate])
  useEffect(() => {

    // dispatch(getItemCategories());
    dispatch(getItemCategories(store_user?.accessToken));
    dispatch(getUnits(store_user?.accessToken));
    dispatch(getTaxTypes(store_user?.accessToken));
    dispatch(getPriceGroups(store_user?.accessToken));
    dispatch(getPrinters(store_user?.accessToken));
    // dispatch(getPaymentMethods(store_user?.accessToken));


    dispatch(getItems(store_user?.accessToken));
    dispatch(getFloorsTables(store_user?.accessToken));
    dispatch(getBookedTablesForToday(store_user?.accessToken));

    dispatch(getOrders(store_user?.accessToken));
    dispatch(getStoreCustomers(store_user?.accessToken));
    const fetchLatestOrders = () => {
      dispatch(getOrders(store_user?.accessToken));

    };
    fetchLatestOrders();
    const intervalId = setInterval(fetchLatestOrders, 30000);

    // Clear the interval when the component unmounts to prevent memory leaks
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex items-stretch h-full  bg-white">
      <div className="w-full h-full">
        <div className="flex flex-col  h-full w-full">
          {/* <HomeTopBar selectedTab={selectedTab} /> */}
          <div className="w-full h-full flex  overflow-hidden ">
            <HomeBodySection />
            {selectedBodySection !== "orders" && selectedBodySection !== "online-orders" && selectedBodySection !== "scheduled-orders" &&  selectedBodySection !== "tables" ?
              <>

                <HomeCartSection />
              </>
              : null}

            {editOrder && selectedBodySection === "orders" || selectedBodySection === "online-orders" || selectedBodySection === "scheduled-orders"  || selectedBodySection === "tables" ?
              <>
                <EditCart />
              </>
              : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
