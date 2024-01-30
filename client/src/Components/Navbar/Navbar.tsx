import { Link } from "react-router-dom";
import { useState } from "react";
import { useGlobalContext, GlobalContextTypes } from "../../context";
import cartSVG from "../../assets/cart.svg";
import defaultBookCover from "../../assets/default-book-cover.png";
import defaultCustomerPicture from "../../assets/Default-Customer-Picture.jpg";
const Navbar = () => {
  const context = useGlobalContext() as GlobalContextTypes;
  const { user } = context;
  const [showOrder, setShowOrder] = useState(false);
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
                  <img
                    src={defaultCustomerPicture}
                    width="30"
                    height="30"
                    className="rounded-lg w-[30px] h-[30px] object-cover"
                  />
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
          <div className="w-[70%] mt-4 h-fit my-4 mx-auto flex flex-col">
            <img
              src={defaultBookCover}
              className="w-full h-[200px]"
              alt="Book Cover"
            />
            <div className="flex flex-col w-full h-fit">
              <div className="w-full flex justify-between items-center">
                <div className="text-sm">Price</div>
                <div className="text-sm">5.00</div>
              </div>
              <div className="w-full flex justify-between items-center">
                <div className="text-sm">Quantity</div>
                <div className="text-sm flex">
                  <span className="mx-2">+</span>
                  <span className="mx-2">1</span>
                  <span className="mx-2">-</span>
                </div>
              </div>
              <div className="w-full flex justify-between items-center">
                <div className="text-sm">Total</div>
                <div className="text-sm">5.00</div>
              </div>
            </div>
          </div>
          <div className="w-[70%] mt-4 h-fit my-4 mx-auto flex flex-col">
            <img
              src={defaultBookCover}
              className="w-full h-[200px]"
              alt="Book Cover"
            />
            <div className="flex flex-col w-full h-fit">
              <div className="w-full flex justify-between items-center">
                <div className="text-sm">Price</div>
                <div className="text-sm">5.00</div>
              </div>
              <div className="w-full flex justify-between items-center">
                <div className="text-sm">Quantity</div>
                <div className="text-sm flex">
                  <span className="mx-2">+</span>
                  <span className="mx-2">1</span>
                  <span className="mx-2">-</span>
                </div>
              </div>
              <div className="w-full flex justify-between items-center">
                <div className="text-sm">Total</div>
                <div className="text-sm">5.00</div>
              </div>
            </div>
          </div>
          <div className="w-[70%] mt-4 h-fit my-4 mx-auto flex flex-col">
            <img
              src={defaultBookCover}
              className="w-full h-[200px]"
              alt="Book Cover"
            />
            <div className="flex flex-col w-full h-fit">
              <div className="w-full flex justify-between items-center">
                <div className="text-sm">Price</div>
                <div className="text-sm">5.00</div>
              </div>
              <div className="w-full flex justify-between items-center">
                <div className="text-sm">Quantity</div>
                <div className="text-sm flex">
                  <span className="mx-2">+</span>
                  <span className="mx-2">1</span>
                  <span className="mx-2">-</span>
                </div>
              </div>
              <div className="w-full flex justify-between items-center">
                <div className="text-sm">Total</div>
                <div className="text-sm">5.00</div>
              </div>
            </div>
          </div>
          <div className="w-[70%] mt-4 h-fit my-4 mx-auto flex flex-col">
            <img
              src={defaultBookCover}
              className="w-full h-[200px]"
              alt="Book Cover"
            />
            <div className="flex flex-col w-full h-fit">
              <div className="w-full flex justify-between items-center">
                <div className="text-sm">Price</div>
                <div className="text-sm">5.00</div>
              </div>
              <div className="w-full flex justify-between items-center">
                <div className="text-sm">Quantity</div>
                <div className="text-sm flex">
                  <span className="mx-2">+</span>
                  <span className="mx-2">1</span>
                  <span className="mx-2">-</span>
                </div>
              </div>
              <div className="w-full flex justify-between items-center">
                <div className="text-sm">Total</div>
                <div className="text-sm">5.00</div>
              </div>
            </div>
          </div>
          <div className="w-[70%] mt-4 h-fit my-4 mx-auto flex flex-col">
            <img
              src={defaultBookCover}
              className="w-full h-[200px]"
              alt="Book Cover"
            />
            <div className="flex flex-col w-full h-fit">
              <div className="w-full flex justify-between items-center">
                <div className="text-sm">Price</div>
                <div className="text-sm">5.00</div>
              </div>
              <div className="w-full flex justify-between items-center">
                <div className="text-sm">Quantity</div>
                <div className="text-sm flex">
                  <span className="mx-2">+</span>
                  <span className="mx-2">1</span>
                  <span className="mx-2">-</span>
                </div>
              </div>
              <div className="w-full flex justify-between items-center">
                <div className="text-sm">Total</div>
                <div className="text-sm">5.00</div>
              </div>
            </div>
          </div>
          <button className="btn my-2 btn-success w-full btn-block ">
            Go To Payment
          </button>
        </div>
      )}
    </div>
  );
};
export default Navbar;
