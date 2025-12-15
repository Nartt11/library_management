// services/member.ts
export type MemberOverdue = {
  userId: string;
  fullName: string;
  email: string;
  borrowCount: number;
  lateReturnsCount: number;
  lateNotReturnedCount: number;
  isActive: boolean;
};


import { apiFetch } from "./base";

export function getMemberOverdue(
  pageNumber: number,
  pageSize: number
) {
  return apiFetch(
    `/member/member-overdue?pageNumber=${pageNumber}&pageSize=${pageSize}`
  );
}
