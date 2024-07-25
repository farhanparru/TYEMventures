
import React, { useEffect, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  RedoOutlined,
  WifiOutlined,
  PrinterOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { UilStore, UilMapMarker, UilPower } from "@iconscout/react-unicons";

import { Dropdown, Button, Modal, Form, Input, Select } from "antd";
import NavAvatar from "./components/NavAvatar";
import { useDispatch, useSelector } from "react-redux";
import { getStoreUserData, logoutVendor } from "../../store/storeUser/storeUserSlice";
import logo from "../../../assets/chicket-logo.png";
import { Detector, Offline, Online } from "react-detect-offline";
import { addOrder, getOrders } from "../../pages/home/store/orderSlice";
import OnlineComponent from "./components/OnlineComponent/OnlineComponent";
import OfflineComponent from "./components/OfflineComponent/OfflineComponent";
import { Link } from "react-router-dom";
import { getPrintersList } from "../../pages/home/store/homeSlice";

const Navbar = ({ collapsed, setCollapsed }) => {
  const store_user = useSelector(getStoreUserData);
  const printers = useSelector(getPrintersList);

  const { ordersList } = useSelector((state) => state.order);
  const [network, setNetwork] = useState(window.navigator.onLine);
  // const [printers, setPrinters] = useState([]);
  const [selectedPrinter, setSelectedPrinter] = useState('');

  const dispatch = useDispatch();
  const [status, setStatus] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };



  // Retrieve printers list from the main process
  useEffect(() => {
    const ipcRenderer = window.ipcRenderer;
    if (ipcRenderer) {

      ipcRenderer.send('getPrinters');
      ipcRenderer.on('printersList', (event, printers) => {
        console.log(JSON.parse(printers));

        // setPrinters(JSON.parse(printers));
      });
      return () => {
        ipcRenderer.removeAllListeners('printersList');
      };
    }
  }, []);


  const [form] = Form.useForm();
  form.setFieldValue("main", localStorage.getItem("main_printer"));
  form.setFieldValue("kot", localStorage.getItem("kot_printer"));
  form.setFieldValue("width", localStorage.getItem("width"));

  const handleOk = () => {
    // console.log(form.getFieldValue("main"));

    localStorage.setItem("main_printer", form.getFieldValue("main"));
    localStorage.setItem("kot_printer", form.getFieldValue("kot"));
    localStorage.setItem("width", form.getFieldValue("width"));

    setIsModalOpen(false);
  };
  const CtaBlueBtn = ({ children }) => {
    return (
      <div className="w-auto h-12 grid content-center bg-white rounded-xl cursor-pointer transition-all hover:scale-90 hover:bg-gray-100 hover:border hover:border-blue-400">
        {children}
      </div>
    );
  };
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const items = [
    {
      key: "English",
      label: (
        <a
          onClick={() => {
            setSelectedLanguage("English");
          }}
        >
          English
        </a>
      ),
    },
    // {
    //   key: "Arabic",
    //   label: (
    //     <a
    //       onClick={() => {
    //         setSelectedLanguage("Arabic");
    //       }}
    //     >
    //       Arabic
    //     </a>
    //   ),
    // },
  ];

  const businessName = "Business Name";
  const location = "Location";

  const __getActive = (status) => {
    if (status == true) {
      setStatus(true);
      // syncAllOrders();
    } else {
      setStatus(false);
    }
    // alert(status);
  };

  const buttonItemLayout = {
    wrapperCol: {
      span: 14,
      offset: 4,
    },
  };


  return (
    <Detector
      render={({ online }) => (
        <nav className="flex  justify-between items-center  bg-white  p-2  shadow-md border-b">
          <div className="nav__left flex items-center">
            {/* {React.createElement(
              collapsed ? MenuFoldOutlined : MenuUnfoldOutlined,
              {
                className: "trigger mx-4 text-black font-bold text-xl mb-1 ",
                onClick: () => setCollapsed(!collapsed),
              }
            )} */}


            <div className=" gap-1 items-center hidden md:flex">
              <UilStore size="25" className="ml-4 text-black font-bold" />
              <p className="text-xs text-black font-bold">
                {store_user?.business?.name}
              </p>
            </div>
            {/* <div className=" gap-1 items-center hidden md:flex">
              <UilMapMarker size="25" className="ml-4 text-black font-bold" />
              <p className="text-xs text-black font-bold">
                {store_user?.data?.store?.city?.name}
              </p>
            </div> */}
          </div>
          <div className="nav__right border-l-[1px] flex items-center gap-4 ">
            <div className="ml-10" onClick={() => dispatch(logoutVendor())}>
              <CtaBlueBtn>
                <UilPower className="mx-4 text-xl text-chicket-500" />
              </CtaBlueBtn>
            </div>
            <div onClick={showModal}>
              <CtaBlueBtn>
                <SettingOutlined className="mx-4 text-xl text-black" />
              </CtaBlueBtn>
            </div>

            <CtaBlueBtn>
              <div>
                <div>
                  <Online>
                    <OnlineComponent network={online} />
                  </Online>
                </div>
                <Offline>
                  <OfflineComponent network={online} />
                </Offline>
              </div>
            </CtaBlueBtn>

            {/* <Dropdown
              menu={{
                items,
                selectable: true,
                selectedKeys: [selectedLanguage],
              }}
              trigger={["click"]}
            >
              <div> */}

            {/* <Link to={'/kds'}>
                <CtaBlueBtn>
                  <p className="mx-3 uppercase text-sm font-bold text-black">
                    KDS
                  </p>
                </CtaBlueBtn>
                </Link> */}
            {/* </div>
            </Dropdown> */}

            <NavAvatar
              name={store_user?.username}
              role="Vendor"
              email={store_user?.email}
            />
          </div>
          <Modal
            title="Printer Connection Settings"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
              <Button key="back" onClick={handleCancel}>
                Cancel
              </Button>,
              <Button key="submit" type="primary" style={{ backgroundColor: 'green' }} onClick={handleOk}>
                Save
              </Button>,
            ]}
          >
            <Form
              formItemLayout={{
                labelCol: {
                  span: 4,
                },
                wrapperCol: {
                  span: 14,
                },
              }}
              layout={{
                wrapperCol: {
                  span: 14,
                  offset: 4,
                },
              }}
              form={form}
              initialValues={{
                layout: {
                  wrapperCol: {
                    span: 14,
                    offset: 4,
                  },
                },
              }}
              style={{
                maxWidth: 600,
              }}
            >
              <Form.Item label="Main Printer" name="main">
                {/* <Input
                  placeholder="Enter device name"
                  value={localStorage.getItem("main_printer")}
                /> */}



              <Select >
                  {printers?.length !== 0 && printers?.map(printer => (
                    <Option key={printer.name} value={printer.name}>{printer.name}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="KOT Printer Name" name="kot">
                  <Select >
                  {printers?.length !== 0 && printers?.map(printer2 => (
                    <Option key={printer2.name} value={printer2.name}>{printer2.name}</Option>
                  ))}

                </Select>
              </Form.Item>
              <Form.Item label="Print Width" name="width">
                <Select >

                  <Option value={'80mm'}>80mm</Option>
                  <Option value={'78mm'}>78mm</Option>
                  <Option value={'76mm'}>76mm</Option>
                  <Option value={'58mm'}>58mm</Option>
                  <Option value={'57mm'}>57mm</Option>
                  <Option value={'44mm'}>44mm</Option>
                </Select>
              </Form.Item>


            </Form>
          </Modal>
        </nav>
      )}
    />
  );
};
export default Navbar;

{
  /* 
<Navbar
  fluid={false}
  rounded={true}
  border={true}
>
  <Navbar.Brand href="https://flowbite.com/">
    <img
      src="https://flowbite.com/docs/images/logo.svg"
      className="mr-3 h-6 sm:h-9"
      alt="Flowbite Logo"
    />
    <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-black">
      Flowbite
    </span>
    <div className='flex gap-1 items-center'>
    <UilStore className="ml-4 text-gray-500"/>
    <p className='text-xs text-gray-500'>{businessName}</p>
    </div>
    <div className='flex gap-1 items-center'>
    <UilMapMarker className="ml-4 text-gray-500"/>
    <p className='text-xs text-gray-500'>{location}</p>
    </div>

  </Navbar.Brand>
    
</Navbar>
 */
}
