import { apiFetch } from "./base";

// GET /api/books/{id}
export function getMyProfile() {
  return apiFetch(`/profile`);
}

// GET /api/user/{accountId}
export function getUserProfileById(accountId: string) {
  return apiFetch(`/user/${accountId}`);
}

// PUT /api/profile
export function updateMyProfile(body: any) {
  return apiFetch(`/profile`, {
    method: "PUT",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
