import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../store/ui-slice";
import { SERVER_URL } from "../data/api";

function InforOrder({ orders }) {
  const dispatch = useDispatch();
  const showId = useSelector((state) => state.ui.clickedId);
  const order = orders.find((ord) => ord._id === showId);

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

      {ReactDOM.createPortal(
        <div
          className="bg-white position-fixed start-50 cg-1 p-4 infor-order"
          style={{
            top: "5rem",
            bottom: "5rem",
            transform: "translate(-50%, 0)",
            zIndex: 200,
            width: "75%",
            overflowY: "auto",
          }}
        >
          <div
            className="position-fixed"
            style={{ right: "1.5rem" }}
            onClick={turnOffPopupHandler}
          >
            <i className="fa-solid fa-xmark fs-4 text-secondary text-shadow-hover cursor-pointer"></i>
          </div>

          <div className="text-secondary fs-7 mb-5 mt-4">
            <h3 className="text-dark">INFORMATION ORDER</h3>
            <p className="mb-1">ID User: {order.userId}</p>
            <p className="mb-1">Full Name: {order.receiver.fullName}</p>
            <p className="mb-1">Phone: {order.receiver.phoneNumber}</p>
            <p className="mb-1">Address: {order.receiver.address}</p>
            <p className="mb-1">
              Total:{" "}
              {order.totalAmount
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
              VND
            </p>
          </div>

          <div className="table-responsive">
            <table className="table table-borderless table-hover align-middle text-center">
              <thead>
                <tr className="bg-light fw-semibold">
                  <td>ID PRODUCT</td>
                  <td className="w-25">IMAGE</td>
                  <td>NAME</td>
                  <td>PRICE</td>
                  <td>COUNT</td>
                </tr>
              </thead>
              <tbody>
                {order.products.map((prod) => (
                  <tr className="text-secondary" key={prod.product._id}>
                    <td className="text-break">{prod.product._id}</td>
                    <td>
                      <img
                        src={`${
                          prod.product.img1.includes("images")
                            ? `${SERVER_URL}/${prod.product.img1}`
                            : prod.product.img1
                        }`}
                        alt={prod.product.name}
                        className="w-50"
                      />
                    </td>
                    <td>{prod.product.name}</td>
                    <td>
                      {prod.product.price
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                      VND
                    </td>
                    <td>{prod.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>,
        document.getElementById("overlay-root")
      )}
    </>
  );
}

export default InforOrder;
