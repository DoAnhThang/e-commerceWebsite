import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../store/ui-slice";
import { SERVER_URL } from "../data/api";

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // get state data of cart slice from Redux
  const cart = useSelector((state) => state.ui.cart);
  const user = useSelector((state) => state.ui.user);
  const loading = useSelector((state) => state.ui.loading);

  const [formBill, setFormBill] = useState({
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    address: "",
  });
  const [errorMsg, setErrorMsg] = useState({});

  const handleChange = (e) => {
    setFormBill((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // post order
  const postOrder = async () => {
    dispatch(uiActions.loading(true));
    try {
      const res = await fetch(`${SERVER_URL}/shop/order`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(formBill),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      // console.log("postOrder: ", data);
      if (data.expired) {
        dispatch(uiActions.status({ isAuth: false, user: {} }));
        dispatch(uiActions.loading(false));
        return console.log(data.errorMsg);
      }
      for (const key in data) {
        if (data[key].msg) {
          setErrorMsg((prev) => ({ ...prev, [key]: data[key].msg }));
        }
      }
      if (data.isSuccess) {
        setTimeout(() => {
          navigate("/history");
        }, 2000);
      }
      dispatch(uiActions.cart(data.cart));
      dispatch(uiActions.loading(false));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg({});
    postOrder();
  };

  return (
    <Container>
      <div
        className="d-flex justify-content-between align-items-center gap-4 bg-light checkout"
        style={{ padding: "3rem" }}
      >
        <h3 className="mb-0">CHECKOUT</h3>
        <h6 className="mb-0">
          HOME / CART / <span className="text-secondary">CHECKOUT</span>
        </h6>
      </div>

      <h5 className="mt-5 mb-4">BILLING DETAILS</h5>

      {/* display the order status */}
      <Row className="pe-2">
        <Col md={8} className="pe-4">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicFullName">
              <Form.Label>FULL NAME:</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                placeholder="Enter Your Full Name Here!"
                className={`fst-normal rounded-0 p-3 ${
                  errorMsg.fullName && "border-danger bg-lightRed"
                }`}
                value={formBill.fullName}
                onChange={handleChange}
                required
              />
              {errorMsg.fullName && (
                <div className="form-text text-danger">{errorMsg.fullName}</div>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>EMAIL:</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter Your Email Here!"
                className={`fst-normal rounded-0 p-3 ${
                  errorMsg.email && "border-danger bg-lightRed"
                }`}
                value={formBill.email}
                onChange={handleChange}
                required
              />
              {errorMsg.email && (
                <div className="form-text text-danger">{errorMsg.email}</div>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPhoneNumber">
              <Form.Label>PHONE NUMBER:</Form.Label>
              <Form.Control
                type="number"
                name="phoneNumber"
                placeholder="Enter Your Phone Number Here!"
                className={`fst-normal rounded-0 p-3 ${
                  errorMsg.phoneNumber && "border-danger bg-lightRed"
                }`}
                value={formBill.phoneNumber}
                onChange={handleChange}
                required
              />
              {errorMsg.phoneNumber && (
                <div className="form-text text-danger">
                  {errorMsg.phoneNumber}
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicAddress">
              <Form.Label>ADDRESS:</Form.Label>
              <Form.Control
                type="text"
                name="address"
                placeholder="Enter Your Address Here!"
                className={`fst-normal rounded-0 p-3 ${
                  errorMsg.address && "border-danger bg-lightRed"
                }`}
                value={formBill.address}
                onChange={handleChange}
                required
              />
              {errorMsg.address && (
                <div className="form-text text-danger">{errorMsg.address}</div>
              )}
            </Form.Group>

            <Button
              variant="dark"
              type="submit"
              className="fs-5 rounded-0 py-2 px-3"
              disabled={
                Object.values(formBill).some((val) => val === "") ||
                loading ||
                cart.items.length === 0
              }
            >
              {loading ? "Loading..." : "Place order"}
            </Button>
            {errorMsg.message && (
              <span className="form-text text-success fw-bold ms-5">
                {errorMsg.message}
              </span>
            )}
          </Form>
        </Col>

        {/* display cart total */}
        <Col className="bg-light p-5 mt-4" style={{ height: "fit-content" }}>
          <h5 className="mb-4">YOUR ORDER</h5>

          {cart.items.length > 0 &&
            cart.items.map((item) => (
              <div
                className="d-flex justify-content-between align-items-center cg-1 border-bottom pb-3 mb-3"
                key={item.productId._id}
              >
                <h6 className="mb-0" style={{ flex: 1.2 }}>
                  {item.productId.name}
                </h6>
                <p className="text-end text-secondary mb-0" style={{ flex: 1 }}>
                  {item.productId.price
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                  VND x {item.quantity}
                </p>
              </div>
            ))}

          <div className="d-flex justify-content-between align-items-center mt-3 mb-4">
            <h6 className="mb-0">TOTAL</h6>
            <p className="fs-5 mb-0">
              {cart.totalAmount
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
              VND
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Checkout;
