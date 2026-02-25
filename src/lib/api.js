export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token,   // 🔑 THIS IS THE KEY LINE
      ...(options.headers || {})
    }
  });

  if (res.status === 401 || res.status === 403) {
    // token invalid or missing
    localStorage.clear();
    window.location.href = "/login";
    return;
  }

  return res.json();
}
