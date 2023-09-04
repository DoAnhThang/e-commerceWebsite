/* eslint-disable react-hooks/exhaustive-deps */
import ReactDOM from "react-dom";
import { Container, Row, Col, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { uiActions, postCart } from "../store/ui-slice";
import { SERVER_URL } from "../data/api";

function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // get state data of cart slice from Redux
  const cart = useSelector((state) => state.ui.cart);
  const loading = useSelector((state) => state.ui.loading);

  // update cart
  const updateCart = async (id, method) => {
    dispatch(uiActions.loading(true));
    try {
      const res = await fetch(`${SERVER_URL}/shop/cart/${id}`, {
        method: method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      // console.log("updateCart: ", data);
      if (data.expired) {
        dispatch(uiActions.status({ isAuth: false, user: {} }));
        dispatch(uiActions.loading(false));
        return console.log(data.errorMsg);
      }
      dispatch(uiActions.cart(data));
      dispatch(uiActions.loading(false));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container>
      <div className="bg-light d-flex justify-content-between align-items-center p-5">
        <h3 className="mb-0">CART</h3>
        <h6 className="text-secondary mb-0">CART</h6>
      </div>

      <h5 className="mt-5 mb-4">SHOPPING CART</h5>

      {/* display products in the cart */}
      <Row className="px-0">
        <Col lg={8} className="">
          <Table
            responsive="sm"
            hover
            className="text-center border-white align-middle mb-4"
          >
            <thead className="table-light border-white align-middle">
              <tr>
                <th className="fw-semibold py-3">IMAGE</th>
                <th className="fw-semibold py-3">PRODUCT</th>
                <th className="fw-semibold py-3">PRICE</th>
                <th className="fw-semibold py-3">QUANTITY</th>
                <th className="fw-semibold py-3">TOTAL</th>
                <th className="fw-semibold py-3">REMOVE</th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map((item) => (
                <tr key={item._id} className="text-break">
                  <td className="py-4">
                    <img
                      src={`${
                        item.productId.img1.includes("images")
                          ? `${SERVER_URL}/${item.productId.img1}`
                          : item.productId.img1
                      }`}
                      alt={item.productId.name}
                      style={{ width: "50px" }}
                    />
                  </td>
                  <td className="fw-semibold">{item.productId.name}</td>
                  <td className="text-secondary">
                    {item.productId.price
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    <br />
                    VND
                  </td>
                  <td className="fst-normal">
                    <button
                      type="button"
                      className="py-1 ps-1 pe-3 border-0 bg-transparent text-shadow-hover"
                      disabled={item.quantity <= 1}
                      onClick={() => updateCart(item.productId._id, "PUT")}
                    >
                      <i className="fa fa-caret-left fw-bold"></i>
                    </button>
                    {item.quantity}
                    <button
                      type="button"
                      className="py-1 ps-3 pe-1 border-0 bg-transparent text-shadow-hover"
                      disabled={item.quantity >= item.productId.remain}
                      onClick={() => dispatch(postCart(item.productId._id, 1))}
                    >
                      <i className="fa fa-caret-right fw-bold"></i>
                    </button>
                  </td>
                  <td className="text-secondary">
                    {(parseInt(item.productId.price) * item.quantity)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    <br />
                    VND
                  </td>
                  <td>
                    <i
                      className="fa-regular fa-trash-can text-shadow-hover cursor-pointer p-2"
                      onClick={() => updateCart(item.productId._id, "DELETE")}
                    ></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* navigation key */}
          <div className="bg-light d-flex justify-content-between align-items-center p-3 mb-4">
            <button
              type="button"
              className="btn btn-light border-0 rounded-0 p-2"
              onClick={() => navigate("/shop")}
            >
              <i className="fa fa-long-arrow-left me-2"></i>Continue shopping
            </button>
            <button
              type="button"
              className="btn btn-light border-dark rounded-0 p-2"
              disabled={cart.totalQuantity === 0 ? true : false}
              onClick={() => navigate("/checkout")}
            >
              Proceed to checkout<i className="fa fa-long-arrow-right ms-2"></i>
            </button>
          </div>
        </Col>

        {/* display cart total */}
        <Col lg={4} className="bg-light p-5" style={{ height: "fit-content" }}>
          <h5 className="mb-4">CART TOTAL</h5>
          <div className="d-flex justify-content-between align-items-center cg-1 border-bottom pb-3">
            <h6 className="mb-0">SUBTOTAL</h6>
            <p className="text-secondary mb-0">
              {cart.totalAmount
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
              VND
            </p>
          </div>
          <div className="d-flex justify-content-between align-items-center cg-1 mt-3 mb-4">
            <h6 className="mb-0">TOTAL</h6>
            <p className="fs-5 mb-0">
              {cart.totalAmount
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
              VND
            </p>
          </div>
          <input
            type="text"
            placeholder="Enter your coupon"
            className="w-100 fst-normal p-2 mb-1"
          />
          <button className="btn btn-dark w-100 fst-normal rounded-0">
            <i className="fa fa-gift"></i>&nbsp;&nbsp;Apply coupon
          </button>
        </Col>
      </Row>

      {loading &&
        ReactDOM.createPortal(
          <div
            className="container-fluid vh-100 position-fixed top-0 start-0 spinner"
            style={{
              zIndex: 100,
              background: "rgba(0, 0, 0, 0.75)",
            }}
          />,
          document.getElementById("backdrop-root")
        )}
    </Container>
  );
}

export default Cart;
