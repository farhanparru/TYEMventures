// src/services/apiService.js
const API_URL = 'http://tyem.word-network.site/api/tyem/WhatsApporder';

export const fetchOrders = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};
