import { createBrowserRouter, redirect } from "react-router-dom";
import { store } from "./state/store";
import { ensureBootstrapped, ensureProductsLoaded } from "./state/bootstrap";
import { AppShell } from "./ui/components/AppShell";
import { AuthPage } from "./ui/pages/AuthPage";
import { ProductListPage } from "./ui/pages/ProductListPage";
import { ProductDetailPage } from "./ui/pages/ProductDetailPage";
import { ProductFormPage } from "./ui/pages/ProductFormPage";

const isAuthenticated = () => Boolean(store.getState().auth.accessToken);

const guestOnlyLoader = async () => {
  await ensureBootstrapped();
  if (isAuthenticated()) return redirect("/products");
  return null;
};

const protectedLoader = async () => {
  await ensureBootstrapped();
  if (!isAuthenticated()) return redirect("/login");
  await ensureProductsLoaded();
  return null;
};

export const router = createBrowserRouter([
  {
    path: "/",
    loader: async () => {
      await ensureBootstrapped();
      return redirect(isAuthenticated() ? "/products" : "/login");
    },
  },
  {
    path: "/login",
    element: <AuthPage />,
    loader: guestOnlyLoader,
  },
  {
    path: "/signup",
    element: <AuthPage />,
    loader: guestOnlyLoader,
  },
  {
    element: <AppShell />,
    loader: protectedLoader,
    children: [
      { path: "/products", element: <ProductListPage /> },
      { path: "/products/new", element: <ProductFormPage /> },
      { path: "/products/:id", element: <ProductDetailPage /> },
      { path: "/products/:id/edit", element: <ProductFormPage /> },
    ],
  },
  {
    path: "*",
    loader: async () => {
      await ensureBootstrapped();
      return redirect(isAuthenticated() ? "/products" : "/login");
    },
  },
]);
