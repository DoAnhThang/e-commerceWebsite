/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SERVER_URL } from "../data/api";

function ProductsList({ role }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState({});

  // get products
  const getProducts = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/admin/products`, {
        credentials: "include",
      });
      const data = await res.json();
      // console.log("getProducts: ", data);
      if (data.errorMsg) return setErrorMsg(data);
      else setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  // get searched products
  const getSearchedProducts = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/admin/search?keyword=${keyword}`, {
        credentials: "include",
      });
      const data = await res.json();
      // console.log("getSearchedProducts: ", data);
      if (data.errorMsg)
        setErrorMsg((prev) => ({ ...prev, errorMsg: data.errorMg }));
      else setSearchResult(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!keyword) getProducts();
      else getSearchedProducts();
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [keyword]);

  // delete product
  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`${SERVER_URL}/admin/product/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      // console.log("deleteProduct: ", data);
      if (data.errorMsg)
        setErrorMsg((prev) => ({ ...prev, errorMsg: data.errorMg }));

      if (!keyword) getProducts();
      else getSearchedProducts();
    } catch (err) {
      console.error(err);
    }
  };

  if (role !== "admin") {
    return <h1 className="text-center my-5">Unauthorized!</h1>;
  }

  if (errorMsg.errorMsg) {
    return <h1 className="text-center my-5">{errorMsg.errorMsg}</h1>;
  }

  return (
    <>
      <div className="d-flex justify-content-between">
        <h4 className="text-dark fw-bold mb-4">Products List</h4>
        <button
          className="btn btn-warning rounded-0 fw-bold h-fit"
          onClick={() => navigate("/add-product")}
        >
          Add New
        </button>
      </div>
      <input
        type="text"
        placeholder="Enter Product Name!"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="form-control w-25 mb-4"
        style={{ minWidth: "200px" }}
      />

      {products ? (
        <div className="table-responsive bg-white shadow-sm p-3">
          <h5 className="text-dark fw-semibold mb-4">
            {!keyword ? "All Products" : "Search Result"}
          </h5>
          <table className="table table-bordered table-striped align-middle mb-0">
            <thead>
              <tr className="fw-semibold">
                <td>ID</td>
                <td>Name</td>
                <td>Price</td>
                <td style={{ width: "10%" }}>Image</td>
                <td>Category</td>
                <td>Remain</td>
                <td>Edit</td>
              </tr>
            </thead>
            {keyword ? (
              <tbody>
                {searchResult &&
                  searchResult.map((prod) => (
                    <tr key={prod._id}>
                      <td className="text-break" style={{ minWidth: "63px" }}>
                        {prod._id}
                      </td>
                      <td>{prod.name}</td>
                      <td>
                        {prod.price
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                        VND
                      </td>
                      <td>
                        <img
                          src={`${
                            prod.img1.includes("images")
                              ? `${SERVER_URL}/${prod.img1}`
                              : prod.img1
                          }`}
                          alt={prod.name}
                          className="w-50"
                        />
                      </td>
                      <td>{prod.category}</td>
                      <td>{prod.remain}</td>
                      <td>
                        <button
                          className="btn btn-success rounded-0 me-2"
                          onClick={() => navigate(`/edit-product/${prod._id}`)}
                        >
                          Update
                        </button>
                        <button
                          className="btn btn-danger rounded-0"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure want to delete this product?"
                              )
                            )
                              deleteProduct(prod._id);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            ) : (
              <tbody>
                {products &&
                  products.map((prod) => (
                    <tr key={prod._id}>
                      <td className="text-break" style={{ minWidth: "65px" }}>
                        {prod._id}
                      </td>
                      <td style={{ minWidth: "70px" }}>{prod.name}</td>
                      <td>
                        {prod.price
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                        VND
                      </td>
                      <td>
                        <img
                          src={`${
                            prod.img1.includes("images")
                              ? `${SERVER_URL}/${prod.img1}`
                              : prod.img1
                          }`}
                          alt={prod.name}
                          className="w-50"
                        />
                      </td>
                      <td>{prod.category}</td>
                      <td>{prod.remain}</td>
                      <td>
                        <button
                          className="btn btn-success rounded-0 me-2"
                          onClick={() => navigate(`/edit-product/${prod._id}`)}
                        >
                          Update
                        </button>
                        <button
                          className="btn btn-danger rounded-0"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure want to delete this product?"
                              )
                            )
                              deleteProduct(prod._id);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            )}
          </table>
        </div>
      ) : (
        <div className="spinner"></div>
      )}
    </>
  );
}

export default ProductsList;
