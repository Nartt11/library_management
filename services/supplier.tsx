import { apiFetch } from "./base";

// GET /api/Suppliers?page=1&pageSize=10
export function getAllSupplier(
  searchTerm: string,
  page: number,
  pageSize: number
) {
  if (searchTerm != "")
    return apiFetch(
      `/suppliers/search?searchTerm=${searchTerm}&pageNumber=${page}&pageSize=${pageSize}`
    );
  return apiFetch(`/suppliers?pageNumber=${page}&pageSize=${pageSize}`);
}

// GET /api/Supplier/{id}
export function getSupplierById(id: string) {
  return apiFetch(`/supplier/${id}`);
}

// POST /api/Supplier
export function createSupplier(Supplier: any) {
  return apiFetch(`/supplier`, {
    method: "POST",
    body: JSON.stringify(Supplier),
  });
}

// PUT /api/Supplier/{id}
export function updateSupplier(id: string, Supplier: any) {
  return apiFetch(`/supplier/${id}`, {
    method: "PUT",
    body: JSON.stringify(Supplier),
  });
}

// DELETE /api/Supplier/{id}
export function deleteSupplier(id: string) {
  return apiFetch(`/supplier/${id}`, {
    method: "DELETE",
  });
}
