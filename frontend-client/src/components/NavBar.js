import { Navbar } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../store/ui-slice";
import { SERVER_URL } from "../data/api";

function NavBar() {
  const navigate = useNavigate();
  // dispatch actions to Redux store
  const dispatch = useDispatch();

  // get login state from Redux
  const isAuth = useSelector((state) => state.ui.isAuth);
  const user = useSelector((state) => state.ui.user);
  const cart = useSelector((state) => state.ui.cart);

  // post logout
  const postLogout = async () => {
    try {
      await fetch(`${SERVER_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      navigate("/");
      dispatch(uiActions.status({ isAuth: false, user: {} }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Navbar className="container justify-content-between fw-semibold p-3">
      <NavLink
        to="/"
        className={(nav) =>
          nav.isActive
            ? "text-warning text-decoration-none navbar--item"
            : "text-dark text-decoration-none text-warning-hover navbar--item"
        }
      >
        <i className="fa-solid fa-house-chimney"></i>
        <span className="ms-1">Home</span>
      </NavLink>

      <NavLink
        to="/shop"
        className={(nav) =>
          nav.isActive
            ? "text-warning text-decoration-none navbar--item"
            : "text-dark text-decoration-none text-warning-hover navbar--item"
        }
        onClick={() => dispatch(uiActions.category(""))}
      >
        <i className="fa-brands fa-shopify"></i>
        <span className="ms-1">Shop</span>
      </NavLink>

      {isAuth && (
        <NavLink
          to="/history"
          className={(nav) =>
            nav.isActive
              ? "text-warning text-decoration-none navbar--item"
              : "text-dark text-decoration-none text-warning-hover navbar--item"
          }
        >
          <i className="fa-solid fa-clock-rotate-left"></i>
          <span className="ms-1">History</span>
        </NavLink>
      )}

      <NavLink className="text-dark text-decoration-none text-warning-hover fs-4 navbar--logo">
        BOUTIQUE
      </NavLink>

      {/* display log in / log out status */}
      {isAuth ? (
        <>
          <NavLink
            to="/cart"
            className={(nav) =>
              nav.isActive
                ? "text-warning text-decoration-none navbar--item"
                : "text-dark text-decoration-none text-warning-hover navbar--item"
            }
          >
            <i className="fa fa-shopping-cart pt-1"></i>
            <span className="mx-1">Cart</span>
            {cart.totalQuantity > 0 && (
              <span className="bg-warning text-white rounded-pill fst-normal px-2 cart--qty">
                {cart.totalQuantity}
              </span>
            )}
          </NavLink>

          <NavLink className="text-dark text-decoration-none text-warning-hover cursor-pointer navbar--item">
            <i className="fa fa-user pt-1" style={{ paddingBottom: "2px" }}></i>
            <span className="ms-1">{user.fullName} ▼</span>
          </NavLink>

          <h6
            className="text-warning-hover cursor-pointer mt-1 mb-0 navbar--item"
            onClick={() => postLogout()}
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            <span className="ms-1">Log out</span>
          </h6>
        </>
      ) : (
        <>
          <NavLink
            to="/signup"
            className={(nav) =>
              nav.isActive
                ? "text-warning text-decoration-none navbar--item"
                : "text-dark text-decoration-none text-warning-hover navbar--item"
            }
          >
            <i className="fa-solid fa-user-plus"></i>
            <span className="ms-1">Sign up</span>
          </NavLink>

          <NavLink
            to="/login"
            className={(nav) =>
              nav.isActive
                ? "text-warning text-decoration-none navbar--item"
                : "text-dark text-decoration-none text-warning-hover navbar--item"
            }
          >
            <i className="fa-solid fa-right-to-bracket"></i>
            <span className="ms-1">Log in</span>
          </NavLink>
        </>
      )}
    </Navbar>
  );
}

export default NavBar;
