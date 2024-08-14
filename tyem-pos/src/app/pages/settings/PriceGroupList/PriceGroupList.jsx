import React, { useState } from 'react'
import { List, Avatar, Button, Skeleton, Switch } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getPriceGroups, getPriceGroupsList } from '../../home/store/homeSlice';
import axios from 'axios';
import { WEBSITE_API_URL } from '../../../config';
import { getStoreUserData } from '../../../store/storeUser/storeUserSlice';

const PriceGroupList = () => {
    const homePriceCategories = useSelector(getPriceGroupsList);
    const dispatch = useDispatch();
    const store_user = useSelector(getStoreUserData);

    const [loading, setloading] = useState(false)

    function onChange(e, item) {
        setloading(true)
        console.log(`switch to ${item}`);
        // setActive(checked)
        const headers = {
            "Authorization": `Bearer ${store_user?.accessToken}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
        };

        // // Cash Register Does Not Exist.
      
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('https://tyem.invenro.site/api/user/ExcelItems'); // Adjust your API endpoint
        setItems(response.data);
      } catch (error) {
        console.error('There was an error fetching the items!', error);
      }
    };
    fetchItems();
  }, []);

    }
    return (
        <div>
            <List
                className="demo-loadmore-list"
                // loading={initLoading}
                itemLayout="horizontal"
                // loadMore={loadMore}
                dataSource={homePriceCategories}
                renderItem={item => (
                    <List.Item
                    >
                        <Skeleton avatar title={false} loading={item.loading} active>
                            <List.Item.Meta

                                title={<a>{item.name}</a>}
                            />
                            <div>
                                <Switch loading={loading} checked={item?.is_active} onChange={(e) => onChange(e, item)} className={`w-10 ${!item?.active ? 'bg-red-500' : 'bg-green-500'}`} />

                            </div>
                        </Skeleton>
                    </List.Item>
                )}
            />
        </div>
    )
}

export default PriceGroupList