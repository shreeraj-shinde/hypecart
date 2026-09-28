import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { resetProductsCache } from "../../state/bootstrap";
import { CartMark } from "./Logo";
import { Toast } from "./Toast";

export const AppShell = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSignOut = async () => {
    await logout();
    resetProductsCache();
    navigate("/login", { replace: true });
  };

  return (
    <div className="app-shell">
      <div className="app-header">
        <div className="app-header-inner">
          <button type="button" className="app-logo" onClick={() => navigate("/products")}>
            <div className="brand-logo brand-logo-dark">
              <CartMark stroke="#efe4cf" />
            </div>
            <div className="brand-name">HypeCart</div>
          </button>
          <div className="app-user-email mono">{user?.email ?? ""}</div>
          <button type="button" className="btn btn-outline btn-pill" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </div>

      <div className="app-main">
        <Outlet />
      </div>
      <Toast />
    </div>
  );
};
