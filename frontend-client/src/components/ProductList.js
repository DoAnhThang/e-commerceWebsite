import { useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { uiActions } from "../store/ui-slice";
import { SERVER_URL } from "../data/api";

function ProductList() {
  const listRef = useRef();
  const dispatch = useDispatch();
  // take data from Redux store
  const products = useSelector((state) => state.ui.products);
  const showedCategory = useSelector((state) => state.ui.clickedCategory);

  // filter products will be displayed
  let filteredProducts = [];
  if (showedCategory === "") {
    filteredProducts = products;
  } else {
    filteredProducts = products.filter(
      (prod) => prod.category === showedCategory
    );
  }

  return (
    <Container className="mt-5">
      <Row>
        {/* display navbar categories */}
        <Col md={3} className="ps-0 pe-5 mb-4">
          <h4 className="mb-3">CATEGORIES</h4>
          <h5 className="ps-3 text-white mb-3 bg-dark py-2">APPLE</h5>
          <h6
            className={`cursor-pointer ps-3 mb-3 ${
              showedCategory === ""
                ? "text-warning"
                : "text-secondary text-warning-hover"
            }`}
            onClick={() => {
              dispatch(uiActions.category(""));
              listRef.current.scrollIntoView({ behavior: "smooth" });
            }}
          >
            All
          </h6>

          <h5 className="ps-3 mb-3 bg-light py-2">IPHONE & MAC</h5>
          <h6
            className={`cursor-pointer ps-3 mb-3 ${
              showedCategory === "iphone"
                ? "text-warning"
                : "text-secondary text-warning-hover"
            }`}
            onClick={() => {
              dispatch(uiActions.category("iphone"));
              listRef.current.scrollIntoView({ behavior: "smooth" });
            }}
          >
            iPhone
          </h6>
          <h6
            className={`cursor-pointer ps-3 mb-3 ${
              showedCategory === "ipad"
                ? "text-warning"
                : "text-secondary text-warning-hover"
            }`}
            onClick={() => {
              dispatch(uiActions.category("ipad"));
              listRef.current.scrollIntoView({ behavior: "smooth" });
            }}
          >
            iPad
          </h6>
          <h6
            className={`cursor-pointer ps-3 mb-3 ${
              showedCategory === "macbook"
                ? "text-warning"
                : "text-secondary text-warning-hover"
            }`}
            onClick={() => {
              dispatch(uiActions.category("macbook"));
              listRef.current.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Macbook
          </h6>

          <h5 className="ps-3 mb-3 bg-light py-2">WIRELESS</h5>
          <h6
            className={`cursor-pointer ps-3 mb-3 ${
              showedCategory === "airpod"
                ? "text-warning"
                : "text-secondary text-warning-hover"
            }`}
            onClick={() => {
              dispatch(uiActions.category("airpod"));
              listRef.current.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Airpod
          </h6>
          <h6
            className={`cursor-pointer ps-3 mb-3 ${
              showedCategory === "watch"
                ? "text-warning"
                : "text-secondary text-warning-hover"
            }`}
            onClick={() => {
              dispatch(uiActions.category("watch"));
              listRef.current.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Watch
          </h6>

          <h5 className="ps-3 mb-3 bg-light py-2">OTHER</h5>
          <h6
            className={`cursor-pointer ps-3 mb-3 ${
              showedCategory === "mouse"
                ? "text-warning"
                : "text-secondary text-warning-hover"
            }`}
            onClick={() => {
              dispatch(uiActions.category("mouse"));
              listRef.current.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Mouse
          </h6>
          <h6
            className={`cursor-pointer ps-3 mb-3 ${
              showedCategory === "keyboard"
                ? "text-warning"
                : "text-secondary text-warning-hover"
            }`}
            onClick={() => {
              dispatch(uiActions.category("keyboard"));
              listRef.current.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Keyboard
          </h6>
          <h6
            className={`cursor-pointer ps-3 mb-3 ${
              showedCategory === "other"
                ? "text-warning"
                : "text-secondary text-warning-hover"
            }`}
            onClick={() => {
              dispatch(uiActions.category("other"));
              listRef.current.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Other
          </h6>
        </Col>

        {/* display product list based on category */}
        <Col md={9} ref={listRef} className="pe-0">
          <Row className="justify-content-between">
            <Col className="px-0 mb-4">
              <input
                type="text"
                placeholder="Enter Search Here!"
                className="fst-normal p-2 ms-3"
              />
            </Col>
            <Col className="d-flex justify-content-end align-items-center mb-4">
              <select
                name="categories"
                value={showedCategory}
                className="fst-normal p-2"
                onChange={(e) => dispatch(uiActions.category(e.target.value))}
              >
                <option value="">Default sorting</option>
                <option value="iphone">iPhone</option>
                <option value="ipad">iPad</option>
                <option value="macbook">Macbook</option>
                <option value="airpod">Airpod</option>
                <option value="watch">Watch</option>
                <option value="mouse">Mouse</option>
                <option value="keyboard">Keyboard</option>
                <option value="other">Other</option>
              </select>
            </Col>
          </Row>

          {/* render filtered products based on category */}
          <div
            className="d-grid gap-3 text-center product--list"
            style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
          >
            {filteredProducts.map((prod) => (
              <div className="animation-zoom-1000" key={prod._id}>
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
                  {prod.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                  VND
                </p>
              </div>
            ))}
          </div>

          {filteredProducts.length > 0 && (
            <Row>
              <Col className="d-flex flex-column justify-content-center align-items-end">
                <div className="d-flex mb-2">
                  <button className="btn btn-outline-secondary rounded-0 py-1 px-2">
                    <i className="fa fa-angle-double-left"></i>
                  </button>
                  <span className="bg-dark text-white fw-bold py-1 px-3 mx-1">
                    1
                  </span>
                  <button className="btn btn-outline-secondary rounded-0 py-1 px-2">
                    <i className="fa fa-angle-double-right"></i>
                  </button>
                </div>
                <p className="text-secondary">
                  Showing 1 → {filteredProducts.length} of{" "}
                  {filteredProducts.length} product
                  {filteredProducts.length > 1 && "s"}
                </p>
              </Col>
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default ProductList;
