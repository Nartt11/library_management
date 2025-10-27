import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  // Fake users
  const users = [
    { id: 1, username: "123", password: "123", role: "student" },
    { id: 2, username: "admin", password: "123", role: "admin" },
    { id: 3, username: "librarian", password: "123", role: "librarian" },
    { id: 4, username: "scanner", password: "123", role: "scanner" },
  ];

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  return NextResponse.json({
    id: user.id,
    username: user.username,
    role: user.role,
    token: "FAKE_JWT_TOKEN",
  });
}
