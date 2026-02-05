// actions/auth.ts
export const getAuthenticatedUser = async () => {
  try {
    const res = await fetch("http://localhost:5000/auth/me", {
      method: "GET",
      credentials: "include", // or send token in headers if using JWT
    });

    if (!res.ok) return { user: null };
    const data = await res.json();
    return { user: data.user || null };
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return { user: null };
  }
};
