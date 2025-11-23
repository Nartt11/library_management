const BASE_URL = `https://librarymanagementapi-x5bq.onrender.com/api`;

export async function apiFetch(path: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      cache: "no-store", // tránh cache response cũ của Next.js
      ...options,
    });

    const contentType = response.headers.get("content-type");

    let data: any = null;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json().catch(() => null);
    }

    if (!response.ok) {
      throw {
        status: response.status,
        message: data?.message || "API Request Failed",
      };
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
