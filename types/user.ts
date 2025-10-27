export type UserRole = "admin" | "librarian" | "student" | "scanner";
export interface User {
  id: string;
  name: string;
  email: string;
  studentNumber?: string;
  role: UserRole;
  avatar?: string;
}