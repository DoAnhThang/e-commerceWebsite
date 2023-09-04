/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { postCart } from "../store/ui-slice";
import { SERVER_URL } from "../data/api";

function Detail() {
  // scroll to top of component at the first time
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();

  const [detailProduct, setDetailProduct] = useState(null);
  const [showImage, setShowImage] = useState(null);
  const [showDesc, setShowDesc] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // get state data of cart slice from Redux
  const isAuth = useSelector((state) => state.ui.isAuth);
  const loading = useSelector((state) => state.ui.loading);
  const cart = useSelector((state) => state.ui.cart);

  const prodInCart = cart.items.find(
    (prod) => prod.productId._id === params.productId
  );

  // get product information
  const getProduct = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/shop/detail/${params.productId}`);
      const data = await res.json();
      // console.log("getProduct: ", data);
      if (data.errorMsg) return console.log(data.errorMsg);
      setDetailProduct(data);
      setShowImage(data.product.img1);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    getProduct();
  }, [params.productId]);

  return (
    <Container className="mb-5">
      <div className="bg-light d-flex justify-content-between align-items-center p-5">
        <h3 className="mb-0">DETAIL</h3>
        <h6 className="text-secondary mb-0">DETAIL</h6>
      </div>

      {!detailProduct ? (
        <div className="spinner"></div>
      ) : (
        <>
          <Row className="mt-5 mb-4">
            <Col md={5}>
              <Row className="align-items-center">
                <Col className="col-2 mb-4">
                  {detailProduct.product.img1 && (
                    <img
                      src={`${
                        detailProduct.product.img1.includes("images")
                          ? `${SERVER_URL}/${detailProduct.product.img1}`
                          : detailProduct.product.img1
                      }`}
                      alt={detailProduct.product.name}
                      className="w-100 cursor-pointer my-2"
                      onClick={() => setShowImage(detailProduct.product.img1)}
                    />
                  )}
                  {detailProduct.product.img2 && (
                    <img
                      src={`${
                        detailProduct.product.img2.includes("images")
                          ? `${SERVER_URL}/${detailProduct.product.img2}`
                          : detailProduct.product.img2
                      }`}
                      alt={detailProduct.product.name}
                      className="w-100 cursor-pointer my-2"
                      onClick={() => setShowImage(detailProduct.product.img2)}
                    />
                  )}
                  {detailProduct.product.img3 && (
                    <img
                      src={`${
                        detailProduct.product.img3.includes("images")
                          ? `${SERVER_URL}/${detailProduct.product.img3}`
                          : detailProduct.product.img3
                      }`}
                      alt={detailProduct.product.name}
                      className="w-100 cursor-pointer my-2"
                      onClick={() => setShowImage(detailProduct.product.img3)}
                    />
                  )}
                  {detailProduct.product.img4 && (
                    <img
                      src={`${
                        detailProduct.product.img4.includes("images")
                          ? `${SERVER_URL}/${detailProduct.product.img4}`
                          : detailProduct.product.img4
                      }`}
                      alt={detailProduct.product.name}
                      className="w-100 cursor-pointer my-2"
                      onClick={() => setShowImage(detailProduct.product.img4)}
                    />
                  )}
                </Col>
                <Col className="col-10 mb-4">
                  <img
                    src={`${
                      showImage.includes("images")
                        ? `${SERVER_URL}/${showImage}`
                        : showImage
                    }`}
                    alt={detailProduct.product.name}
                    className="w-100"
                  />
                </Col>
              </Row>
            </Col>
            <Col md={7} className="">
              <h1>{detailProduct.product.name}</h1>
              <p className="fs-4 my-4 text-secondary">
                {detailProduct.product.price
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                VND
              </p>
              <p
                className="mb-4 text-secondary"
                style={{ whiteSpace: "pre-line" }}
              >
                {detailProduct.product.short_desc}
              </p>
              <h5 className="mb-4">
                CATEGORY:{" "}
                <span className="fw-normal fs-6 text-secondary">
                  {detailProduct.product.category}
                </span>
              </h5>

              <div className="">
                <div className="d-inline-block border pb-1 mb-2">
                  <input
                    type="text"
                    placeholder="QUANTITY"
                    className="border-0 outline-0 ps-3"
                    style={{ width: "70%" }}
                  />
                  <div className="d-inline-block">
                    <button
                      type="button"
                      className="py-1 px-2 border-0 bg-transparent text-shadow-hover"
                      disabled={quantity <= 1}
                      onClick={() => setQuantity((prev) => prev - 1)}
                    >
                      <i className="fa fa-caret-left fw-bold"></i>
                    </button>
                    <p className="mb-0 py-1 px-2 d-inline-block fst-normal">
                      {detailProduct.product.remain > 0 ? quantity : 0}
                    </p>
                    <button
                      type="button"
                      className="py-1 px-2 border-0 bg-transparent text-shadow-hover"
                      disabled={
                        quantity >= detailProduct.product.remain ||
                        (prodInCart &&
                          prodInCart.quantity >=
                            detailProduct.product.remain) ||
                        (prodInCart &&
                          quantity >=
                            detailProduct.product.remain - prodInCart.quantity)
                      }
                      onClick={() => setQuantity((prev) => prev + 1)}
                    >
                      <i className="fa fa-caret-right fw-bold"></i>
                    </button>
                  </div>
                </div>
                <button
                  className="btn btn-dark rounded-0"
                  disabled={
                    prodInCart &&
                    prodInCart.quantity >= detailProduct.product.remain
                  }
                  onClick={() =>
                    isAuth
                      ? dispatch(postCart(params.productId, quantity))
                      : navigate("/login")
                  }
                >
                  Add to cart
                </button>
              </div>

              <div className="text-secondary fs-7 mt-2">
                ({detailProduct.product.remain} product
                {detailProduct.product.remain > 1 && "s"} available)
              </div>
            </Col>
          </Row>

          <Row>
            <Col lg={9} xs={12}>
              <button
                type="button"
                className="btn btn-dark rounded-0 w-fit px-3 py-2"
                onClick={() => setShowDesc(!showDesc)}
              >
                DESCRIPTION
              </button>
              {showDesc && (
                <>
                  <h5 className="my-3">PRODUCT DESCRIPTION</h5>
                  <p
                    className="text-secondary"
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {detailProduct.product.long_desc}
                  </p>
                </>
              )}
            </Col>
          </Row>

          {detailProduct.relatedProducts && (
            <Row className="my-5 related-products">
              {detailProduct.relatedProducts.length > 0 && (
                <h5>RELATED PRODUCTS</h5>
              )}
              {detailProduct.relatedProducts.length > 0 &&
                detailProduct.relatedProducts.map((prod) => (
                  <Col
                    xs={6}
                    sm={4}
                    md={3}
                    key={prod._id}
                    className="text-center mt-3"
                  >
                    <Link
                      to={`/detail/${prod._id}`}
                      className="text-decoration-none"
                    >
                      <img
                        src={`${
                          prod.img1.includes("images")
                            ? `${SERVER_URL}/${prod.img1}`
                            : prod.img1
                        }`}
                        alt={prod.name}
                        className="w-100 opacity-70-hover cursor-pointer mb-3"
                      />
                      <h6 className="text-dark">{prod.name}</h6>
                    </Link>
                    <p className="text-secondary">
                      {prod.price
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                      VND
                    </p>
                  </Col>
                ))}
            </Row>
          )}
        </>
      )}

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

export default Detail;
