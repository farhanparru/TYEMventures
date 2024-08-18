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

  const handleIncrement = (e) => {
    e.stopPropagation();
    dispatch(incrementQuantity(item.id));
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    dispatch(decrementQuantity(item.id));
  };

  const onRemoveItem = (e, isRemoveAll) => {
    e.stopPropagation();
    dispatch(
      removeFromCart({
        id: item.id,
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
    dispatch(
      updateItemNote({
        item_id: item.id,
        variation_id: item.variation_id,
        note: itemNote,
      })
    );
  };

  const addAddon = (e, addon) => {
    e.stopPropagation();
    if (item?.variation_id?.id !== addon.id) {
      dispatch(
        setSelectedAddon({ item_id: item.id, selectedVariation: addon })
      );
    }
  };

  const getAddons = (product_variations) => {
    const keys = Object.keys(product_variations.variations);

    return keys.map((key) => (
      <div
        onClick={(e) => addAddon(e, product_variations.variations[key])}
        className={`text-black border-1 border-gray-200 bg-gray-100 p-3 rounded-md mt-4 ${
          item?.selectedAddon?.id === product_variations.variations[key].id
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
    ));
  };

  const __updateSingleItemPrice = (item, price) => {
    dispatch(setSingleItemDiscount({ item_id: item.id, price: price }));
  };

  const __discountCart = (item) => {
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
      >
        <Select.Option value="fixed">Fixed</Select.Option>
        <Select.Option value="percentage">Percentage</Select.Option>
      </Select>
    </Form.Item>
  );

  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <div
        className={`w-full border border-zinc-300 rounded-lg flex justify-between p-2 items-center cursor-pointer transition-all ${"bg-gray-100 text-gray-800 hover:scale-95"}`}
      >
        <div onClick={() => setShowModal(true)} className="flex-1 flex gap-4">
          <div className="cart__item-details flex-1">
            <p className="text-sm font-black">
              {item.name}
              {item.selectedAddon && (
                <span className="text-xs font-semibold">
                  ({item?.selectedAddon?.name})
                </span>
              )}
            </p>
          </div>
          <div className="cart__item-actions flex gap-5 items-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              onClick={handleDecrement}
            >
              -
            </button>

            <p className="text-xs text-center">{item.quantity}</p>

            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              onClick={handleIncrement}
            >
              +
            </button>
          </div>
        </div>
        <div
          onClick={(e) => onRemoveItem(e, true)}
          className="mx-2 p-1 rounded-md bg-red-500 cursor-pointer transition-all hover:scale-90"
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
            <div className="w-full gap-4 flex justify-between px-5 py-7 items-center">
              <div className="cart__item-details flex-1 mx-2">
                <p className="text-xs text-gray-800">SKU : {item.sku}</p>
                <p className="text-xs text-gray-800">TAX : VAT 10%</p>
                <p className="text-xs text-gray-800">
                  Price : ₹ {parseFloat(item.Price).toFixed(3)}
                </p>
              </div>
              <div className="cart__item-actions flex gap-5 items-center flex-end mx-3 relative">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2 cursor-pointer transition-all hover:scale-90">
                    <p className="text-xs font-bold text-gray-800 text-center flex-2 mx-3">
                      ₹ {item?.totalPrice}
                    </p>
                  </div>
                  {openChangePriceBox && (
                    <div className="flex gap-1 items-center">
                      <Form.Item className="my-auto w-[50%]">
                        <Input
                          initialValues={singleItemChangePrice}
                          type="number"
                          onChange={(e) =>
                            setSingleItemChangePrice(e.target.value)
                          }
                          placeholder="Enter new price"
                        />
                      </Form.Item>
                      {singleItemChangePrice && (
                        <button
                          onClick={() =>
                            __updateSingleItemPrice(item, singleItemChangePrice)
                          }
                          className="px-4 py-2 text-white border-2 bg-orange-500 rounded-lg cursor-pointer transition-all hover:scale-90"
                        >
                          Apply
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <div
                  onClick={(e) => onRemoveItem(e, false)}
                  className="w-[30%] p-2 rounded-lg flex items-center justify-center bg-red-500 cursor-pointer transition-all hover:scale-90"
                >
                  <UilMinus className="w-5 text-white" />
                </div>
                <div className="bg-gray-100 w-[50%] p-2 rounded-lg flex items-center justify-center">
                  <p className="text-gray-800">{item.quantity}</p>
                </div>
                <div
                  onClick={onAddItem}
                  className="w-[30%] p-2 rounded-lg flex items-center justify-center bg-red-500 cursor-pointer transition-all hover:scale-90"
                >
                  <UilPlus className="w-5 text-white" />
                </div>
              </div>
            </div>
            <hr />
            <Form>
              <div className="flex items-center gap-10">
                <CiDiscount1 className="w-8 h-9 text-black" />
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
                    <button
                      onClick={() => __discountCart(item)}
                      className="px-4 py-2 text-white border-2 bg-orange-500 rounded-lg cursor-pointer transition-all hover:scale-90"
                    >
                      Apply Discount
                    </button>
                  </div>
                )}
              </div>
            </Form>
            <hr />
            <div className="flex items-center gap-5">
              <UilListUl className="w-8 h-9 text-black" />
              <p className="text-md text-black font-bold">Add Notes</p>
            </div>
            <Form>
              <Form.Item name={"note"}>
                <TextArea
                  onChange={(e) => setitemNote(e.target.value)}
                  rows={4}
                  placeholder="Enter your notes here"
                />
              </Form.Item>
              {itemNote && (
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => onUpdateItemNote(item)}
                    className="px-4 py-2 text-white border-2 bg-orange-500 rounded-lg cursor-pointer transition-all hover:scale-90"
                  >
                    Save Note
                  </button>
                </div>
              )}
            </Form>
          </div>
        </CustomModal>
      )}
    </div>
  );
};

export default CartItem;


