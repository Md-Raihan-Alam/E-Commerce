import { useState, useRef, useEffect } from "react";
import axios from "axios";
import url from "../../utils/url";
import { useGlobalContext, GlobalContextTypes } from "../../context";
const ProductInfos = (props: object) => {
  let itemsInfo = props.props;
  const context = useGlobalContext() as GlobalContextTypes;
  const { getCookie } = context;
  const [productFound, setProductFound] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [totalInventory, setTotalInventory] = useState("");
  const [rating, setRating] = useState("");
  const [author, setAuthor] = useState("");
  const [imageUpdate, setImageUpdate] = useState(false);
  const fileInputRef = useRef(null);
  useEffect(() => {
    if (itemsInfo != undefined) {
      setProductFound(true);
      setName(itemsInfo.name || "");
      setPrice(itemsInfo.price || "");
      setDescription(itemsInfo.description || "");
      setFreeDelivery(itemsInfo.freeDelivery || false);
      setTotalInventory(itemsInfo.inventory || "");
      setRating(itemsInfo.averageRating || "");
      setAuthor(itemsInfo.author || "");
    }
    console.log(productFound);
  }, [itemsInfo]);
  const updateSubmit = async () => {
    const token = getCookie("token");
    const inventory = parseInt(totalInventory, 10);
    const averageRating = parseFloat(rating);
    if (!imageUpdate) {
      setImage(itemsInfo.image);
    }
    try {
      await axios.patch(
        `${url}/api/v1/product/${itemsInfo._id}`,
        {
          id: itemsInfo._id,
          name,
          price,
          description,
          image,
          freeDelivery,
          inventory,
          averageRating,
          author,
          token,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setName("");
      setPrice("");
      setDescription("");
      setImage(null);
      setFreeDelivery(false);
      setTotalInventory("");
      setRating("");
      setAuthor("");
      fileInputRef.current.value = null;
    } catch (error: any) {
      console.log(error);
    }
  };
  const handleSubmit = async () => {
    const token = getCookie("token");
    const inventory = parseInt(totalInventory, 10);
    const averageRating = parseFloat(rating);

    try {
      await axios.post(
        `${url}/api/v1/product`,
        {
          name,
          price,
          description,
          image,
          freeDelivery,
          inventory,
          averageRating,
          author,
          token,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setName("");
      setPrice("");
      setDescription("");
      setImage(null);
      setFreeDelivery(false);
      setTotalInventory("");
      setRating("");
      setAuthor("");
      fileInputRef.current.value = null;
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleImageChange = (e: any) => {
    setImageUpdate(true);
    const file = e.target.files[0];
    setImage(file);
  };
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="form-group my-2">
            <label htmlFor="name">Product Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              placeholder="Enter product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group my-2">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              className="form-control"
              name="price"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="form-group my-2">
            <label htmlFor="description">Description</label>
            <textarea
              className="form-control"
              name="description"
              placeholder="Enter product description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="form-group my-2">
            <label htmlFor="image">Product Image</label>
            <input
              type="file"
              className="form-control"
              name="image"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
          </div>
          <div className="form-group my-2">
            <label htmlFor="freeDeliveryPrice">Free Delivery</label>
            <div className="form-check">
              <input
                type="radio"
                className="form-check-input"
                name="freeDelivery"
                placeholder="Enter free delivery price"
                value="yes"
                checked={freeDelivery === true}
                onChange={() => setFreeDelivery(true)}
              />
              <label className="form-check-label" htmlFor="freeDeliveryYes">
                Yes
              </label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                className="form-check-input"
                name="freeDelivery"
                value="no"
                checked={freeDelivery === false}
                onChange={() => setFreeDelivery(false)}
              />
              <label className="form-check-label" htmlFor="freeDeliveryNo">
                No
              </label>
            </div>
          </div>
          <div className="form-group my-2">
            <label htmlFor="inventory">Inventory</label>
            <input
              type="text"
              className="form-control"
              name="inventory"
              placeholder="Enter inventory"
              value={totalInventory}
              onChange={(e) => setTotalInventory(e.target.value)}
            />
          </div>
          <div className="form-group my-2">
            <label htmlFor="averageRating">Average Rating</label>
            <input
              type="text"
              className="form-control"
              name="averageRating"
              placeholder="Enter average rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            />
          </div>
          <div className="form-group my-2">
            <label htmlFor="authorName">Author Name</label>
            <input
              type="text"
              className="form-control"
              name="authorName"
              placeholder="Enter author name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          <div className="w-full mt-2 mb-4">
            {productFound === false ? (
              <button
                type="button"
                className="btn btn-primary w-full btn-block"
                onClick={handleSubmit}
              >
                Create
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary w-full btn-block"
                onClick={updateSubmit}
              >
                Update
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductInfos;
