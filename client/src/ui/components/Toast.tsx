import { useEffect } from "react";
import { useProducts } from "../../hooks/useProducts";

export const Toast = () => {
  const { toast, clearToast } = useProducts();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(clearToast, 2200);
    return () => clearTimeout(timer);
  }, [toast, clearToast]);

  if (!toast) return null;

  return <div className="toast">{toast}</div>;
};
