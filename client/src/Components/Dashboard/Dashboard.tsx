import closeSVG from "../../assets/close.svg";
import defaultPicture from "../../assets/default-book-cover.png";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGlobalContext, GlobalContextTypes } from "../../context";
import uselocalState from "../../utils/localState";
import Loading from "../../utils/Loading";
import url from "../../utils/url";
import axios from "axios";
const Dashboard = () => {
  const context = useGlobalContext() as GlobalContextTypes;
  const { user } = context;
  const [showMenu, setShowMenu] = useState(false);
  const numberOfTimes = 50;
  const componentsArray = Array.from(
    { length: numberOfTimes },
    (value, index) => index
  );
  const { isLoading } = uselocalState();
  const updateDisplayMenu = () => {
    setShowMenu(!showMenu);
  };
  if (isLoading) {
    <div className="w-full h-[92vh] flex justify-center items-center">
      <Loading />
    </div>;
  }
  return (
    <div className="flex h-[92vh]">
      {user !== null && (
        <div
          className={`w-[300px] ${
            showMenu ? "flex absolute sm:relative z-10 sm:z-0" : "hidden"
          } text-white bg-red-800 sm:flex flex-col justify-evenly items-center overflow-hidden h-full`}
        >
          <div className="text-3xl w-full flex justify-around items-center p-4">
            <div>Filter</div>
            <img
              src={closeSVG}
              className="cursor-pointer sm:hidden"
              width="30"
              height="30"
              alt="Close"
              onClick={updateDisplayMenu}
            />
          </div>
          <div className="form-group">
            <label className="text-xl">Ratings</label>
            <div className="form-check">
              <input type="radio" className="form-check-input" />
              <label className="form-check-label">Higher than 4.0</label>
            </div>
            <div className="form-check">
              <input type="radio" className="form-check-input" />
              <label className="form-check-label">Higher than 3.0</label>
            </div>
            <div className="form-check">
              <input type="radio" className="form-check-input" />
              <label className="form-check-label">Higher than 2.0</label>
            </div>
            <div className="form-check">
              <input type="radio" className="form-check-input" />
              <label className="form-check-label">Higher than 1.0</label>
            </div>
            <div className="form-check">
              <input type="radio" className="form-check-input" />
              <label className="form-check-label">Any</label>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="price">Min Price</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter minimum price"
            />
          </div>
          <div className="form-group">
            <label htmlFor="price">Max Price</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter minimum price"
            />
          </div>
          <button className="btn btn-block btn-success w-[90%]">Apply</button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <div className="container">
          <div className="w-full h-[200px] flex flex-col justify-center items-center">
            <h4>Our Products</h4>
            {user !== null && (
              <div className="sm:hidden">
                <button className="btn btn-info" onClick={updateDisplayMenu}>
                  Filter
                </button>
              </div>
            )}
          </div>
          <div className="row">
            {componentsArray.map((index) => (
              <Link
                to={`/product/${index}`}
                className="flex no-underline justify-around items-center col-lg-3 col-md-4 col-sm-6 mb-4"
                key={index}
              >
                <div
                  className="card"
                  style={{ width: "100%", maxWidth: "300px" }}
                >
                  <img
                    className="card-img-top"
                    src={defaultPicture}
                    alt="Card image cap"
                  />
                  <div className="card-body">
                    <h5 className="card-title">Book Title</h5>
                    <h6 className="card-title">Author name</h6>
                    <p className="card-text d-flex justify-content-between">
                      <span>Rating</span>
                      <span>Price</span>
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
