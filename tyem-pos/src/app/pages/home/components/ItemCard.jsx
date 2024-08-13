import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { addToCart } from "../store/cartSlice";
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";

const ItemCard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get("https://tyem.invenro.site/api/user/ExcelItems") // Adjust your API endpoint
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setItems(response.data);
          console.log(response.data);
        } else {
          setItems([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the items!", error);
        setError("Error fetching items");
        setLoading(false);
      });
  }, []);

  const onItemClick = (item) => {
    dispatch(addToCart(item));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {items.map((item) => (
        <Card
          key={item._id}
          onClick={() => onItemClick(item)}
          className="mt-6 w-full cursor-pointer transition-all ease-in-out hover:bg-slate-300 hover:scale-95 hover:shadow-sm"
        >
          <CardBody>
            <Typography variant="h5" color="blue-gray" className="mb-2">
              {item.ItemName}
            </Typography>
            <Typography>
              ₹ {item.Price.toFixed(2)}
            </Typography>
          </CardBody>
          <CardFooter className="pt-0">
            <Button color="blue-gray" onClick={() => onItemClick(item)}>
              Add to Cart
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ItemCard;
