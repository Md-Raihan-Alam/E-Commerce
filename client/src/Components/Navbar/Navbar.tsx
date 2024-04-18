import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGlobalContext, GlobalContextTypes } from "../../context";
import cartSVG from "../../assets/cart.svg";
import defaultBookCover from "../../assets/default-book-cover.png";
import defaultCustomerPicture from "../../assets/Default-Customer-Picture.jpg";
import url from "../../utils/url";
import { useSelector } from "react-redux";

const Navbar = () => {
  const context = useGlobalContext() as GlobalContextTypes;
  const { user } = context;
  const [showOrder, setShowOrder] = useState(false);
  const { cart } = useSelector((state) => state);
  const [totalCart, setTotalCart] = useState(0);
  useEffect(() => {
    setTotalCart(
      cart.reduce(
        (acc: any, curr: any) => acc + curr.price * curr.orderedQuantity,
        0
      )
    );
  }, [cart]);
  const showOrderOption = () => {
    setShowOrder(!showOrder);
  };
  return (
    <div className="relative">
      <nav className="navbar sticky-top bg-body-tertiary border-black border-b">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand">
            Book Shop
          </Link>
          <div className="d-flex">
            {user && (
              <>
                <img
                  src={cartSVG}
                  width="30"
                  height="30"
                  alt="Cart"
                  onClick={showOrderOption}
                  className="mr-3 cursor-pointer"
                />
                <div className="flex">
                  {user.image === "" ? (
                    <img
                      src={defaultCustomerPicture}
                      width="30"
                      height="30"
                      className="rounded-lg w-[30px] h-[30px] object-cover"
                    />
                  ) : (
                    <img
                      src={`${url}${user.image}`}
                      width="30"
                      height="30"
                      className="rounded-lg w-[30px] h-[30px] object-cover"
                    />
                  )}
                  <Link
                    to="/user/showme"
                    className="no-underline text-lg ml-2 font-semibold"
                  >
                    {user.name}
                  </Link>
                </div>
              </>
            )}
            {!user && (
              <Link
                to="/Login"
                className="no-underline text-lg mr-2 btn btn-primary"
              >
                Sign Up/In
              </Link>
            )}
          </div>
        </div>
      </nav>
      {showOrder && (
        <div
          className={`w-[300px] fixed overflow-auto h-[92vh] right-0 bg-white z-10`}
        >
          {cart && cart.length ? (
            cart.map((item: any) => {
              return (
                <Link
                  to={`/product/${item._id}`}
                  className="w-[70%] no-underline alert alert-info mt-4 h-fit my-4 mx-auto flex flex-col"
                >
                  <img
                    src={
                      item.image === ""
                        ? defaultBookCover
                        : `${url}${item.image}`
                    }
                    className="w-full h-[200px]"
                    alt={`${item.image === "" ? "Book Cover" : item.name}`}
                  />
                  <div className="flex flex-col w-full h-fit">
                    <div className="w-full flex justify-between items-center">
                      <div className="text-sm">Price</div>
                      <div className="text-sm">{item.price}</div>
                    </div>
                    <div className="w-full flex justify-between items-center">
                      <div className="text-sm">Quantity</div>
                      <div className="text-sm">{item.orderedQuantity}</div>
                    </div>
                    <div className="w-full flex justify-between items-center">
                      <div className="text-sm">Total</div>
                      <div className="text-sm">
                        {item.price * item.orderedQuantity}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="alert alert-primary w-10/12 m-4 text-center">
              Your cart is empty
            </div>
          )}
          {cart && cart.length ? (
            <div className="grid  place-items-center m-2">
              <div className="flex w-[80%] justify-between">
                <div>Total Price:</div>
                <div>{totalCart}</div>
              </div>
              <Link to="Order" className="btn btn-success btn-block w-[80%]">
                Make Payment
              </Link>
            </div>
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  );
};
export default Navbar;
