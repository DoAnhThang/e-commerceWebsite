/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SERVER_URL } from "../data/api";

const initValues = {
  name: "",
  category: "",
  price: "",
  remain: "",
  short_desc: "",
  long_desc: "",
};

function AddProduct({ edit, role }) {
  const navigate = useNavigate();
  const params = useParams();
  const [formAdd, setFormAdd] = useState(initValues);
  const [image, setImage] = useState([]);
  const [errorMsg, setErrorMsg] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormAdd((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // delete all fields when switch from edit to add mode
  useEffect(() => {
    if (!edit) setFormAdd(initValues);
  }, [edit]);

  // post new product
  const postProduct = async (id, method) => {
    const formData = new FormData();
    for (let i = 0; i < image.length; i++) {
      formData.append("image", image[i]);
    }

    for (const key in formAdd) {
      if (formAdd.hasOwnProperty(key)) {
        formData.append(key, formAdd[key]);
      }
    }

    try {
      const res = await fetch(`${SERVER_URL}/admin/product/${edit ? id : ""}`, {
        method: method,
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      // console.log("postProduct: ", data);
      if (data.errorMsg)
        setErrorMsg((prev) => ({ ...prev, errorMsg: data.errorMg }));
      for (const key in data) {
        if (data[key].msg)
          setErrorMsg((prev) => ({ ...prev, [key]: data[key].msg }));
      }
      if (data.isSuccess) {
        alert(data.message);
        navigate("/products");
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  // get edit product
  const getEditProduct = async () => {
    try {
      const res = await fetch(
        `${SERVER_URL}/admin/product/${params.productId}`,
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      // console.log("getEditProduct: ", data);
      if (data.errorMsg)
        setErrorMsg((prev) => ({ ...prev, errorMsg: data.errorMg }));
      else setFormAdd(data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    if (edit) getEditProduct();
  }, [edit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg(initValues);
    setLoading(true);
    if (edit) postProduct(params.productId, "PUT");
    else postProduct(null, "POST");
  };

  if (role !== "admin") {
    return <h1 className="text-center my-5">Unauthorized!</h1>;
  }

  if (errorMsg.errorMsg) {
    return <h1 className="text-center my-5">{errorMsg.errorMsg}</h1>;
  }

  return (
    <>
      <h4 className="text-dark fw-bold mb-4">
        {edit ? "Update Product" : "Add New Product"}
      </h4>

      <form className="px-3" onSubmit={handleSubmit}>
        <label className="form-label d-block fw-semibold mb-3 add-product--item">
          Product Name
          <input
            type="text"
            name="name"
            placeholder="Enter Product Name"
            required
            className={`form-control mt-2 ${
              errorMsg.name && "border-danger bg-lightRed"
            }`}
            value={formAdd.name}
            onChange={handleChange}
          />
          {errorMsg.name && (
            <div className="form-text text-danger">{errorMsg.name}</div>
          )}
        </label>

        <label className="form-label d-block fw-semibold mb-3 add-product--item">
          Category
          <input
            type="text"
            name="category"
            placeholder="Enter Category"
            required
            className={`form-control mt-2 ${
              errorMsg.category && "border-danger bg-lightRed"
            }`}
            value={formAdd.category}
            onChange={handleChange}
          />
          {errorMsg.category && (
            <div className="form-text text-danger">{errorMsg.category}</div>
          )}
        </label>

        <div className="d-flex justify-content-between gap-5 add-product--item">
          <label className="form-label w-100 fw-semibold mb-3">
            Price
            <input
              type="number"
              name="price"
              placeholder="Enter Price"
              required
              className={`form-control mt-2 ${
                errorMsg.price && "border-danger bg-lightRed"
              }`}
              value={formAdd.price}
              onChange={handleChange}
            />
            {errorMsg.price && (
              <div className="form-text text-danger">{errorMsg.price}</div>
            )}
          </label>
          <label className="form-label w-100 fw-semibold mb-3">
            Available Quantity
            <input
              type="number"
              name="remain"
              placeholder="Enter Quantity"
              required
              className={`form-control mt-2 ${
                errorMsg.remain && "border-danger bg-lightRed"
              }`}
              value={formAdd.remain}
              onChange={handleChange}
            />
            {errorMsg.remain && (
              <div className="form-text text-danger">{errorMsg.remain}</div>
            )}
          </label>
        </div>

        <label className="form-label d-block fw-semibold mb-3 add-product--item">
          Short Description
          <textarea
            name="short_desc"
            rows={4}
            placeholder="Enter Short Description"
            required
            className={`form-control mt-2 ${
              errorMsg.short_desc && "border-danger bg-lightRed"
            }`}
            value={formAdd.short_desc}
            onChange={handleChange}
          />
          {errorMsg.short_desc && (
            <div className="form-text text-danger">{errorMsg.short_desc}</div>
          )}
        </label>

        <label className="form-label d-block fw-semibold mb-3 add-product--item">
          Long Description
          <textarea
            name="long_desc"
            rows={6}
            placeholder="Enter Long Description"
            required
            className={`form-control mt-2 ${
              errorMsg.long_desc && "border-danger bg-lightRed"
            }`}
            value={formAdd.long_desc}
            onChange={handleChange}
          />
          {errorMsg.long_desc && (
            <div className="form-text text-danger">{errorMsg.long_desc}</div>
          )}
        </label>

        <label className="form-label fw-semibold mb-3 add-product--item">
          Upload Image (maximum 4 images)
          <input
            type="file"
            name="image"
            className={`form-control mt-2 ${
              errorMsg.image && "border-danger bg-lightRed"
            }`}
            multiple
            onChange={(e) => {
              if (e.target.files.length > 4) {
                setErrorMsg({ image: "You can upload maximun 4 images" });
              } else setImage(e.target.files);
            }}
          />
          {errorMsg.image && (
            <div className="form-text text-danger">{errorMsg.image}</div>
          )}
        </label>

        <button type="submit" className="btn btn-warning d-block fw-bold mt-3">
          {loading ? "Loading..." : edit ? "Update" : "Submit"}
        </button>
      </form>
    </>
  );
}

export default AddProduct;
