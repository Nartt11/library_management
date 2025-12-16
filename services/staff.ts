import { apiFetch } from "./base";

// GET /api/Staff with search parameters
export function getAllStaff(
  page: number,
  pageSize: number,
  nameContains?: string,
  emailContains?: string,
  phoneContains?: string,
  hiredFrom?: string,
  hiredTo?: string
) {
  const params = new URLSearchParams({
    pageNumber: page.toString(),
    pageSize: pageSize.toString(),
  });

  if (nameContains) params.append("nameContains", nameContains);
  if (emailContains) params.append("emailContains", emailContains);
  if (phoneContains) params.append("phoneContains", phoneContains);
  if (hiredFrom) params.append("hiredFrom", hiredFrom);
  if (hiredTo) params.append("hiredTo", hiredTo);

  return apiFetch(`/staffs/search?${params.toString()}`);
}

// GET /api/Staff/{id}
export function getStaffById(id: string) {
  return apiFetch(`/staff/${id}`);
}

// POST /api/Staff
export function createStaff(staff: any) {
  return apiFetch(`/staff`, {
    method: "POST",
    body: JSON.stringify(staff),
  });
}

// PUT /api/Staff/{id}
export function updateStaff(id: string, staff: any) {
  return apiFetch(`/staff/${id}`, {
    method: "PUT",
    body: JSON.stringify(staff),
  });
}

// DELETE /api/Staff/{id}
export function deleteStaff(id: string) {
  return apiFetch(`/staff/${id}`, {
    method: "DELETE",
  });
}
