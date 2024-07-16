import React, { useState } from 'react'
import { Menu, Switch } from 'antd';
import PriceGroupList from './PriceGroupList/PriceGroupList';
import Printers from './Printers/Printers';

const { SubMenu } = Menu;
const Settings = () => {

  const [current, setcurrent] = useState("1")
  function handleClick(e) {
    console.log('click', e);
    setcurrent(e?.key)
  }
  return (
    <div className='bg-white px-5 py-5 h-full flex  gap-10'>
      <Menu
        style={{ width: 256 }}
        defaultSelectedKeys={[current]}
        defaultOpenKeys={['sub1']}
        mode={'inline'}
        theme={"light"}
        onClick={handleClick}
      >
        <Menu.Item key="1" className='font-bold'>

          Price Groups
        </Menu.Item>
        <Menu.Item key="2" className='font-bold'>

          Printers
        </Menu.Item>

      </Menu>


      {current == 1 &&

        <div className='w-full bg-white'>
          <PriceGroupList />
        </div>
      }

      {current == 2 &&
        <div className='w-full bg-white'>
          <Printers />
        </div>
      }
    </div>
  )
}

export default Settings
