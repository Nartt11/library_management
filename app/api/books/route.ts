import { NextResponse } from "next/server";

const API_BASE = 'https://librarymanagementapi-x5bq.onrender.com/api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pageNumber = searchParams.get('pageNumber') || '1';
  const pageSize = searchParams.get('pageSize') || '50';

  try {
    const url = `${API_BASE}/books?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    const response = await fetch(url, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch books: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}
