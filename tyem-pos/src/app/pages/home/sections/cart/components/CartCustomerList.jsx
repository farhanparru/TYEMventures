import React, { useState } from "react";
import { UilPlus } from "@iconscout/react-unicons";
// import SearchInput from "../../../components/SearchInput";
// import AddCustomerModal from "../components/AddCustomerModal";
import { useDispatch, useSelector } from "react-redux";

import { Drawer } from "antd";
import {
  getIsCartOpen,
  getSeachedCustomerList,
  searchCustomer,
  setSelectedCustomer,
} from "../../../store/customerSlice";

// import CustomerDetails from "./CustomerDetails";x
import CustomerDetails from '../../../../customers/sections/CustomerDetails';
import AddCustomerModal from "../../../../customers/components/AddCustomerModal";

const CartCustomerList = ({ selectedCustomer, isCart,handleSetCustomerFocused }) => {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  //Modal
  const [open, setOpen] = useState(false);

  const isCartOpen = useSelector(getIsCartOpen);

  const showModal = () => {
    setOpen(true);
  };

  const [drawerVisible, setDrawerVisible] = useState(false);

  const customerList = useSelector(getSeachedCustomerList);

  const breakpoint = 900;
  const [isSmallDevice, setIsSmallDevice] = React.useState(
    window.innerWidth < breakpoint
  );

  const onSearch = (value) => {
    setSearchValue(value);
    dispatch(searchCustomer(value));
  };

  React.useEffect(() => {
    window.addEventListener("resize", () =>
      setIsSmallDevice(window.innerWidth < breakpoint)
    );
  }, []);

  React.useEffect(() => {
    dispatch(searchCustomer(""));
  }, []);

  return (
    <div className="flex-1 flex flex-col  h-full overflow-auto ">
      <div className="flex-1 flex flex-col bg-white  h-[90%] overflow-auto gap-4 rounded-lg">
        <div className="flex-1 flex flex-col h-full overflow-y-scroll">
       
          {customerList?.length> 0 &&  customerList?.slice(0, 3).map((customer, index) => {
            const isSelected = selectedCustomer?.id === customer.id;
            let bgClass = index % 2 == 0 ? "bg-gray-100" : "bg-transparent";
            return (
              <CustomerListTile
                isSelected={isSelected}
                bgClass={bgClass}
                customer={customer}
                key={index}
                setDrawerVisible={setDrawerVisible}
                handleSetCustomerFocused={handleSetCustomerFocused}
              />
            );
          })}
        </div>
      </div>

      <AddCustomerModal isOpen={open} setOpen={setOpen} handleSetCustomerFocused={handleSetCustomerFocused}/>
      {selectedCustomer && !isCartOpen && drawerVisible ? (
        <Drawer
          width={isSmallDevice ? "70%" : "30%"}
          placement={"right"}
          closable={true}
          onClose={() => setDrawerVisible(false)}
          open={selectedCustomer}
          key={selectedCustomer}
        >
          {/* <CustomerDetails selectedCustomer={selectedCustomer} /> */}
        </Drawer>
      ) : null}
      <div className="flex-1 m-2 flex justify-center">
        <button
          onClick={showModal}
          className="flex gap-2 items-center  bg-gray-300 text-black px-5 py-2 rounded-md transition-all hover:scale-90"
        >
          <UilPlus />
          <h2 className="text-xs font-bold">Add New</h2>
        </button>
      </div>
    </div>
  );
};

export default CartCustomerList;

const CustomerListTile = ({
  customer,
  isSelected,
  bgClass,
  setDrawerVisible,
  handleSetCustomerFocused
}) => {
  const dispatch = useDispatch();

  const onClick = () => {
    setDrawerVisible(true);
    dispatch(setSelectedCustomer(customer));
    handleSetCustomerFocused()
  };
  return (
    <div
      onClick={onClick}
      className={`flex gap-1 items-center p-3 border-b-2 border-solid border-slate-200 transition-all cursor-pointer ${
        isSelected ? "bg-blue-700" : `hover:bg-blue-100 hover:scale-95`
      } `}
    >
      <div className="flex items-center justify-between flex-1">
        <h2
          className={`text-sm font-semibold  ${
            isSelected ? "text-white" : "text-black"
          }`}
        >
          {customer.name}
        </h2>
        <p
          className={`text-sm font-semibold  ${
            isSelected ? "text-white" : "text-black"
          }`}
        >
          {customer.phone}
        </p>
      </div>
      {/* <p className={`text-sm font-bold  ${isSelected ? "text-white" : ""}`}>
        {customer.lastActive}
      </p> */}
    </div>
  );
};
