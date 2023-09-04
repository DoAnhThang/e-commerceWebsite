/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import InforOrder from "../components/InforOrder";

import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../store/ui-slice";
import { SERVER_URL } from "../data/api";

function History() {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState(null);

  const showPopup = useSelector((state) => state.ui.popupIsVisible);

  const getOrders = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/shop/orders`, {
        credentials: "include",
      });
      const data = await res.json();
      // console.log("getOrders: ", data);
      if (data.expired) {
        dispatch(uiActions.status({ isAuth: false, user: {} }));
        return console.log(data.errorMsg);
      }
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    getOrders();
  }, []);

  return (
    <div className="container">
      <div className="bg-light d-flex justify-content-between align-items-center p-5">
        <h3 className="mb-0">HISTORY</h3>
        <h6 className="text-secondary mb-0">HISTORY</h6>
      </div>

      {!orders ? (
        <div className="spinner"></div>
      ) : orders.length === 0 ? (
        <h1 className="text-center" style={{ margin: "10rem auto" }}>
          No orders found!
        </h1>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="table table-borderless table-hover align-middle text-center mt-5">
            <thead>
              <tr className="bg-light fw-semibold">
                <td>ID ORDER</td>
                <td style={{ minWidth: "60px" }}>ID USER</td>
                <td>NAME</td>
                <td>PHONE</td>
                <td>ADDRESS</td>
                <td>TOTAL</td>
                <td>DELIVERY</td>
                <td>STATUS</td>
                <td>DETAIL</td>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr className="text-secondary" key={order._id}>
                  <td className="text-break">{order._id}</td>
                  <td className="text-break">{order.userId}</td>
                  <td>{order.receiver.fullName}</td>
                  <td className="text-break">{order.receiver.phoneNumber}</td>
                  <td className="text-break">{order.receiver.address}</td>
                  <td>
                    {order.totalAmount
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                    VND
                  </td>
                  <td>{order.delivery}</td>
                  <td>{order.status}</td>
                  <td>
                    <button
                      className="btn btn-outline-secondary rounded-0"
                      onClick={() => {
                        dispatch(
                          uiActions.popup({
                            popupIsVisible: true,
                            clickedId: order._id,
                          })
                        );
                      }}
                    >
                      View <i className="fa-solid fa-arrow-right-long ms-1"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showPopup && <InforOrder orders={orders} />}
    </div>
  );
}

export default History;
