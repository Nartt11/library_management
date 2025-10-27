export async function loginApi(username: string, password: string) {
  const res = await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) throw new Error("Login failed");

  return res.json();
}
