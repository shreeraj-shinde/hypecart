import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import * as productsApi from "../api/productsApi";
import type { Product, ProductInput } from "../api/productsApi";

export interface ProductForm {
  name: string;
  price: string;
  stock: string;
  category: string;
  desc: string;
  imageUrl: string;
}

export interface FormErrors {
  name?: string;
  price?: string;
}

export const TINTS = ["#e6dfd2", "#dcd6c7", "#dfe3d9", "#e9ded4", "#d8dbd2", "#eae1d6"];

export const CATEGORIES = ["Tableware", "Vases", "Drinkware", "Serveware", "Decor"];

const emptyForm = (): ProductForm => ({
  name: "",
  price: "",
  stock: "",
  category: CATEGORIES[0],
  desc: "",
  imageUrl: "",
});

export const validateForm = (form: ProductForm): FormErrors => {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = "Give the product a name.";
  if (form.price === "" || Number.isNaN(Number(form.price)) || Number(form.price) < 0) {
    errors.price = "Enter a price in numbers.";
  }
  return errors;
};

const toPayload = (form: ProductForm): ProductInput => ({
  name: form.name.trim(),
  category: form.category,
  price: Number(form.price),
  stock: form.stock === "" ? 0 : Math.max(0, parseInt(form.stock, 10) || 0),
  description: form.desc.trim(),
  ...(form.imageUrl ? { imageUrl: form.imageUrl } : {}),
});

const extractErrorMessage = (error: unknown): string => {
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    error.response &&
    typeof error.response === "object" &&
    "data" in error.response &&
    error.response.data &&
    typeof error.response.data === "object" &&
    "message" in error.response.data
  ) {
    return String((error.response.data as { message: unknown }).message);
  }
  return "Something went wrong. Please try again.";
};

interface ProductsState {
  products: Product[];
  status: "idle" | "loading" | "error";
  loaded: boolean;
  query: string;
  filter: string;
  selectedId: string | null;
  form: ProductForm;
  formErrors: FormErrors;
  formStatus: "idle" | "saving" | "error";
  formError: string | null;
  confirmOpen: boolean;
  deleteStatus: "idle" | "deleting";
  imageUploadStatus: "idle" | "uploading" | "error";
  imageUploadError: string | null;
  toast: string;
}

const initialState: ProductsState = {
  products: [],
  status: "idle",
  loaded: false,
  query: "",
  filter: "All",
  selectedId: null,
  form: emptyForm(),
  formErrors: {},
  formStatus: "idle",
  formError: null,
  confirmOpen: false,
  deleteStatus: "idle",
  imageUploadStatus: "idle",
  imageUploadError: null,
  toast: "",
};

export const fetchProductsThunk = createAsyncThunk(
  "products/fetch",
  async (_: void, { rejectWithValue }) => {
    try {
      return await productsApi.list();
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

export const createProductThunk = createAsyncThunk(
  "products/create",
  async (form: ProductForm, { rejectWithValue }) => {
    try {
      return await productsApi.create(toPayload(form));
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

export const updateProductThunk = createAsyncThunk(
  "products/update",
  async (
    { id, form }: { id: string; form: ProductForm },
    { rejectWithValue },
  ) => {
    try {
      return await productsApi.update(id, toPayload(form));
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

export const uploadProductImageThunk = createAsyncThunk(
  "products/uploadImage",
  async (file: File, { rejectWithValue }) => {
    try {
      return await productsApi.uploadImage(file);
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

export const deleteProductThunk = createAsyncThunk(
  "products/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await productsApi.remove(id);
      return id;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setFilter: (state, action: PayloadAction<string>) => {
      state.filter = action.payload;
    },
    selectProduct: (state, action: PayloadAction<string | null>) => {
      state.selectedId = action.payload;
    },
    openCreateForm: (state) => {
      state.form = emptyForm();
      state.formErrors = {};
      state.formError = null;
    },
    openEditForm: (state) => {
      const product = state.products.find((p) => p._id === state.selectedId);
      state.form = product
        ? {
            name: product.name,
            price: String(product.price),
            stock: String(product.stock),
            category: product.category,
            desc: product.description,
            imageUrl: product.imageUrl ?? "",
          }
        : emptyForm();
      state.formErrors = {};
      state.formError = null;
    },
    updateFormField: (
      state,
      action: PayloadAction<{ field: keyof ProductForm; value: string }>,
    ) => {
      state.form[action.payload.field] = action.payload.value;
      state.formErrors = {};
    },
    setFormErrors: (state, action: PayloadAction<FormErrors>) => {
      state.formErrors = action.payload;
    },
    openConfirm: (state) => {
      state.confirmOpen = true;
    },
    closeConfirm: (state) => {
      state.confirmOpen = false;
    },
    showToast: (state, action: PayloadAction<string>) => {
      state.toast = action.payload;
    },
    clearToast: (state) => {
      state.toast = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductsThunk.fulfilled, (state, action) => {
        state.status = "idle";
        state.loaded = true;
        state.products = action.payload;
      })
      .addCase(fetchProductsThunk.rejected, (state) => {
        state.status = "error";
        state.loaded = true;
      })
      .addCase(createProductThunk.pending, (state) => {
        state.formStatus = "saving";
        state.formError = null;
      })
      .addCase(createProductThunk.fulfilled, (state, action) => {
        state.formStatus = "idle";
        state.products.unshift(action.payload);
        state.selectedId = action.payload._id;
        state.toast = "Product added";
      })
      .addCase(createProductThunk.rejected, (state, action) => {
        state.formStatus = "error";
        state.formError = action.payload as string;
      })
      .addCase(updateProductThunk.pending, (state) => {
        state.formStatus = "saving";
        state.formError = null;
      })
      .addCase(updateProductThunk.fulfilled, (state, action) => {
        state.formStatus = "idle";
        state.products = state.products.map((p) =>
          p._id === action.payload._id ? action.payload : p,
        );
        state.toast = "Changes saved";
      })
      .addCase(updateProductThunk.rejected, (state, action) => {
        state.formStatus = "error";
        state.formError = action.payload as string;
      })
      .addCase(deleteProductThunk.pending, (state) => {
        state.deleteStatus = "deleting";
      })
      .addCase(deleteProductThunk.fulfilled, (state, action) => {
        state.deleteStatus = "idle";
        state.products = state.products.filter((p) => p._id !== action.payload);
        state.confirmOpen = false;
        state.selectedId = null;
        state.toast = "Product deleted";
      })
      .addCase(deleteProductThunk.rejected, (state) => {
        state.deleteStatus = "idle";
        state.confirmOpen = false;
      })
      .addCase(uploadProductImageThunk.pending, (state) => {
        state.imageUploadStatus = "uploading";
        state.imageUploadError = null;
      })
      .addCase(uploadProductImageThunk.fulfilled, (state, action) => {
        state.imageUploadStatus = "idle";
        state.form.imageUrl = action.payload.url;
      })
      .addCase(uploadProductImageThunk.rejected, (state, action) => {
        state.imageUploadStatus = "error";
        state.imageUploadError = action.payload as string;
      });
  },
});

export const {
  setQuery,
  setFilter,
  selectProduct,
  openCreateForm,
  openEditForm,
  updateFormField,
  setFormErrors,
  openConfirm,
  closeConfirm,
  showToast,
  clearToast,
} = productsSlice.actions;

export default productsSlice.reducer;
