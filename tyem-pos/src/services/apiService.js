// Backend API URL
const API_URL = 'http://tyem.invenro.site/api/tyem/Whatsappget';
// WebSocket URL
const WEBSOCKET_URL = 'ws://tyem.invenro.site';

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

export const connectWebSocket = (onMessage) => {
  const socket = new WebSocket(WEBSOCKET_URL);

  socket.onmessage = (event) => {
    const newOrder = JSON.parse(event.data);
    onMessage(newOrder);
  };

  socket.onclose = () => {
    console.log('WebSocket connection closed');
  };

  return socket;
};
