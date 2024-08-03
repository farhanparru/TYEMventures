import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import notificationSound from '../../../../../../../src/assets/Moto Notification Ringtone Download - MobCup.Com.Co.mp3'; // Ensure the correct path


const OrderNotification = ({ setOrders }) => {
    const [audio] = useState(new Audio(notificationSound));

    const playNotificationSound = () => {
        audio.play();
    };

    useEffect(() => {
        const socket = new WebSocket('wss://tyem.invenro.site'); // Use your backend's deployed domain

        socket.onmessage = (event) => {
            const newOrder = JSON.parse(event.data);
            playNotificationSound();

            // Notify the user
            toast.info(`New order received: ${newOrder.orderMeta?.posOrderId}`, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 5000
            });

            // Update the orders state with the new order first
            setOrders(prevOrders => [newOrder, ...prevOrders]);
        };

        return () => {
            socket.close();
        };
    }, [audio, setOrders]);

    return null;
};

export default OrderNotification;
