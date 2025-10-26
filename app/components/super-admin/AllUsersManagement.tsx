import React from 'react';
import { UserManagement } from '../admin/UserManagement';

// Super admin user management extends admin functionality
// with additional permissions and system-wide access
export function AllUsersManagement() {
  return <UserManagement />;
}