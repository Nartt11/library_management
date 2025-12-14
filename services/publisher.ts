import { apiFetch } from "./base";

// GET /api/publishers?page=1&pageSize=10
export function getAllPublishers(searchTerm: string, page: number, pageSize: number) {
  if (searchTerm!="") return apiFetch(`/publishers/search?searchTerm=${searchTerm}&pageNumber=${page}&pageSize=${pageSize}`);
  return apiFetch(`/publishers?pageNumber=${page}&pageSize=${pageSize}`);
}

// GET /api/publishers/{id}
export function getPublisherById(id:string) {
  return apiFetch(`/publishers/${id}`);
}

// POST /api/publishers
export function createPublisher(publisher: any) {
  return apiFetch(`/publishers`, {
    method: "POST",
    body: JSON.stringify(publisher),
  });
}

// PUT /api/publishers/{id}
export function updatePublisher(id: string, publisher: any) {
  return apiFetch(`/publishers/${id}`, {
    method: "PUT",
    body: JSON.stringify(publisher),
  });
}

// DELETE /api/publishers/{id}
export function deletePublisher(id: string) {
  return apiFetch(`/publishers/${id}`, {
    method: "DELETE",
  });
}
