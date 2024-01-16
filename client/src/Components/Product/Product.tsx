import defaultPicture from "../../assets/default-book-cover.png";
const Product = () => {
  return (
    <div className="w-full h-screen">
      <div className="w-full h-fit my-10 flex  justify-around items-center">
        <div className="flex-1 flex justify-center items-center">
          <img
            src={defaultPicture}
            width="300"
            height="300"
            className="h-[200px] sm:h-full mx-2 px-2"
            alt="Book Cover"
          />
        </div>
        <div className="flex-1 px-2 w-full sm:text-[18px] flex flex-col justify-around items-start">
          <div className="text-xl my-2 sm:text-3xl fontbold">Book Name</div>
          <div className="text-base my-2 sm:text-lg font-semibold text-secondary">
            Author Name
          </div>
          <div className="text-sm my-2 sm:text-base">
            Stock:<span className="mx-2">0</span>
          </div>
          <div className="flex w-full my-2 text-sm sm:text-base justify-start items-center">
            Quantity<button className="btn btn-primary ml-2">+</button>
            <span className="w-[40px] sm:w-[100px] mx-2 h-[40px] flex rounded justify-center items-center bg-gray-300">
              0
            </span>
            <button className="btn btn-primary">-</button>
          </div>
          <div className="text-danger my-2 text-sm sm:text-base">
            Out of Stock
          </div>
          <div className="text-sm my-2 sm:text-base">Price</div>
          <div className="text-sm my-2 sm:text-base">Rating</div>
          <button className="btn my-2 btn-primary text-sm sm:text-base">
            Add to cart
          </button>
        </div>
      </div>
      <div className=" px-2 my-2 text-justify">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur
        adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
        in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa
        qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit
        amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
        exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </div>
      <div className="w-full my-4 h-fit">
        <div className="w-full h-[100px] text-4xl font-semibold text-center">
          You may also like these books
        </div>
        <div className="flex flex-wrap justify-around items-center">
          <div
            className="card m-2"
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
          <div
            className="card  m-2"
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
          <div
            className="card  m-2"
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
          <div
            className="card  m-2"
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
        </div>
      </div>
    </div>
  );
};
export default Product;
