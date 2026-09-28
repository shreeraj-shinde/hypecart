import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import { ConfirmDialog } from "../components/ConfirmDialog";

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    selected,
    detail,
    selectProduct,
    confirmOpen,
    openConfirm,
    closeConfirm,
    deleteSelected,
    deleting,
  } = useProducts();

  useEffect(() => {
    selectProduct(id ?? null);
    return () => {
      selectProduct(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!selected || !detail) {
    return (
      <div>
        <button type="button" className="detail-back" onClick={() => navigate("/products")}>
          ‹ All products
        </button>
        <div className="empty-state">
          <div className="empty-title">Product not found</div>
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    const ok = await deleteSelected();
    if (ok) navigate("/products", { replace: true });
  };

  return (
    <div>
      <button type="button" className="detail-back" onClick={() => navigate("/products")}>
        ‹ All products
      </button>

      <div className="detail-layout">
        <div className="detail-image-col">
          <div className="detail-image" style={{ backgroundColor: detail.tint }}>
            {detail.imageUrl ? (
              <img className="detail-image-img" src={detail.imageUrl} alt={detail.name} />
            ) : (
              <span className="thumb-tag">product shot</span>
            )}
          </div>
        </div>
        <div className="detail-col">
          <div className="detail-name">{detail.name}</div>
          <div className="detail-price">{detail.price}</div>
          <div className="detail-tags">
            <span className="tag">{detail.category}</span>
            <span className="tag">{detail.stock}</span>
            <span className="tag mono">{detail.sku}</span>
          </div>
          <div className="detail-desc">{detail.desc}</div>
          <div className="detail-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate(`/products/${selected._id}/edit`)}
            >
              Edit product
            </button>
            <button type="button" className="btn btn-danger-outline" onClick={openConfirm}>
              Delete
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this product?"
        body={`"${selected.name}" will be removed from your catalogue. This can't be undone.`}
        confirmLabel={deleting ? "Deleting…" : "Delete"}
        busy={deleting}
        onCancel={closeConfirm}
        onConfirm={handleDelete}
      />
    </div>
  );
};
