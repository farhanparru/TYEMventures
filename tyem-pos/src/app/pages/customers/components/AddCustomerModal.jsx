import React, { useState } from "react";
import { Button, Form, Input, InputNumber, Modal, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  addAndSelectCustomer,
  addStoreCustomers,
  getStoreCustomers,
} from "../../home/store/customerSlice";
import { getStoreUserData } from "../../../store/storeUser/storeUserSlice";

const AddCustomerModal = ({ isOpen, setOpen, handleSetCustomerFocused }) => {
  const { Option } = Select;
  const store_user = useSelector(getStoreUserData);
  const [network, setNetwork] = useState(window.navigator.onLine);

  const [countryCode, setcountryCode] = useState(0);
  const [gender, setGender] = useState("Male");
  const handleCancel = () => {
    setOpen(false);
    handleSetCustomerFocused(false);
  };
  const dispatch = useDispatch();

  const onFinish = (values) => {
    const newCustomer = {
      token: store_user.accessToken,
      gender: gender,
      name: values.fullName,
      lastName: "",
      email: values.email || "",
      mobile: values.phone,
      address: values.address || "",
      country_code: countryCode,
      vat: values.VAT || "",
      language: values.language || "",
      supplier_business_name:store_user?.business?.name
    };
    if (network) {
      dispatch(addStoreCustomers({customer_data: newCustomer,token : store_user?.accessToken}));
      dispatch(getStoreCustomers(store_user?.accessToken));
    } else {
      dispatch(addAndSelectCustomer(newCustomer));
    }

    setOpen(false);
    handleSetCustomerFocused(false);
  };

  const [phoneFocused, setphoneFocused] = React.useState(false);

  const prefixSelector = (
    <Form.Item name={"prefix"} required noStyle>
      <Select onChange={(e) => setcountryCode(e)} style={{ width: 70 }}>
      <Option value="973">+973</Option>
        <Option value="91">+91</Option>
        <Option value="87">+87</Option>
      </Select>
    </Form.Item>
  );
  const [form] = Form.useForm();
  const NumpadKey = ({ keyValue, span }) => {
    return (
      <div
        onClick={() => {
          let state = form.getFieldValue("phone");
          console.log(state);

          if (state === undefined) {
            state = "";
          }
          if (keyValue === "Clear") {
            state = "";
            form.setFieldsValue({ phone: state });
          } else {
            form.setFieldsValue({ phone: state + keyValue });
          }
        }}
        className={`numpad__key py-2 px-3 md:px-5 lg:px-7 xl:px-8 ${
          span ? span : ""
        }
         bg-slate-100 rounded-md  text-center items-center
            cursor-pointer transition-all hover:bg-gray-200 hover:text-gray-900
            hover:scale-90
         `}
      >
        <p className="text-xl font-bold ">{keyValue}</p>
      </div>
    );
  };

  return (
    <Modal
      open={isOpen}
      title="Add New Customer"
      onCancel={handleCancel}
      width={"50%"}
      footer={[]}
    >
      <Form
        {...layout}
        form={form}
        name="nest-messages"
        onFinish={onFinish}
        initialValues={{ gender: gender, language: "en" }}
        validateMessages={validateMessages}
      >
        <div
          tabIndex={0}
          onFocus={() => setphoneFocused(true)}
          onBlur={() => {
            setphoneFocused(false);
          }}
          className="relative"
        >
          <Form.Item
            name={"phone"}
            label="Phone Number"
            rules={[
              { required: true, message: "Please input your phone number!" },
            ]}
          >
            <Input addonBefore={prefixSelector} style={{ width: "100%" }} />
          </Form.Item>
          {phoneFocused && (
            <div className=" absolute right-1/2 w-[80%] translate-x-1/2 top-[100%] numpad__keys grid bg-white px-2 pb-2 z-50 grid-cols-3 gap-2 mt-2">
              <NumpadKey keyValue={"1"} />
              <NumpadKey keyValue={"2"} />
              <NumpadKey keyValue={"3"} />
              <NumpadKey keyValue={"4"} />
              <NumpadKey keyValue={"5"} />
              <NumpadKey keyValue={"6"} />
              <NumpadKey keyValue={"7"} />
              <NumpadKey keyValue={"8"} />
              <NumpadKey keyValue={"9"} />
              <NumpadKey keyValue={"0"} />
              <NumpadKey keyValue={"Clear"} span="col-span-2" />
            </div>
          )}
        </div>

        <Form.Item
          name={"fullName"}
          label="Full Name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={"email"}
          label="Email"
          rules={[
            {
              type: "email",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item name={"address"} label="Address">
          <Input.TextArea />
        </Form.Item>

        <Form.Item name={"VAT"} label="VAT No.">
          <Input />
        </Form.Item>
        <div className="flex flex-wrap -mx-4">
          <div className="w-full md:w-1/2 px-4">
            <Form.Item name={"gender"} label="Gender" required>
              <Select onChange={(e) => setGender(e)} style={{ width: "100%" }}>
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>
          </div>
          <div className="w-full md:w-1/2 px-4">
            <Form.Item name={"language"} label="Language">
              <Input />
            </Form.Item>
          </div>
        </div>
        <Form.Item>
          <button
            htmltype="submit"
            key={"save&add"}
            className="px-3 rounded-lg   w-full py-2 bg-green-600 text-white font-bold transition-all hover:scale-90"
          >
            Save & Add
          </button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCustomerModal;

const layout = {
  layout: "vertical",
};

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};
