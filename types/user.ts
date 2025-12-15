export type UserRole = "admin" | "staff" | "student";
export interface User {
  id: string;
  name: string;
  email: string;
  studentNumber?: string;
  role: UserRole;
  avatar?: string;
  // Extended optional profile fields
  fullName?: string;
  phoneNumber?: string;
  address?: string;
  imageUrl?: string;
  joinDate?: string;
}