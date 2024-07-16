import React, { useState } from "react";
import { UilPlus } from "@iconscout/react-unicons";
import SearchInput from "../../../components/SearchInput";
import { dummyCustomers } from "../constants";
import AddCustomerModal from "../components/AddCustomerModal";
import { useDispatch, useSelector } from "react-redux";
import {
  getIsCartOpen,
  getSeachedCustomerList,
  searchCustomer,
  setSelectedCustomer,
} from "../../home/store/customerSlice";
import { Drawer } from "antd";
import CustomerDetails from "./CustomerDetails";

const CustomerList = ({ selectedCustomer, isCart }) => {
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
    <div className="flex-1 flex flex-col gap-5 h-full">
      {/* Header Seaction */}
      <div className="customer__header flex">
        <h2 className="text-2xl font-bold">Customers</h2>
        <div className="flex-1 flex justify-end">
          <button
            onClick={showModal}
            className="flex gap-2 items-center  bg-blue-600 text-white px-5 py-2 rounded-md transition-all hover:scale-90"
          >
            <UilPlus />
            <h2 className="text-xs font-bold">Add Customer</h2>
          </button>
        </div>
      </div>

      {/* Left Body Section */}
      <div className="flex-1 flex flex-col bg-white p-3 h-[90%]  gap-4 rounded-lg">
        <SearchInput
          placeholder={"Search by phone no.."}
          onInputChange={(e) => {
            onSearch(e.target.value);
          }}
        />
        <h2 className="text-xl font-bold">Recent Customers</h2>
        <div className="flex-1 flex flex-col gap-5 overflow-y-scroll">
        {
        console.log(customerList?.length,'length')}
          {customerList?.map((customer, index) => {
            const isSelected = selectedCustomer?.id === customer.id;
            let bgClass = index % 2 == 0 ? "bg-gray-100" : "bg-transparent";
            return (
              <CustomerListTile
                isSelected={isSelected}
                bgClass={bgClass}
                customer={customer}
                key={index}
                setDrawerVisible={setDrawerVisible}
              />
            );
          })}
        </div>
      </div>

      <AddCustomerModal isOpen={open} setOpen={setOpen} />
      {selectedCustomer && !isCartOpen && drawerVisible ? (
        <Drawer
          width={isSmallDevice ? "70%" : "30%"}
          placement={"right"}
          closable={true}
          onClose={() => setDrawerVisible(false)}
          open={selectedCustomer}
          key={selectedCustomer}
        >
          <CustomerDetails selectedCustomer={selectedCustomer} />
        </Drawer>
      ) : null}
    </div>
  );
};

export default CustomerList;

const CustomerListTile = ({
  customer,
  isSelected,
  bgClass,
  setDrawerVisible,
}) => {
  const dispatch = useDispatch();

  const onClick = () => {
    setDrawerVisible(true);
    dispatch(setSelectedCustomer(customer));
  };
  return (
    <div
      onClick={onClick}
      className={`flex gap-5 items-center p-5 rounded-xl transition-all cursor-pointer ${
        isSelected
          ? "bg-blue-700"
          : `${bgClass ?? "bg-gray-100"} hover:bg-blue-100 hover:scale-95`
      } `}
    >
      <div className="flex-1">
        <h2 className={`text-lg font-bold  ${isSelected ? "text-white" : ""}`}>
          {customer.name }
        </h2>
        <p
          className={`text-sm font-medium  ${
            isSelected ? "text-white" : "text-gray-500"
          }`}
        >
          {customer.phone}
        </p>
      </div>
      <p className={`text-sm font-bold  ${isSelected ? "text-white" : ""}`}>
        {customer.lastActive}
      </p>
    </div>
  );
};
