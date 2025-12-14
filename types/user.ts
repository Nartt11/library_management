export type UserRole = "admin" | "staff" | "student";
export interface User {
  id: string;
  fullname: string;
  email: string;
  studentNumber?: string;
  role: UserRole;
  avatar?: string;
  //phoneNumber?: string;
  //address?: string; 
}