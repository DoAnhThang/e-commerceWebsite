import SideBar from "./SideBar";

function Wrapper({ children, isAuth, setIsAuth }) {
  return (
    <div className="container-fluid">
      <div className="row border-bottom bg-light">
        <h6 className="col-md-2 col-3 text-secondary fw-bold text-center py-3 mb-0">
          Admin Page
        </h6>
        <div className="col-md-10 col-9 border-start"></div>
      </div>

      <div className="row" style={{ height: "94vh" }}>
        <div className="col-md-2 col-3 px-3 py-4">
          <SideBar isAuth={isAuth} setIsAuth={(value) => setIsAuth(value)} />
        </div>
        <div className="col-md-10 col-9 border-start bg-light text-secondary p-3">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Wrapper;
