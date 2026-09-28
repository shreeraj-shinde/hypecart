import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import {
  CATEGORIES,
  TINTS,
  clearToast,
  closeConfirm,
  createProductThunk,
  deleteProductThunk,
  openConfirm,
  openCreateForm,
  openEditForm,
  selectProduct,
  setFilter,
  setFormErrors,
  setQuery,
  updateFormField,
  updateProductThunk,
  uploadProductImageThunk,
  validateForm,
  type ProductForm,
} from "../state/productsSlice";

const money = (n: number) => `$${Number(n || 0).toLocaleString("en-US")}`;

const tintFor = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return TINTS[hash % TINTS.length];
};

export const useProducts = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((s) => s.products);

  const visible = useMemo(() => {
    const q = state.query.trim().toLowerCase();
    return state.products
      .filter((p) => state.filter === "All" || p.category === state.filter)
      .filter(
        (p) =>
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      )
      .map((p) => ({
        ...p,
        tint: tintFor(p._id),
        priceLabel: money(p.price),
        stockLabel:
          p.stock === 0
            ? "Sold out"
            : p.stock <= 5
              ? `${p.stock} left`
              : `${p.stock} in stock`,
        stockColor: p.stock === 0 ? "#a33a2a" : p.stock <= 5 ? "#8a6a1f" : "#5c7a66",
      }));
  }, [state.products, state.query, state.filter]);

  const filters = useMemo(
    () => ["All", ...CATEGORIES].map((label) => ({ label, active: state.filter === label })),
    [state.filter],
  );

  const selected = useMemo(
    () => state.products.find((p) => p._id === state.selectedId) ?? null,
    [state.products, state.selectedId],
  );

  const countLabel = `${state.products.length}${state.products.length === 1 ? " product" : " products"} · ${state.products.filter((p) => p.stock === 0).length} sold out`;

  const setField = useCallback(
    (field: keyof ProductForm) => (value: string) =>
      dispatch(updateFormField({ field, value })),
    [dispatch],
  );

  const saveForm = useCallback(
    async (mode: "create" | "edit"): Promise<{ ok: boolean; id: string | null }> => {
      const errors = validateForm(state.form);
      if (Object.keys(errors).length) {
        dispatch(setFormErrors(errors));
        return { ok: false, id: null };
      }

      if (mode === "create") {
        const action = await dispatch(createProductThunk(state.form));
        if (createProductThunk.fulfilled.match(action)) {
          return { ok: true, id: action.payload._id };
        }
        return { ok: false, id: null };
      }

      if (!state.selectedId) return { ok: false, id: null };
      const action = await dispatch(
        updateProductThunk({ id: state.selectedId, form: state.form }),
      );
      if (updateProductThunk.fulfilled.match(action)) {
        return { ok: true, id: action.payload._id };
      }
      return { ok: false, id: null };
    },
    [dispatch, state.form, state.selectedId],
  );

  const deleteSelected = useCallback(async (): Promise<boolean> => {
    if (!state.selectedId) return false;
    const action = await dispatch(deleteProductThunk(state.selectedId));
    return deleteProductThunk.fulfilled.match(action);
  }, [dispatch, state.selectedId]);

  const uploadImage = useCallback(
    (file: File) => dispatch(uploadProductImageThunk(file)),
    [dispatch],
  );

  return {
    products: state.products,
    loading: state.status === "loading" && !state.loaded,
    visible,
    isEmpty: state.loaded && visible.length === 0,
    filters,
    query: state.query,
    setQuery: (value: string) => dispatch(setQuery(value)),
    setFilter: (label: string) => dispatch(setFilter(label)),

    selected,
    detail: selected
      ? {
          name: selected.name,
          price: money(selected.price),
          category: selected.category,
          stock: selected.stock === 0 ? "Sold out" : `${selected.stock} in stock`,
          sku: selected.sku,
          desc: selected.description,
          tint: tintFor(selected._id),
          imageUrl: selected.imageUrl,
        }
      : null,
    selectProduct: (id: string | null) => dispatch(selectProduct(id)),

    countLabel,
    categories: CATEGORIES,

    form: state.form,
    formErrors: state.formErrors,
    formError: state.formError,
    formSaving: state.formStatus === "saving",
    setField,
    openCreateForm: () => dispatch(openCreateForm()),
    openEditForm: () => dispatch(openEditForm()),
    saveForm,
    uploadImage,
    imageUploading: state.imageUploadStatus === "uploading",
    imageUploadError: state.imageUploadError,

    confirmOpen: state.confirmOpen,
    deleting: state.deleteStatus === "deleting",
    openConfirm: () => dispatch(openConfirm()),
    closeConfirm: () => dispatch(closeConfirm()),
    deleteSelected,

    toast: state.toast,
    clearToast: () => dispatch(clearToast()),
  };
};
