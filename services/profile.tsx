import { apiFetch } from "./base";

// GET /api/books/{id}
export function getMyProfile() {
  return apiFetch(`/profile`);
}
