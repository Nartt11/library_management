import { apiFetch } from "./base";
import { StudentDashboardData, BorrowedBook, StudentStatistics } from "../types/student";

// Mock data - DELETE THIS SECTION WHEN API IS READY
const MOCK_DASHBOARD_DATA: StudentDashboardData = {
  booksBorrowed: 3,
  daysVisited: 12,
  overdueBooks: 1,
  currentlyBorrowedBooks: [
    {
      id: '1',
      title: 'Introduction to Computer Science',
      author: 'John Smith',
      dueDate: '2025-08-15',
      status: 'Borrowed',
    },
    {
      id: '2',
      title: 'Data Structures and Algorithms',
      author: 'Jane Doe',
      dueDate: '2025-08-10',
      status: 'Overdue',
    },
    {
      id: '3',
      title: 'Database Management Systems',
      author: 'Mike Johnson',
      dueDate: '2025-08-20',
      status: 'Borrowed',
    },
  ],
};

// GET /api/student/dashboard - Student dashboard statistics
export async function getStudentDashboard(): Promise<StudentDashboardData> {
  // TODO: DELETE MOCK DATA WHEN API IS READY
  // Temporarily return mock data
  return Promise.resolve(MOCK_DASHBOARD_DATA);
  
  // UNCOMMENT THIS WHEN API IS READY:
  // return apiFetch(`/student/dashboard`);
}

// GET /api/student/borrowed-books - Get currently borrowed books
export async function getStudentBorrowedBooks(): Promise<BorrowedBook[]> {
  // TODO: DELETE MOCK DATA WHEN API IS READY
  return Promise.resolve(MOCK_DASHBOARD_DATA.currentlyBorrowedBooks);
  
  // UNCOMMENT THIS WHEN API IS READY:
  // return apiFetch(`/student/borrowed-books`);
}

// GET /api/student/history - Get borrowing history
export async function getStudentHistory(page: number = 1, pageSize: number = 10) {
  // UNCOMMENT THIS WHEN API IS READY:
  // return apiFetch(`/student/history?pageNumber=${page}&pageSize=${pageSize}`);
  return apiFetch(`/student/history?pageNumber=${page}&pageSize=${pageSize}`);
}

// GET /api/student/statistics - Get student statistics
export async function getStudentStatistics(): Promise<StudentStatistics> {
  // TODO: DELETE MOCK DATA WHEN API IS READY
  return Promise.resolve({
    booksBorrowed: MOCK_DASHBOARD_DATA.booksBorrowed,
    daysVisited: MOCK_DASHBOARD_DATA.daysVisited,
    overdueBooks: MOCK_DASHBOARD_DATA.overdueBooks,
  });
  
  // UNCOMMENT THIS WHEN API IS READY:
  // return apiFetch(`/student/statistics`);
}
