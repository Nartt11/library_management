import React from 'react';
import { BorrowingHistory } from '../librarian/BorrowingHistory';

// Admin borrowing history uses the same component as librarian
// but could have additional reporting features
export function AdminBorrowingHistory() {
  return <BorrowingHistory />;
}