const BASE = ""; // In AI Studio, relative paths work fine for the proxy

export const api = async (url: string, method = "GET", body?: any) => {
  const token = localStorage.getItem("token") || "unrestricted_session";
  const adminToken = localStorage.getItem("adminToken");

  const res = await fetch(BASE + url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": token,
      ...(adminToken && { "x-admin-token": adminToken }),
    },
    ...(body && { body: JSON.stringify(body) }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || "API error");
  }

  return res.json();
};
