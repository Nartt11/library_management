export function getShowroomBooks(){
    return  [
    {
      id: "1",
      title: "Introduction to Computer Science",
      author: "John Smith",
      isbn: "978-0-123456-78-9",
      bookId: "CS-001",
      category: "Computer Science",
      status: "available",
      location: "Section A, Shelf 2",
      description:
        "A comprehensive introduction to computer science fundamentals.",
      copies: 5,
      availableCopies: 3,
      imageUrl:
        "https://images.unsplash.com/photo-1581019055756-93b5361f9536?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHNjaWVuY2UlMjB0ZXh0Ym9va3xlbnwxfHx8fDE3NTU1NzEzMjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: "2",
      title: "Data Structures and Algorithms",
      author: "Jane Doe",
      isbn: "978-0-123456-79-6",
      bookId: "CS-002",
      category: "Computer Science",
      status: "borrowed",
      location: "Section A, Shelf 3",
      description:
        "In-depth coverage of data structures and algorithmic thinking.",
      copies: 3,
      availableCopies: 0,
      expectedReturnDate: "2025-01-25",
      borrowedBy: "Available after Jan 25, 2025",
      imageUrl:
        "https://images.unsplash.com/photo-1664854953181-b12e6dda8b7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwc3RydWN0dXJlcyUyMGFsZ29yaXRobXMlMjBib29rfGVufDF8fHx8MTc1NTU3MTMyMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: "3",
      title: "Modern Physics",
      author: "Robert Johnson",
      isbn: "978-0-123456-80-2",
      bookId: "PHY-001",
      category: "Physics",
      status: "available",
      location: "Section B, Shelf 1",
      description:
        "Contemporary approaches to understanding physical phenomena.",
      copies: 4,
      availableCopies: 2,
      imageUrl:
        "https://images.unsplash.com/photo-1626885228113-0ac4b52e6cea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaHlzaWNzJTIwdGV4dGJvb2t8ZW58MXx8fHwxNzU1NTcxMzIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: "4",
      title: "Organic Chemistry",
      author: "Maria Garcia",
      isbn: "978-0-123456-81-9",
      bookId: "CHEM-001",
      category: "Chemistry",
      status: "available",
      location: "Section C, Shelf 2",
      description: "Comprehensive guide to organic chemical reactions.",
      copies: 2,
      availableCopies: 1,
      imageUrl:
        "https://images.unsplash.com/photo-1626885228113-0ac4b52e6cea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVtaXN0cnklMjB0ZXh0Ym9va3xlbnwxfHx8fDE3NTU1NzEzMjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: "5",
      title: "Linear Algebra",
      author: "David Wilson",
      isbn: "978-0-123456-82-6",
      bookId: "MATH-001",
      category: "Mathematics",
      status: "overdue",
      location: "Section D, Shelf 1",
      description: "Vector spaces, linear transformations, and matrix theory.",
      copies: 3,
      availableCopies: 0,
      expectedReturnDate: "2025-01-30",
      borrowedBy: "Expected back by Jan 30, 2025",
      imageUrl:
        "https://images.unsplash.com/photo-1588912914017-923900a34710?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXRoZW1hdGljcyUyMHRleHRib29rfGVufDF8fHx8MTc1NTU2MzA4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: "6",
      title: "World History",
      author: "Sarah Brown",
      isbn: "978-0-123456-83-3",
      bookId: "HIST-001",
      category: "History",
      status: "available",
      location: "Section E, Shelf 3",
      description:
        "A global perspective on historical events and civilizations.",
      copies: 6,
      availableCopies: 4,
      imageUrl:
        "https://images.unsplash.com/photo-1505664194779-8beaceb93744?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaXN0b3J5JTIwYm9va3xlbnwxfHx8fDE3NTU1NzEzMjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: "7",
      title: "Database Systems",
      author: "Michael Chen",
      isbn: "978-0-123456-84-0",
      bookId: "CS-003",
      category: "Computer Science",
      status: "borrowed",
      location: "Section A, Shelf 1",
      description:
        "Database design, implementation, and management principles.",
      copies: 4,
      availableCopies: 1,
      expectedReturnDate: "2025-01-28",
      borrowedBy: "Available after Jan 28, 2025",
      imageUrl:
        "https://images.unsplash.com/photo-1619771766980-368d32e44b82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhYmFzZSUyMHN5c3RlbXMlMjBib29rfGVufDF8fHx8MTc1NTU3MTMyM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: "8",
      title: "Calculus and Analytical Geometry",
      author: "Lisa Anderson",
      isbn: "978-0-123456-85-7",
      bookId: "MATH-002",
      category: "Mathematics",
      status: "available",
      location: "Section D, Shelf 2",
      description:
        "Fundamental concepts of calculus with geometric applications.",
      copies: 5,
      availableCopies: 3,
      imageUrl:
        "https://images.unsplash.com/photo-1708011271954-c0d2b3155ded?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWxjdWx1cyUyMG1hdGhlbWF0aWNzJTIwYm9va3xlbnwxfHx8fDE3NTU1NzEzMjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
  ];
}
export function getPagedBooks(page: number, pageSize: number) {
  // Implementation to fetch paged books
}
export function getBookById(bookId: string) {
  // Implementation to fetch a book by its ID
}
