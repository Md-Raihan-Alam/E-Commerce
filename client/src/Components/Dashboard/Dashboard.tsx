import closeSVG from "../../assets/close.svg";
import defaultPicture from "../../assets/default-book-cover.png";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGlobalContext, GlobalContextTypes } from "../../context";
import uselocalState from "../../utils/localState";
import Loading from "../../utils/Loading";
import url from "../../utils/url";
import axios from "axios";
const Dashboard = () => {
  const context = useGlobalContext() as GlobalContextTypes;
  const { user } = context;
  const [nextPage, setNextPage] = useState(-1);

  const [prevPage, setPrevPage] = useState(-1);
  const { isLoading, setLoading } = uselocalState();
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [selectedRating, setSelectedRating] = useState<string>("");
  const handleMinPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setMinPrice(value);
  };
  const handleMaxPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setMaxPrice(value);
  };
  const handleRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRating(event.target.value);
  };
  const [showMenu, setShowMenu] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const getAllProductsReq = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${url}/api/v1/product/`);
      setAllProducts(data.result);
      setNextPage(data.next.page);
      setPrevPage(data.previous.page);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };
  const setPage = async (page: Number) => {
    setLoading(true);
    let setPage = String(page);
    try {
      const { data } = await axios.get(
        `${url}/api/v1/product?page=${setPage}&limit=5`
      );
      setAllProducts(data.result);
      setNextPage(data.next.page);
      setPrevPage(data.previous.page);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  const handleApplyFilter = async () => {
    setLoading(true);
    if (minPrice >= 0 && maxPrice >= 0) {
      const queryParams = new URLSearchParams({
        min_price: minPrice.toString(),
        max_price: maxPrice.toString(),
        rating: selectedRating,
      });
      try {
        const { data } = await axios.get(
          `${url}/api/v1/product/filter?${queryParams.toString()}`
        );
        // console.log(data.products);
        setAllProducts(data.products);
      } catch (error) {
        console.log(error);
      }
    } else {
    }
    setLoading(false);
  };
  const handleResetFilter = () => {
    getAllProductsReq();
    setSelectedRating("");
    setMaxPrice(0);
    setMinPrice(0);
  };
  useEffect(() => {
    getAllProductsReq();
  }, []);
  const updateDisplayMenu = () => {
    setShowMenu(!showMenu);
  };
  if (isLoading) {
    <div className="w-full h-[92vh] flex justify-center items-center">
      <Loading />
    </div>;
  }
  if (allProducts === null) {
    <div className="w-full h-[92vh] flex justify-center items-center">
      <div className="alert alert-info">We have no product for now!</div>
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
              <input
                type="radio"
                value="4.0"
                checked={selectedRating === "4.0"}
                onChange={handleRatingChange}
                className="form-check-input"
              />
              <label className="form-check-label">Above or equal 4.0</label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                value="3.0"
                checked={selectedRating === "3.0"}
                onChange={handleRatingChange}
                className="form-check-input"
              />
              <label className="form-check-label">Above or equal 3.0</label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                value="2.0"
                checked={selectedRating === "2.0"}
                onChange={handleRatingChange}
                className="form-check-input"
              />
              <label className="form-check-label">Above or equal 2.0</label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                value="1.0"
                checked={selectedRating === "1.0"}
                onChange={handleRatingChange}
                className="form-check-input"
              />
              <label className="form-check-label">Above or equal 1.0</label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                value=""
                checked={!selectedRating}
                onChange={handleRatingChange}
                className="form-check-input"
              />
              <label className="form-check-label">Any</label>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="price">Min Price</label>
            <input
              type="number"
              min="0"
              className="form-control"
              value={minPrice}
              onChange={handleMinPriceChange}
              placeholder="Enter minimum price"
            />
          </div>
          <div className="form-group">
            <label htmlFor="price">Max Price</label>
            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={handleMaxPriceChange}
              className="form-control"
              placeholder="Enter minimum price"
            />
          </div>
          <button
            className="btn btn-block btn-success w-[90%]"
            onClick={handleApplyFilter}
            disabled={minPrice < 0 || maxPrice < 0}
          >
            Apply
          </button>
          <button
            className="btn btn-block btn-success w-[90%]"
            onClick={handleResetFilter}
            disabled={minPrice < 0 || maxPrice < 0}
          >
            Reset
          </button>
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
            {allProducts!.map((index: any) => (
              <Link
                to={`/product/${index._id}`}
                className="flex no-underline justify-around items-center col-lg-3 col-md-4 col-sm-6 mb-4"
                key={index._id}
              >
                <div
                  className="card"
                  style={{ width: "100%", maxWidth: "300px", height: "500px" }}
                >
                  {index.image === "" ? (
                    <img
                      className="card-img-top w-[300px] h-[300px]"
                      src={defaultPicture}
                      alt="Card image cap"
                    />
                  ) : (
                    <img
                      className="card-img-top w-[300px] h-[300px]"
                      src={`${url}${index.image}`}
                      alt="Card image cap"
                    />
                  )}

                  <div className="card-body">
                    <h5 className="card-title w-full h-fit min-h-[50px]">
                      {index.name}
                    </h5>
                    <h6 className="card-title w-full h-[30px]">
                      {index.author}
                    </h6>
                    <p className="card-text d-flex w-full h-[50px] justify-content-between">
                      <span>{index.averageRating}</span>
                      <span>{index.price}</span>
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="flex my-2 justify-center w-full h-full items-center">
            {prevPage !== -1 && (
              <button
                type="button"
                onClick={() => setPage(prevPage)}
                className="cursor-pointer focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              >
                Previous
              </button>
            )}
            <button
              type="button"
              disabled={true}
              className="cursor-pointer py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              {prevPage === -1 && nextPage === -1
                ? 1
                : prevPage === -1 && nextPage !== -1
                ? nextPage - 1
                : prevPage + 1}
            </button>
            {nextPage !== -1 && (
              <button
                type="button"
                onClick={() => setPage(nextPage)}
                className="cursor-pointer focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
