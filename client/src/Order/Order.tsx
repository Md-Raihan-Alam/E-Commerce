import { useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useGlobalContext, GlobalContextTypes } from "../context";
import DefaultProductPicture from "../assets/default-book-cover.png";
import url from "../utils/url";
import axios from "axios";
const Order = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const { cart } = useSelector((state) => state);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cardNumber, setCardNumber] = useState("");
  const [deliveryCost, setDeliveryCost] = useState(false);
  const context = useGlobalContext() as GlobalContextTypes;
  const [success, setSuccess] = useState(false);
  const [orderedItems, setOrderedItems] = useState();
  const { getCookie } = context;
  const token = getCookie("token");
  useEffect(() => {
    setTotalPrice(
      cart.reduce(
        (acc: any, curr: any) => acc + curr.price * curr.orderedQuantity,
        0
      )
    );
  }, [cart]);
  const handleCardNumberChange = (event: any) => {
    const value = event.target.value;
    setCardNumber(value.replace(/\D/g, ""));
  };
  const updateDelivery = () => {
    setDeliveryCost(true);
    setTotalPrice((prevState) => prevState + 69);
  };
  useEffect(() => {
    for (const item of cart) {
      if (!item.freeDelivery) {
        updateDelivery();
        break;
      }
    }
  }, []);

  const submitOrder = async () => {
    try {
      const data = {
        cart: cart,
        token: token,
        cardNumber: cardNumber,
        totalPrice: totalPrice,
        deliveryCost: deliveryCost ? 69 : 0,
      };
      const result = await axios.post(`${url}/api/v1/orders`, data);
      console.log(result);
      setSuccess(true);
      setOrderedItems(result.data.order.orderItems);
      console.log(result.data.order.orderItems);
    } catch (error: any) {
      setSuccess(false);
      console.log(error);
    }
  };

  if (cart.length <= 0) {
    return (
      <div className="w-full h-[92vh] flex justify-center  items-center">
        <div className="alert alert-info text-center px-5 py-2">
          You do not have any item in your cart
        </div>
      </div>
    );
  }
  if (success) {
    return (
      <div>
        <div
          ref={componentRef}
          className="w-full h-fit overflow-x-auto flex flex-col justify-center  items-center"
        >
          <div className="my-2 font-semibold text-5xl py-2">Ordered Items</div>
          <div className="w-11/12">
            <table
              id="ordered-items-table"
              className="table  table-primary table-striped"
            >
              <thead>
                <tr>
                  <th scope="col" className="whitespace-nowrap">
                    Book Image
                  </th>
                  <th scope="col" className="whitespace-nowrap">
                    Book Name
                  </th>
                  <th scope="col" className="whitespace-nowrap">
                    Price
                  </th>
                  <th scope="col" className="whitespace-nowrap">
                    Ordered Quantity
                  </th>
                  <th scope="col" className="whitespace-nowrap">
                    Total Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderedItems!.map((item: any) => {
                  return (
                    <tr key={item._id}>
                      <td className="whitespace-nowrap">
                        <Link to={`/product/${item._id}`}>
                          <img
                            src={
                              item.image === ""
                                ? DefaultProductPicture
                                : `${url}${item.image}`
                            }
                            alt="Book Cover"
                            className="w-[50px] h-[50px] object-cover rounded-full"
                          />
                        </Link>
                      </td>
                      <td className="whitespace-nowrap">{item.name}</td>
                      <td className="whitespace-nowrap">${item.price}</td>
                      <td className="whitespace-nowrap">{item.amount}</td>
                      <td className="whitespace-nowrap">
                        ${item.amount * item.price}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="w-full flex justify-center items-center">
          <button
            onClick={handlePrint}
            className="bg-green-500 text-white font-semibold py-2 px-4 rounded mb-4"
          >
            Print Data
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full h-fit overflow-x-auto flex flex-col justify-center  items-center">
      <div className="my-2 font-semibold text-5xl py-2">Your Items</div>
      <div className="w-11/12">
        <table className="table  table-primary table-striped">
          <thead>
            <tr>
              <th scope="col" className="whitespace-nowrap">
                Book Image
              </th>
              <th scope="col" className="whitespace-nowrap">
                Book Name
              </th>
              <th scope="col" className="whitespace-nowrap">
                Price
              </th>
              <th scope="col" className="whitespace-nowrap">
                Ordered Quantity
              </th>
              <th scope="col" className="whitespace-nowrap">
                Total Price
              </th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item: any) => {
              return (
                <tr key={item._id}>
                  <td className="whitespace-nowrap">
                    <Link to={`/product/${item._id}`}>
                      <img
                        src={
                          item.image === ""
                            ? DefaultProductPicture
                            : `${url}${item.image}`
                        }
                        alt="Book Cover"
                        className="w-[50px] h-[50px] object-cover rounded-full"
                      />
                    </Link>
                  </td>
                  <td className="whitespace-nowrap">{item.name}</td>
                  <td className="whitespace-nowrap">${item.price}</td>
                  <td className="whitespace-nowrap">{item.orderedQuantity}</td>
                  <td className="whitespace-nowrap">
                    ${item.orderedQuantity * item.price}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {deliveryCost && (
          <div className="w-full flex mb-4 justify-between items-center">
            <div className="font-normal text-base">Delivery Cost</div>
            <div className="font-normal text-base">$69</div>
          </div>
        )}
        <div className="w-full flex mb-4 justify-between items-center">
          <div className="font-medium text-2xl">Total Cost</div>
          <div className="font-medium text-2xl">${totalPrice}</div>
        </div>
        <section className=" mb-8 flex justify-center items-center">
          <div className="w-80 md:w-1/3 rounded-lg shadow-lg p-8">
            <h1 className="text-center mb-8 text-xl">Payment</h1>
            <p className="mb-4">Test Card Number: 4242 4242 4242 4242</p>
            <input
              type="tel"
              maxLength={16}
              className="border rounded p-1 w-full mb-4"
              value={cardNumber}
              onChange={handleCardNumberChange}
            />
            <button
              onClick={submitOrder}
              className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded w-full relative"
            >
              Pay
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
export default Order;
