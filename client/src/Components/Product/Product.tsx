import defaultPicture from "../../assets/default-book-cover.png";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import url from "../../utils/url";
import uselocalState from "../../utils/localState";
import { useEffect, useState } from "react";
import Loading from "../../utils/Loading";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../../store/slices/cart-slice";

interface ProductType {
  id: string;
  name: string;
  author: string;
  inventory: number;
  image: string;
  description: string;
  price: number;
  averageRating: number;
  orderedQuantity: number;
}

const Product = () => {
  const { isLoading, setLoading } = uselocalState();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [recentProduct, setRecentProducts] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(1);
  const { productDetails } = useParams();
  const { cart } = useSelector((state) => state);
  const dispatch = useDispatch();

  const getSingleProduct = async (id: string | null | undefined) => {
    setLoading(true);
    try {
      const product = await axios.get(`${url}/api/v1/product/${id}`);
      setProduct(product.data.product);
      const recent = await axios.get(`${url}/api/v1/product/recent/${id}`);
      setRecentProducts(recent.data.products);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getSingleProduct(productDetails);
  }, [productDetails]);

  const handleAddToCart = () => {
    if (product !== null) {
      product.orderedQuantity = totalQuantity;
      dispatch(addToCart(product));
    }
  };

  const handleRemoveFromCart = () => {
    if (product !== null) {
      dispatch(removeFromCart(product.id));
    }
  };

  const onInc = () => {
    if (totalQuantity < product?.inventory) {
      setTotalQuantity((prevState) => prevState + 1);
    }
  };

  const onDec = () => {
    if (totalQuantity > 1) {
      setTotalQuantity((prevState) => prevState - 1);
    }
  };

  const findCartItem = (id: string) => {
    return cart.find((item: ProductType) => item.id === id);
  };

  const cartItem = findCartItem(product?.id);

  useEffect(() => {
    if (!cartItem) {
      setTotalQuantity(1);
    }
  }, [cartItem]);

  if (isLoading || product === null) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  if (recentProduct === undefined) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="w-full h-screen">
      <div className="w-full h-fit my-10 flex justify-around items-center">
        <div className="flex-1 flex justify-center items-center">
          <img
            src={product ? `${url}${product.image}` : defaultPicture}
            width="300"
            height="300"
            className="h-[200px] sm:h-full mx-2 px-2"
            alt="Book Cover"
          />
        </div>
        <div className="flex-1 px-2 w-full sm:text-[18px] flex flex-col justify-around items-start">
          <div className="text-xl my-2 sm:text-3xl font-bold">
            {product.name}
          </div>
          <div className="text-base my-2 sm:text-lg font-semibold text-secondary">
            {product.author}
          </div>
          {product.inventory > 0 ? (
            <>
              <div className="text-sm my-2 sm:text-base">
                Stock:<span className="mx-2">{product.inventory}</span>
              </div>
              <div className="flex w-full my-2 text-sm sm:text-base justify-start items-center">
                Quantity
                <button
                  onClick={onInc}
                  className="btn btn-primary ml-2"
                  disabled={!!cartItem}
                >
                  +
                </button>
                <span className="w-[40px] sm:w-[100px] mx-2 h-[40px] flex rounded justify-center items-center bg-gray-300">
                  {cartItem ? cartItem.orderedQuantity : totalQuantity}
                </span>
                <button
                  onClick={onDec}
                  className="btn btn-primary"
                  disabled={!!cartItem}
                >
                  -
                </button>
              </div>
            </>
          ) : (
            <></>
          )}
          {product.inventory <= 0 ? (
            <div className="text-danger my-2 text-sm sm:text-base">
              Out of Stock
            </div>
          ) : (
            <></>
          )}
          <div className="text-sm my-2 sm:text-base">
            Price: {product.price}
          </div>
          <div className="text-sm my-2 sm:text-base">
            Rating: {product.averageRating}
          </div>
          <button
            onClick={cartItem ? handleRemoveFromCart : handleAddToCart}
            className={`btn my-2 ${
              cartItem ? "btn-danger" : "btn-primary"
            } text-sm sm:text-base`}
          >
            {cartItem ? "Remove from cart" : "Add to cart"}
          </button>
        </div>
      </div>
      <div className="px-2 my-2 text-justify">{product.description}</div>
      <div className="w-full my-4 h-fit py-5">
        <div className="w-full h-[100px] text-4xl font-semibold text-center">
          You may also like these books
        </div>
        <div className="flex flex-wrap justify-around items-center ">
          {recentProduct.map((e: any) => (
            <div
              className="card"
              style={{
                width: "100%",
                maxWidth: "300px",
                height: "500px",
                cursor: "pointer",
              }}
              onClick={() => getSingleProduct(e._id)}
              key={e._id}
            >
              <img
                className="card-img-top w-[300px] h-[300px]"
                src={`${url}${e.image}`}
                alt="Card image cap"
              />
              <div className="card-body">
                <h5 className="card-title w-full h-[50px]">{e.name}</h5>
                <h6 className="card-title w-full h-[30px]">{e.author}</h6>
                <p className="card-text d-flex w-full h-[50px] justify-content-between">
                  <span>{e.averageRating}</span>
                  <span>{e.price}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Product;
