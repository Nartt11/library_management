import { apiFetch } from "./base";

// GET /api/books/{id}
export function getMyProfile() {
  return apiFetch(`/profile`);
}

// GET /api/user/{accountId}
export function getUserProfileById(accountId: string) {
  return apiFetch(`/user/${accountId}`);
}
