import { useState, useEffect } from "react";
import { SERVER_URL } from "../data/api";
import InforOrder from "../components/InforOrder";

function Dashboard({ role }) {
  const [dashboard, setDashboard] = useState({});
  const [lastestOrders, setLastestOrders] = useState(null);
  const [errorMsg, setErrorMsg] = useState({});
  const [viewOrder, setViewOrder] = useState({ isView: false, order: {} });

  // get dashboard
  const getDashboard = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/admin/dashboard`, {
        credentials: "include",
      });
      const data = await res.json();
      // console.log("getDashboard: ", data);
      if (data.errorMsg)
        setErrorMsg((prev) => ({ ...prev, errorMsg: data.errorMg }));
      else {
        setDashboard(data.dashboard);
        setLastestOrders(data.lastestOrders);
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    getDashboard();
  }, []);

  if (role !== "admin") {
    return <h1 className="text-center my-5">Unauthorized!</h1>;
  }

  if (errorMsg.errorMsg) {
    return <h1 className="text-center my-5">{errorMsg.errorMsg}</h1>;
  }

  return (
    <>
      <h4 className="text-dark fw-bold mb-4">Dashboard</h4>

      <div className="d-flex justify-content-between flex-wrap gap-3 mb-3">
        <div className="d-inline-block" style={{ flex: 1 }}>
          <div className="bg-white shadow-sm d-flex justify-content-between align-items-center gap-3 w-100 p-3">
            <div>
              <h2 className="text-dark fw-semibold mb-0">
                {dashboard.clients || 0}
              </h2>
              <p className="text-secondary fw-semibold mb-0">Clients</p>
            </div>
            <i className="fa-solid fa-user-plus fs-4"></i>
          </div>
        </div>

        <div className="d-inline-block" style={{ flex: 1 }}>
          <div className="bg-white shadow-sm d-flex justify-content-between align-items-center gap-3 w-100 p-3">
            <div>
              <h2 className="text-dark fw-semibold mb-0">
                44.779.000<span className="fs-5 align-top ms-1">VND</span>
              </h2>
              <p className="text-secondary fw-semibold mb-0">
                Earnings of Month
              </p>
            </div>
            <i className="fa-solid fa-dollar-sign fs-4"></i>
          </div>
        </div>

        <div className="d-inline-block" style={{ flex: 1 }}>
          <div className="bg-white shadow-sm d-flex justify-content-between align-items-center gap-3 w-100 p-3">
            <div>
              <h2 className="text-dark fw-semibold mb-0">
                {dashboard.clientOrders || 0}
              </h2>
              <p className="text-secondary fw-semibold mb-0">Orders</p>
            </div>
            <i className="fa-solid fa-file-medical fs-4"></i>
          </div>
        </div>
      </div>

      {lastestOrders ? (
        <div className="table-responsive bg-white shadow-sm p-3">
          <h5 className="text-dark fw-semibold mb-4">History</h5>

          <table className="table table-bordered table-striped align-middle mb-0">
            <thead>
              <tr className="fw-semibold">
                <td>ID User</td>
                <td>Name</td>
                <td>Phone</td>
                <td>Address</td>
                <td>Total</td>
                <td>Delivery</td>
                <td>Status</td>
                <td>Detail</td>
              </tr>
            </thead>
            <tbody>
              {lastestOrders &&
                lastestOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="text-break" style={{ minWidth: "65px" }}>
                      {order.userId._id}
                    </td>
                    <td>{order.receiver.fullName}</td>
                    <td className="text-break">{order.receiver.phoneNumber}</td>
                    <td className="text-break">{order.receiver.address}</td>
                    <td>
                      {order.totalAmount
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                      VND
                    </td>
                    <td>
                      {order.delivery === "Waiting for progressing"
                        ? "Chưa Vận Chuyển"
                        : order.delivery}
                    </td>
                    <td>
                      {order.status === "Waiting for pay"
                        ? "Chưa Thanh Toán"
                        : order.status}
                    </td>
                    <td>
                      <button
                        className="btn btn-success rounded-0"
                        onClick={() =>
                          setViewOrder({ isView: true, order: order })
                        }
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <div className="border-start border-end py-4"></div>
          <div className="text-end fs-7 border pt-2">
            {lastestOrders && lastestOrders.length > 0 && (
              <p className="d-inline mb-0 me-3">
                Showing 1 → {lastestOrders.length} of {lastestOrders.length}{" "}
                order{lastestOrders.length > 1 && "s"}
              </p>
            )}
            <div>
              <button className="btn border-0 fs-7 p-0 mx-3 my-2" disabled>
                <i className="fa fa-angle-left text-secondary"></i>
              </button>
              <button className="btn border-0 fs-7 p-0 mx-3 my-2" disabled>
                <i className="fa fa-angle-right text-secondary"></i>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="spinner"></div>
      )}

      {viewOrder.isView && (
        <InforOrder
          order={viewOrder.order}
          setViewOrder={(val) => setViewOrder(val)}
        />
      )}
    </>
  );
}

export default Dashboard;
