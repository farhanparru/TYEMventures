import React from "react";
import ReactDOM from "react-dom/client";
import "antd/dist/antd.min.js";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import { store ,persistor} from "./app/store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import {BrowserRouter} from 'react-router-dom'
import { OrderProvider } from "./app/pages/home/sections/body/components/OrderContext";
// Tailwind css


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
      <OrderProvider>
        <App />
        </OrderProvider>,
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
