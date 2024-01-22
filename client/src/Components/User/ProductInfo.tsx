import { useState } from "react";
import axios from "axios";
import url from "../../utils/url";
const ProductInfos = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [inventory, setInventory] = useState("");
  const [averageRating, setAverageRating] = useState("");
  const [authorName, setAuthorName] = useState("");
  const handleSubmit = async () => {
    const inventoryNumber = parseInt(inventory, 10);
    const averageRatingFloat = parseFloat(averageRating);
    const formData = {
      name,
      price,
      description,
      image,
      freeDelivery,
      inventoryNumber,
      averageRatingFloat,
      authorName,
    };
    const createProduct = await axios.post(`${url}/api/v1/product`, formData);
  };

  const handleImageChange = (e: any) => {
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
              value={inventory}
              onChange={(e) => setInventory(e.target.value)}
            />
          </div>
          <div className="form-group my-2">
            <label htmlFor="averageRating">Average Rating</label>
            <input
              type="text"
              className="form-control"
              name="averageRating"
              placeholder="Enter average rating"
              value={averageRating}
              onChange={(e) => setAverageRating(e.target.value)}
            />
          </div>
          <div className="form-group my-2">
            <label htmlFor="authorName">Author Name</label>
            <input
              type="text"
              className="form-control"
              name="authorName"
              placeholder="Enter author name"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
            />
          </div>
          <div className="w-full mt-2 mb-4">
            <button
              type="button"
              className="btn btn-primary w-full btn-block"
              onClick={handleSubmit}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductInfos;
