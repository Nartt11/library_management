import React from 'react';
import { BookManagement } from '../librarian/BookManagement';

// Super admin book management has full system access
export function AllBooksManagement() {
  return <BookManagement />;
}