import { NextResponse } from "next/server";
import { API_BASE } from '@/lib/apiConfig';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Accept either `email` or `userName` in the request body
    const { email, userName, password } = body;
    if (!(email || userName) || !password) {
      return NextResponse.json(
        { error: 'Email (or userName) and password are required' },
        { status: 400 }
      );
    }

    const url = `${API_BASE}/auth/login`;
    const payload: any = { password };
    if (email) payload.email = email;
    else payload.userName = userName;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    const data = await response.json();

    // Normalize backend responses. Backend may return:
    // { data: '<token string>', isSuccess: true }
    // or { data: { JWTtoken: '...' } }
    const token = data?.data ?? data?.data?.JWTtoken ?? data?.token ?? null;
    const isSuccess = data?.isSuccess ?? (response.ok ?? true);
    const errorMessage = data?.errorMessage ?? data?.error ?? null;

    if (!token) {
      return NextResponse.json({ error: errorMessage || 'Login failed', isSuccess: false }, { status: 400 });
    }

    return NextResponse.json({ token, isSuccess, errorMessage });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
}
