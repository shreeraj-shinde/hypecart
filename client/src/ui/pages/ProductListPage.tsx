import { useNavigate } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import { ProductCard } from "../components/ProductCard";
import { CrateIcon, SearchIcon } from "../components/Icons";

export const ProductListPage = () => {
  const navigate = useNavigate();
  const { visible, filters, query, setQuery, setFilter, isEmpty, countLabel } =
    useProducts();

  return (
    <div>
      <div className="list-header">
        <div>
          <div className="list-title">Products</div>
          <div className="list-count mono">{countLabel}</div>
        </div>
        <button type="button" className="btn btn-primary btn-pill" onClick={() => navigate("/products/new")}>
          New product
        </button>
      </div>

      <div className="toolbar">
        <div className="search">
          <SearchIcon />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or category"
          />
        </div>
        <div className="chips">
          {filters.map((f) => (
            <button
              key={f.label}
              type="button"
              className="chip"
              data-active={f.active}
              onClick={() => setFilter(f.label)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="product-grid">
        {visible.map((p) => (
          <ProductCard
            key={p._id}
            id={p._id}
            name={p.name}
            category={p.category}
            tint={p.tint}
            imageUrl={p.imageUrl}
            priceLabel={p.priceLabel}
            stockLabel={p.stockLabel}
            stockColor={p.stockColor}
          />
        ))}
      </div>

      {isEmpty && (
        <div className="empty-state">
          <div className="empty-icon">
            <CrateIcon />
          </div>
          <div className="empty-title">
            {query || filters.find((f) => f.active)?.label !== "All"
              ? "Nothing matches that"
              : "Your catalogue is empty"}
          </div>
          <div className="empty-body">
            {query || filters.find((f) => f.active)?.label !== "All"
              ? "Try a different search term or clear the category filter."
              : "Add your first piece and it will show up here."}
          </div>
          <button type="button" className="btn btn-outline btn-pill" onClick={() => navigate("/products/new")}>
            Add a product
          </button>
        </div>
      )}
    </div>
  );
};
