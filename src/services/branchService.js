import { branches } from "../data/branches";
import { apiRequest, getBackendAssetUrl } from "./dashboardService";

const SELECTED_BRANCH_KEY = "selectedBranch";
let catalogProducts = [];

export function mapApiProduct(product) {
  const details =
    product.details && typeof product.details === "object"
      ? product.details
      : {};
  const stock = Number(product.stock) || 0;
  const images = Array.isArray(product.images) ? product.images : [];

  return {
    ...details,
    id: product._id || product.id,
    name: product.name,
    description: product.description,
    category: product.category,
    price: Number(product.price),
    stock,
    images,
    image: details.image || images[0] || "",
    rating: Number(details.rating) || 0,
    label: details.label || "",
    highlights: Array.isArray(details.highlights) ? details.highlights : [],
    comments: Array.isArray(details.comments) ? details.comments : [],
    stockByBranch: details.stockByBranch || { main: stock, north: 0, south: 0 },
  };
}

function toApiProduct(product) {
  const stockByBranch = product.stockByBranch || {};
  return {
    name: product.name.trim(),
    description: product.description.trim(),
    price: Number(product.price),
    category: product.category.trim(),
    stock: Object.values(stockByBranch).reduce(
      (total, value) => total + Number(value || 0),
      0,
    ),
    images: product.image ? [product.image.trim()] : [],
    details: {
      rating: Number(product.rating) || 0,
      label: product.label || "",
      highlights: product.highlights || [],
      comments: product.comments || [],
      stockByBranch,
    },
  };
}

export function getCatalogProducts() {
  return catalogProducts;
}

export function setCatalogProducts(products) {
  catalogProducts = products;
}

export async function fetchCatalogProducts() {
  const firstPage = await apiRequest("/products?page=1&limit=100", {
    authenticated: false,
  });
  const pages = await Promise.all(
    Array.from({ length: Math.max(firstPage.meta.totalPages - 1, 0) }, (_, index) =>
      apiRequest(`/products?page=${index + 2}&limit=100`, {
        authenticated: false,
      }),
    ),
  );
  catalogProducts = [firstPage, ...pages].flatMap((page) =>
    page.data.map(mapApiProduct),
  );
  return catalogProducts;
}

export async function createCatalogProduct(product) {
  const created = mapApiProduct(
    await apiRequest("/products", {
      method: "POST",
      body: toApiProduct(product),
    }),
  );
  catalogProducts = [...catalogProducts, created];
  return created;
}

export async function uploadCatalogImage(file) {
  const formData = new FormData();
  formData.append("image", file);
  const result = await apiRequest("/products/images", {
    method: "POST",
    body: formData,
  });
  if (typeof result?.url !== "string" || !result.url) {
    throw new Error("The backend did not return an image URL.");
  }
  return getBackendAssetUrl(result.url);
}

export async function updateCatalogProduct(id, product) {
  const updated = mapApiProduct(
    await apiRequest(`/products/${id}`, {
      method: "PATCH",
      body: toApiProduct(product),
    }),
  );
  catalogProducts = catalogProducts.map((item) =>
    item.id === id ? updated : item,
  );
  return updated;
}

export async function deleteCatalogProduct(id) {
  await apiRequest(`/products/${id}`, { method: "DELETE" });
  catalogProducts = catalogProducts.filter((product) => product.id !== id);
}

export function getProductStock(product, branchId) {
  const stock = product?.stockByBranch?.[branchId];
  if (Number.isFinite(Number(stock))) return Math.max(0, Number(stock));

  return Math.max(0, Number(product?.stock) || 0);
}

export function getSelectedBranchId() {
  const selectedBranchId = localStorage.getItem(SELECTED_BRANCH_KEY);
  return branches.some((branch) => branch.id === selectedBranchId)
    ? selectedBranchId
    : branches[0].id;
}

export function saveSelectedBranchId(branchId) {
  if (!branches.some((branch) => branch.id === branchId)) {
    throw new Error(`Unknown branch: ${branchId}`);
  }

  localStorage.setItem(SELECTED_BRANCH_KEY, branchId);
}
export function isBranchOpen(branch, now = new Date()) {
  const hour = now.getHours();
  return hour >= branch.opensAt && hour < branch.closesAt;
}

export function getStockStatus(stock) {
  if (stock <= 0) return { key: "out", label: "Out of stock" };
  if (stock <= 3) return { key: "low", label: `Only ${stock} left` };
  return { key: "in", label: "In stock" };
}

export function getBranchesWithStock(product, excludeBranchId) {
  return branches.filter(
    (branch) =>
      branch.id !== excludeBranchId && getProductStock(product, branch.id) > 0,
  );
}