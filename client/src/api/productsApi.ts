import { axiosInstance } from "./axiosInstance";

export interface Product {
  _id: string;
  userId: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductResponse {
  success: boolean;
  message: string;
  data: Product;
}

interface ProductListResponse {
  success: boolean;
  message: string;
  data: Product[];
}

export interface ProductInput {
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  imageUrl?: string;
}

interface UploadResponse {
  success: boolean;
  message: string;
  data: { url: string; publicId: string };
}

export const list = async () => {
  const response = await axiosInstance.get<ProductListResponse>("/products");
  return response.data.data;
};

export const create = async (payload: ProductInput) => {
  const response = await axiosInstance.post<ProductResponse>(
    "/products",
    payload,
  );
  return response.data.data;
};

export const update = async (id: string, payload: Partial<ProductInput>) => {
  const response = await axiosInstance.patch<ProductResponse>(
    `/products/${id}`,
    payload,
  );
  return response.data.data;
};

export const remove = async (id: string) => {
  await axiosInstance.delete(`/products/${id}`);
};

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);
  const response = await axiosInstance.post<UploadResponse>(
    "/uploads/image",
    formData,
  );
  return response.data.data;
};
