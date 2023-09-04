import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../store/ui-slice";

function Popup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // take data from Redux store
  const products = useSelector((state) => state.ui.products);
  const showId = useSelector((state) => state.ui.clickedId);
  const product = products.find((prod) => prod._id === showId);

  const turnOffPopupHandler = () => {
    dispatch(
      uiActions.popup({
        popupIsVisible: false,
        clickedId: "",
      })
    );
  };

  return (
    <>
      {/* dislay the backdrop of the popup */}
      {ReactDOM.createPortal(
        <div
          className="container-fluid vh-100 position-fixed top-0 start-0"
          style={{
            zIndex: 100,
            background: "rgba(0, 0, 0, 0.75)",
          }}
          onClick={turnOffPopupHandler}
        />,
        document.getElementById("backdrop-root")
      )}

      {/* display the popup */}
      {ReactDOM.createPortal(
        <Row
          className="bg-white w-75 position-fixed justify-content-center top-50 start-50 p-4"
          style={{
            transform: "translate(-50%, -50%)",
            zIndex: 200,
          }}
        >
          <Col lg={6} className="align-self-center popup--img">
            <img src={product.img1} alt={product.name} className="w-100" />
          </Col>

          <Col lg={6} className="popup--text">
            <div
              className="position-fixed"
              style={{ right: "1.5rem" }}
              onClick={turnOffPopupHandler}
            >
              <i className="fa-solid fa-xmark fs-4 text-secondary text-shadow-hover cursor-pointer"></i>
            </div>
            <div className="mt-4">
              <h4>{product.name}</h4>
              <p className="text-secondary">
                {product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                VND
              </p>
              <p className="text-secondary" style={{ whiteSpace: "pre-line" }}>
                {product.short_desc}
              </p>
              <button
                className="btn btn-dark rounded-0 px-4"
                onClick={() => {
                  turnOffPopupHandler();
                  navigate(`detail/${product._id}`);
                }}
              >
                <i className="fa fa-shopping-cart pt-1"></i> View Detail
              </button>
            </div>
          </Col>
        </Row>,
        document.getElementById("overlay-root")
      )}
    </>
  );
}

export default Popup;
