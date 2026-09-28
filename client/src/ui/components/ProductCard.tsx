import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  tint: string;
  imageUrl?: string;
  priceLabel: string;
  stockLabel: string;
  stockColor: string;
}

export const ProductCard = (product: ProductCardProps) => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className="product-card"
      onClick={() => navigate(`/products/${product.id}`)}
    >
      <div className="product-thumb" style={{ backgroundColor: product.tint }}>
        {product.imageUrl ? (
          <img className="product-thumb-img" src={product.imageUrl} alt={product.name} />
        ) : (
          <span className="thumb-tag">product shot</span>
        )}
      </div>
      <div className="product-info">
        <div className="product-info-top">
          <div className="product-name">{product.name}</div>
          <div className="product-price">{product.priceLabel}</div>
        </div>
        <div className="product-category">{product.category}</div>
        <div className="product-stock mono" style={{ color: product.stockColor }}>
          {product.stockLabel}
        </div>
      </div>
    </button>
  );
};
