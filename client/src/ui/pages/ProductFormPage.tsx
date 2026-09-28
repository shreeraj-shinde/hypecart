import { useEffect, useRef, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import { Spinner, UploadIcon } from "../components/Icons";

export const ProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mode: "create" | "edit" = id ? "edit" : "create";
  const {
    form,
    formErrors,
    formError,
    formSaving,
    setField,
    openCreateForm,
    openEditForm,
    selectProduct,
    saveForm,
    selected,
    categories,
    uploadImage,
    imageUploading,
    imageUploadError,
  } = useProducts();

  useEffect(() => {
    if (mode === "edit" && id) {
      selectProduct(id);
      openEditForm();
    } else {
      openCreateForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, id]);

  const cancel = () => {
    if (mode === "edit" && selected) navigate(`/products/${selected._id}`);
    else navigate("/products");
  };

  const handleSave = async () => {
    const result = await saveForm(mode);
    if (result.ok) {
      navigate(result.id ? `/products/${result.id}` : "/products");
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadImage(file);
    e.target.value = "";
  };

  return (
    <div className="form-page">
      <button type="button" className="form-cancel" onClick={cancel}>
        ‹ Cancel
      </button>
      <div className="form-title">{mode === "create" ? "New product" : "Edit product"}</div>
      <div className="form-sub">
        {mode === "create"
          ? "Add the details buyers see on the listing page."
          : "Update the listing. Changes go live immediately."}
      </div>

      <div className="form-card">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <button
          type="button"
          className="form-drop"
          onClick={() => fileInputRef.current?.click()}
          disabled={imageUploading}
          style={form.imageUrl ? { backgroundImage: `url(${form.imageUrl})` } : undefined}
        >
          {imageUploading ? (
            <>
              <Spinner stroke="#78726a" />
              <span className="mono" style={{ fontSize: 11.5, color: "#78726a" }}>
                uploading…
              </span>
            </>
          ) : form.imageUrl ? (
            <span className="mono form-drop-replace">change product shot</span>
          ) : (
            <>
              <UploadIcon />
              <span className="mono" style={{ fontSize: 11.5, color: "#78726a" }}>
                drop product shot
              </span>
            </>
          )}
        </button>
        {imageUploadError && <span className="field-error">{imageUploadError}</span>}

        <label className="field">
          <span className="field-label">Name</span>
          <input
            className="input input-panel"
            value={form.name}
            onChange={(e) => setField("name")(e.target.value)}
            placeholder="Speckled dinner plate"
          />
          {formErrors.name && <span className="field-error">{formErrors.name}</span>}
        </label>

        <div className="form-row">
          <label className="field">
            <span className="field-label">Price (USD)</span>
            <input
              className="input input-panel"
              value={form.price}
              onChange={(e) => setField("price")(e.target.value)}
              placeholder="48"
            />
            {formErrors.price && <span className="field-error">{formErrors.price}</span>}
          </label>
          <label className="field">
            <span className="field-label">Stock</span>
            <input
              className="input input-panel"
              value={form.stock}
              onChange={(e) => setField("stock")(e.target.value)}
              placeholder="12"
            />
          </label>
          <label className="field">
            <span className="field-label">Category</span>
            <select
              className="input input-panel"
              value={form.category}
              onChange={(e) => setField("category")(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="field">
          <span className="field-label">Description</span>
          <textarea
            className="input input-panel"
            rows={4}
            value={form.desc}
            onChange={(e) => setField("desc")(e.target.value)}
            placeholder="Wheel-thrown stoneware, glazed in a matte oatmeal."
          />
        </label>
      </div>

      {formError && <div className="auth-error">{formError}</div>}

      <div className="form-actions">
        <button type="button" className="btn btn-primary" onClick={handleSave} disabled={formSaving}>
          {formSaving ? (
            <span className="btn-loading">
              <Spinner />
              Saving
            </span>
          ) : mode === "create" ? (
            "Publish product"
          ) : (
            "Save changes"
          )}
        </button>
        <button type="button" className="btn btn-outline" onClick={cancel} disabled={formSaving}>
          Cancel
        </button>
      </div>
    </div>
  );
};
