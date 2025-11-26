export interface BorrowedBook {
  id: string;
  title: string;
  author: string;
  dueDate: string;
  status: 'Borrowed' | 'Overdue' | 'Returned';
}

export interface StudentDashboardData {
  booksBorrowed: number;
  daysVisited: number;
  overdueBooks: number;
  currentlyBorrowedBooks: BorrowedBook[];
}

export interface StudentStatistics {
  booksBorrowed: number;
  daysVisited: number;
  overdueBooks: number;
}

export interface BorrowingHistory {
  id: string;
  bookTitle: string;
  author: string;
  borrowDate: string;
  returnDate: string | null;
  dueDate: string;
  status: 'Borrowed' | 'Returned' | 'Overdue';
}
