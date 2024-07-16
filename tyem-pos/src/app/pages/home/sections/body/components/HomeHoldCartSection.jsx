import { Empty, Form, Input, notification } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addHoldCart,
  getHoldCartList,
  removeHoldCart,
} from "../../../store/holdCartSlice";
import { addFromHoldCart, clearCart } from "../../../store/cartSlice";
import { clearSelectedCustomer, setSelectedCustomer } from "../../../store/customerSlice";
import HomeTopBar from "../../HomeTopBar";
import { getSelectedBodySection, getSelectedTab, selectTab } from "../../../store/homeSlice";

const HomeHoldCartSection = () => {
  const [cartNote, setCartNote] = React.useState("");
  const cartState = useSelector((state) => state.cart);
  const selectedCustomer = useSelector(
    (state) => state.customer.selectedCustomer
  );
  const holdCartList = useSelector(getHoldCartList);
  const selectedTab = useSelector(getSelectedBodySection);

  const dispatch = useDispatch();

  const [notificationApi, contextHolder] = notification.useNotification();

  return (
    <>
      <HomeTopBar selectedTab={selectedTab} />

      <div className="flex flex-col gap-3 p-2 w-full h-full">
        {contextHolder}
        {/* <h2 className="text-lg font-bold">Hold Cart</h2> */}

        {/* <div className="flex flex-col gap-4 p-4 rounded-lg border shadow-2xl w-full">
          <h2 className="text-md font-bold">Do You Want to Hold this Cart?</h2>
          <div className="flex gap-2 w-full">
            <Form layout="vertical" style={{ width: "100%" }}>
              <Form.Item label="Cart Note">
                <Input
                  onChange={(e) => setCartNote(e.target.value)}
                  defaultValue={""}
                />
              </Form.Item>
            </Form>
          </div>
          <div className="flex justify-end gap-3">
            <button className="px-10 py-2 text-orange-500 border-2 border-orange-500 rounded-lg cursor-pointer transition-all hover:scale-90 ">
              Cancel
            </button>
            <button
              onClick={() => {
                if (!selectedCustomer || !cartState?.orderitems?.length) {
                  notificationApi.error({
                    message: "Please Select Customer and Add Items to Cart",
                  });
                  return;
                }
                dispatch(
                  addHoldCart({
                    ...cartState,
                    customer: selectedCustomer,
                    cartNote: cartNote,
                    time: new Date().toLocaleString(),
                  })
                );
                dispatch(clearSelectedCustomer());
                dispatch(clearCart());
              }}
              className="px-10 py-2  border-2 border-orange-500  bg-orange-500 text-white rounded-lg cursor-pointer transition-all hover:scale-90 "
            >
              Proceed
            </button>
          </div>
        </div> */}

        <h2 className="text-lg font-bold mt-10">Carts On Hold</h2>

        {holdCartList.length === 0 && (
          <Empty className="mx-auto" description=" No cart holded yet" />
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3  overflow-y-scroll gap-5 p-4">
          {holdCartList.map((cart, index) => {
            return <HoldingCartCard key={cart.id} cart={cart} />;
          })}
        </div>
      </div>
    </>
  );
};

export default HomeHoldCartSection;

const HoldingCartCard = ({ cart }) => {
  const selectedTab = useSelector(getSelectedTab);

  const dispatch = useDispatch();

  return (
    <>
      <div className="flex flex-col bg-white rounded-lg border border-chicket-border p-4 gap-2">
        <div className="flex justify-between items-center gap-10">
          <h2 className="text-sm font-bold">{cart?.customer?.name}</h2>
          <p className="text-xs">Holded At {cart.time}</p>
        </div>
        <div className="flex justify-between items-center gap-10">
          <h2 className="text-sm font-bold">Cart Note:</h2>
          <p className="text-xs"> {cart.cartNote}</p>
        </div>
        <div className="flex flex-col gap-2 mt-2 h-[60%] overflow-y-scroll">
          {cart?.orderitems?.map((item, index) => {
            if (index >= 5) {
              return null;
            }
            return (
              <div key={index} className="flex flex-col ">
                <p className="text-xs font-bold">
                  {">"} {item.name}
                </p>
                {/* <p className="text-xs "> {`( ${item.size} ML )`}</p> */}
              </div>
            );
          })}
        </div>

        <div className="flex justify-evenly gap-10 mt-5">
          <button
            onClick={() => dispatch(removeHoldCart({ holdCartItem: cart }))}
            className="px-4 py-2 text-white border-2 w-[50%] bg-chicket-500 rounded-lg cursor-pointer transition-all hover:scale-90 "
          >
            REMOVE
          </button>
          <button
            onClick={() => {
              dispatch(clearCart());
              dispatch(addFromHoldCart({ data: cart }));
              dispatch(setSelectedCustomer(cart.customer));
              dispatch(selectTab(cart.orderType));
              dispatch(removeHoldCart({ holdCartItem: cart }));
            }}
            className="px-4 py-2 text-white border-2  w-[50%] bg-green-500 rounded-lg cursor-pointer transition-all hover:scale-90 "
          >
            SELECT
          </button>
        </div>
      </div>
    </>
  );
};
