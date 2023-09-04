import { NavLink, useNavigate } from "react-router-dom";
import { SERVER_URL } from "../data/api";

function SideBar({ isAuth, setIsAuth }) {
  const navigate = useNavigate();

  // post logout
  const postLogout = async () => {
    try {
      await fetch(`${SERVER_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      setIsAuth({ isAuth: false, user: {} });
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ul className="list-unstyled">
      {isAuth ? (
        <>
          <li className="mb-3">
            <NavLink
              to="/"
              className={(nav) =>
                nav.isActive
                  ? "text-warning fw-bold text-decoration-none"
                  : "text-decoration-none text-warning-hover"
              }
            >
              <i className="fa-solid fa-table-columns me-2"></i>Dashboard
            </NavLink>
          </li>
          <li className="mb-3">
            <NavLink
              to="/products"
              className={(nav) =>
                nav.isActive
                  ? "text-warning fw-bold text-decoration-none"
                  : "text-decoration-none text-warning-hover"
              }
            >
              <i className="fa-solid fa-list me-2"></i>Products List
            </NavLink>
          </li>
          <li className="mb-3">
            <NavLink
              to="/add-product"
              className={(nav) =>
                nav.isActive
                  ? "text-warning fw-bold text-decoration-none"
                  : "text-decoration-none text-warning-hover"
              }
            >
              <i className="fa-solid fa-file-circle-plus me-2"></i>Add Product
            </NavLink>
          </li>
          <li className="mb-3">
            <NavLink
              to="/chat"
              className={(nav) =>
                nav.isActive
                  ? "text-warning fw-bold text-decoration-none"
                  : "text-decoration-none text-warning-hover"
              }
            >
              <i className="fa-solid fa-comments me-2"></i>Customer Support
            </NavLink>
          </li>
          <li className="mb-3">
            <button
              className="border-0 bg-white text-primary text-start text-warning-hover cursor-pointer p-0"
              onClick={() => postLogout()}
            >
              <i className="fa-solid fa-right-from-bracket me-3"></i>Log out
            </button>
          </li>
        </>
      ) : (
        <>
          <li className="mb-4">
            <NavLink
              to="/"
              className={(nav) =>
                nav.isActive
                  ? "text-warning fw-bold text-decoration-none"
                  : "text-decoration-none text-warning-hover"
              }
            >
              <i className="fa-solid fa-right-to-bracket me-2"></i>Log in
            </NavLink>
          </li>
          <li className="mb-4">
            <NavLink
              to="/signup"
              className={(nav) =>
                nav.isActive
                  ? "text-warning fw-bold text-decoration-none"
                  : "text-decoration-none text-warning-hover"
              }
            >
              <i className="fa-solid fa-user-plus me-2"></i>Sign up
            </NavLink>
          </li>
        </>
      )}
    </ul>
  );
}

export default SideBar;
