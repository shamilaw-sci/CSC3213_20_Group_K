export const AUTH_USER_KEY = "authUser";

export function getAuthUser() {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw);
    return user && typeof user === "object" ? user : null;
  } catch {
    return null;
  }
}

export function saveAuthSession({ token, user }) {
  localStorage.setItem("token", token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function clearAuthSession() {
  localStorage.removeItem("token");
  localStorage.removeItem(AUTH_USER_KEY);
}

export function getRoleHome(role) {
  if (role === "guide") return "/guide/dashboard";
  if (role === "admin") return "/admin";
  return "/dashboard";
}
