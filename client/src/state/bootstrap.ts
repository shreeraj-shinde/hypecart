import { store } from "./store";
import { meThunk, refreshThunk } from "./authSlice";
import { fetchProductsThunk } from "./productsSlice";

let bootstrapPromise: Promise<void> | null = null;
let productsPromise: Promise<void> | null = null;

/**
 * Attempts a silent session restore (via the httpOnly refresh cookie) exactly
 * once per page load. Route loaders await this before reading auth state so
 * a hard reload doesn't bounce an authenticated user to /login while the
 * refresh request is still in flight. On success, also fetches the user's
 * profile via /auth/me, since /auth/refresh only returns a new access token.
 */
export const ensureBootstrapped = (): Promise<void> => {
  bootstrapPromise ??= store
    .dispatch(refreshThunk())
    .then((action) => {
      if (refreshThunk.fulfilled.match(action)) {
        return store.dispatch(meThunk()).then(() => undefined);
      }
      return undefined;
    });
  return bootstrapPromise;
};

/**
 * Fetches the signed-in seller's product catalogue exactly once per session.
 * Mutations (create/update/delete) update the store directly, so a re-fetch
 * on every navigation between /products routes isn't needed.
 */
export const ensureProductsLoaded = (): Promise<void> => {
  productsPromise ??= store.dispatch(fetchProductsThunk()).then(() => undefined);
  return productsPromise;
};

/** Forces the next ensureProductsLoaded() call to re-fetch (e.g. after sign-out). */
export const resetProductsCache = (): void => {
  productsPromise = null;
};
