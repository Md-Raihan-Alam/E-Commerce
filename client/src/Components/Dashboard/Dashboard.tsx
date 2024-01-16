import React from "react";
import defaultPicture from "../../assets/default-book-cover.png";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const numberOfTimes = 50;

  const componentsArray = Array.from(
    { length: numberOfTimes },
    (value, index) => index
  );

  return (
    <div className="container">
      <div className="w-full h-[200px] flex justify-center items-center">
        <h4>Our Porducts</h4>
      </div>
      <div className="row">
        {componentsArray.map((index) => (
          <Link
            to={`/product/${index}`}
            className="flex no-underline justify-around items-center col-lg-3 col-md-4 col-sm-6 mb-4"
          >
            <div className="card" style={{ width: "100%", maxWidth: "300px" }}>
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
  );
};

export default Dashboard;
