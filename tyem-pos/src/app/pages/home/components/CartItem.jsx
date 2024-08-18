import React, { useEffect, useState } from "react";
import {
  UilMinus,
  UilPlus,
  UilTimes,
  UilAngleDown,
  UilPercentage,
  UilEdit,
  UilPen,
  UilMoneyWithdraw,
  UilTrashAlt,
} from "@iconscout/react-unicons";

import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  getorderitems,
  removeFromCart,
  setSelectedAddon,
  setSingleItemDiscount,
  updateItemNote,
} from "../store/cartSlice";

import  decrementQuantity  from '../store/cartSlice';
import  incrementQuantity from '../store/cartSlice';

import { Avatar, Dropdown, Form, Input, Select } from "antd";
import CustomModal from "../../../components/CustomModal";
import { CiDiscount1 } from "react-icons/ci";
import TextArea from "antd/es/input/TextArea";

const CartItem = ({ item, index }) => {
  const dispatch = useDispatch();
  const cartitems = useSelector(getorderitems);

  const [openChangePriceBox, setOpenChangePriceBox] = useState(false);
  const [singleItemChangePrice, setSingleItemChangePrice] = useState(0);
  const [discountType, setDiscountType] = useState("fixed");
  const [itemNote, setitemNote] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  
  const handleIncrement = () => dispatch(incrementQuantity(item.id));
  const handleDecrement = () => dispatch(decrementQuantity(item.id));


  const onRemoveItem = (e, isRemoveAll) => {
    e.stopPropagation();
    dispatch(
      removeFromCart({
        id: item.Id,
        variation_id: item.variation_id,
        isRemoveAll,
      })
    );
  };
  const onAddItem = (e) => {
    e.stopPropagation();
    dispatch(addToCart({ item: item, isUpdateProduct: true }));
  };

  const onUpdateItemNote = (item) => {
    // e.stopPropagation();
    dispatch(
      updateItemNote({
        item_id: item.id,
        variation_id: item.variation_id,
        note: itemNote,
      })
    );
  };

  const addAddon = (e, addon) => {
    // console.log(addon);
    e.stopPropagation();
    if (item?.variation_id?.id !== addon.id) {
      dispatch(
        setSelectedAddon({ item_id: item.id, selectedVariation: addon })
      );
    }

    // console.log(cartitems);
  };
  const getAddons = (product_variations) => {
    const keys = Object.keys(product_variations.variations);

    return keys.map((key, index) => {
      return (
        <div
          onClick={(e) => addAddon(e, product_variations.variations[key])}
          className={`text-black border-1 border-gray-200 bg-gray-100 p-3 rounded-md mt-4 ${
            item?.selectedAddon?.id == product_variations.variations[key].id
              ? "border-2 border-chicket-500 bg-chicket-200 text-black"
              : ""
          }`}
          key={key}
        >
          <h4 className="font-semibold capitalize text-base">
            {product_variations.variations[key].name}
          </h4>
          <h3 className="text-xs font-medium mt-2">
            ₹ {product_variations.variations[key].sell_price_inc_tax}
          </h3>
        </div>
      );
    });
  };

  // const getAddonCat = () => {
  //   const keys = Object.keys(item.product_variations);

  //   return (
  //     item.type == "variable" && (
  //       <>
  //         {keys && keys.length > 0 && (
  //           <>
  //             <h6 className="text-black font-bold text-base">Addons</h6>
  //             {keys.map((key, index) => {
  //               return (
  //                 <div className="text-black" key={key}>
  //                   <h4 className="font-semibold mt-2 text-capitalize text-sm">
  //                     - {item.product_variations[key].name}
  //                   </h4>
  //                   <div className="flex gap-4 flex-wrap">
  //                     {getAddons(item.product_variations[key])}
  //                   </div>
  //                 </div>
  //               );
  //             })}
  //           </>
  //         )}
  //       </>
  //     )
  //   );
  // };

  const [showModal, setShowModal] = React.useState(false);

  const __updateSingleItemPrice = (item, price) => {
    // console.log(item, price);
    dispatch(setSingleItemDiscount({ item_id: item.id, price: price }));
  };

  const __discountCart = (item) => {
    // console.log(item, price);
    dispatch(
      setSingleItemDiscount({
        item_id: item.id,
        variation_id: item.variation_id,
        discountAmount: discountAmount,
        discountType: discountType,
      })
    );
  };

  const prefixSelector = (
    <Form.Item name={"prefix"} required noStyle>
      <Select
        onChange={(e) => setDiscountType(e)}
        defaultValue="fixed"
        // style={{ width: 100 }}
      >
        <Select.Option value="fixed">Fixed</Select.Option>
        <Select.Option value="percentage">Percentage</Select.Option>
      </Select>
    </Form.Item>
  );
  return (
    <div>
      <div
        className={`w-full  border border-zinc-300   rounded-lg flex justify-between p-2 items-center cursor-pointer transition-all  ${"bg-gray-100 text-gray-800 hover:scale-95"}`}
      >
        {/* <UilAngleDown
          onClick={() => setShowModal(true)}
          className="w-8 mr-2 cursor-pointer transition-all hover:scale-125"
        /> */}

        <div onClick={() => setShowModal(true)} className="  flex-1 flex gap-4">
          <div className="cart__item-details flex-1">
            <p className="text-sm font-black ">
              {item.name}
              {item && item.selectedAddon && (
                <span className="text-xs font-semibold">
                  ({item?.selectedAddon?.name})
                </span>
              )}
            </p>
            {/* <p className="text-xs ">{`(${item.size} ML)`}</p> */}
          </div>
          <div className="cart__item-actions flex gap-5 items-center">
            <button
             class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            
            >
              -
            </button>
            
            <p className="text-xs text-center">{item.quantity}</p>

            <button
             class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
           
            >
              +
            </button>

            {/* <p className="text-xs font-bold text-center flex-1">
              ₹ {parseFloat(item.totalPrice).toFixed(3)}
            </p> */}
          </div>
        </div>
        <div
          onClick={(e) => onRemoveItem(e, true)}
          className=" mx-2 p-1 rounded-md bg-red-500 cursor-pointer transition-all hover:scale-90"
        >
          <UilTrashAlt className="w-5 text-white" />
        </div>
      </div>
      {showModal && (
        <CustomModal
          onClose={() => {
            setShowModal(false);
          }}
        >
          <div className="p-6 flex flex-col gap-3">
            <p className="text-sm font-black text-gray-800">{item.name}</p>
            <div className="w-full  gap-4   flex justify-between px-5 py-7 items-center ">
              {/* <Avatar shape="square" size={"large"} src={item.image}></Avatar> */}
              <div className="cart__item-details flex-1 mx-2">
                {/* <p className="text-sm font-black text-gray-800">{item.name}</p> */}
                <p className="text-xs text-gray-800">SKU : {item.sku}</p>
                <p className="text-xs text-gray-800">TAX : VAT 10%</p>
                <p className="text-xs text-gray-800">
                  Price : ₹ {parseFloat(item.Price).toFixed(3)}
                </p>
              </div>
              <div className="cart__item-actions flex gap-5 items-center flex-end mx-3 relative">
                <div className="flex flex-col  items-center">
                  <div className="flex   items-center gap-2 cursor-pointer transition-all hover:scale-90">
                    <p className="text-xs font-bold text-gray-800 text-center flex-2 mx-3">
                      ₹ {item?.totalPrice}
                    </p>
                    {/* <UilEdit
                      onClick={() => setOpenChangePriceBox(!openChangePriceBox)}
                      className="w-4 text-chicket-600 "
                    />
                    <p
                      onClick={() => setOpenChangePriceBox(!openChangePriceBox)}
                      className="text-xs  text-medium text-chicket-600 text-center flex-1 "
                    >
                      {openChangePriceBox == true ? "Close" : "Change"}
                    </p> */}
                  </div>
                  {openChangePriceBox == true && (
                    <div className="flex gap-1 items-center">
                      <Form.Item className="my-auto  w-[50%]">
                        <Input
                          initialValues={singleItemChangePrice}
                          type="number"
                          onChange={(e) =>
                            setSingleItemChangePrice(e.target.value)
                          }
                          placeholder="Enter new price"
                        />
                      </Form.Item>
                      {singleItemChangePrice &&
                        singleItemChangePrice.length !== 0 && (
                          <button
                            onClick={() =>
                              __updateSingleItemPrice(
                                item,
                                singleItemChangePrice
                              )
                            }
                            className="px-4 py-2 text-white border-2 bg-orange-500 rounded-lg cursor-pointer transition-all hover:scale-90 "
                          >
                            Apply
                          </button>
                        )}
                    </div>
                  )}
                </div>
                <div
                  onClick={(e) => onRemoveItem(e, false)}
                  className=" w-[30%] p-2 rounded-lg flex items-center justify-center bg-red-500 cursor-pointer transition-all hover:scale-90"
                >
                  <UilMinus className="w-5 text-white" />
                </div>
                <div className="bg-gray-100 w-[50%] p-2 rounded-lg flex items-center justify-center">
                  <p className="text-gray-800">{item.quantity}</p>
                </div>
                <div
                  onClick={onAddItem}
                  className=" w-[30%] p-2 rounded-lg flex items-center justify-center bg-red-500 cursor-pointer transition-all hover:scale-90"
                >
                  <UilPlus className="w-5 text-white" />
                </div>
                {/* <div className="flex  items-center gap-2 absolute top-[-100%] right-[-10%] cursor-pointer transition-all hover:scale-90">
                  <UilEdit className="w-5 text-chicket-600 " />
                  <p className="text-xs  text-medium text-chicket-600 text-center flex-1 ">
                    Edit
                  </p>
                </div> */}
              </div>
            </div>
            <hr />
            <Form>
              <div className="flex items-center gap-10">
                <CiDiscount1 className=" w-8 h-9 text-black " />
                <h4 className="text-md text-black font-bold">Apply Discount</h4>
                <div className="mt-[25px]">
                  <Form.Item
                    name={"phone"}
                    rules={[
                      {
                        required: true,
                        message: "Please enter the discount amount!",
                      },
                    ]}
                  >
                    <Input
                      onChange={(e) => setDiscountAmount(e.target.value)}
                      type="number"
                      addonBefore={prefixSelector}
                    />
                  </Form.Item>
                </div>
                {discountType && discountAmount.length !== 0 && (
                  <div className="flex justify-end gap-3">
                    {/* <button className="px-10 py-2 text-red-500 border-2 border-red-500 rounded-lg cursor-pointer transition-all hover:bg-red-500 hover:text-white">
                  Cancel
                </button> */}
                    <button
                      onClick={() => __discountCart(item)}
                      className="px-10 py-2  border-2 border-green-500  bg-green-500 text-white rounded-lg cursor-pointer transition-all hover:bg-green-600 "
                    >
                      Apply
                    </button>
                  </div>
                )}
                <div className="flex gap-1 justify-center flex-col ">
                  <div className="flex items-center">
                    <UilPen className="w-4" />
                    <p className="text-xs">Add Note</p>
                  </div>
                  <div>
                    <Form.Item className="my-auto">
                      <TextArea
                        placeholder=""
                        onChange={(e) => setitemNote(e.target.value)}
                        defaultValue={item.sell_line_note}
                        className="bg-gray-100"
                        rows="5"
                      />
                    </Form.Item>
                  </div>
                  <div>
                    <button
                      onClick={(e) => onUpdateItemNote(item)}
                      className="px-10 py-2  border-2 border-green-500  bg-green-500 text-white rounded-lg cursor-pointer transition-all hover:bg-green-600 "
                    >
                      Save Note
                    </button>
                  </div>
                </div>
                {/* <Form.Item label="Discount Type">
                    <Select
                      onChange={(e) => setDiscountType(e)}
                      defaultValue="fixed"
                      style={{ width: 100 }}
                    >
                      <Select.Option value="fixed">Fixed</Select.Option>
                      <Select.Option value="percentage">
                        Percentage
                      </Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="Amount">
                    <Input
                      onChange={(e) => setDiscountAmount(e.target.value)}
                      type="number"
                      style={{ width: 100 }}
                    />
                  </Form.Item> */}
              </div>
            </Form>
            {/* {getAddonCat()} */}
            {/* <div className="flex gap-3 text-gray-800 mt-3">
              <div className="flex gap-1 items-center">
                <UilPercentage className="w-4" />
                <p className="text-xs">Apply Discount</p>
                <Form.Item className="my-auto">
                  <Input.Group compact>
                    <Form.Item name={["discount", "coupon"]} noStyle>
                      <Select placeholder="Fixed"></Select>
                    </Form.Item>
                    <Form.Item name={["coupon", "code"]} noStyle>
                      <Input
                        style={{
                          width: "30%",
                        }}
                        placeholder=""
                      />
                    </Form.Item>
                  </Input.Group>
                </Form.Item>
              </div>
              <div className="flex gap-1 items-center">
                <UilPen className="w-4" />
                <p className="text-xs">Add Note</p>
                <Form.Item className="my-auto">
                  <Input placeholder="" />
                </Form.Item>
              </div>
            </div> */}
          </div>
        </CustomModal>
      )}
    </div>
  );
};

export default CartItem;
