export const setToken = (t: string) => localStorage.setItem("token", t);
export const getToken = () => (typeof window !== "undefined" ? localStorage.getItem("token") : null);
export const clearToken = () => localStorage.removeItem("token");

export const roleToDashboard = (role?: string) => {
  switch (role) {
    case "ADMIN": return "/admin";
    case "CLUB_HEAD": return "/club-head";
    default: return "/student";
  }
};