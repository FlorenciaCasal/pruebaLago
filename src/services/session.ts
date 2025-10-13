

export async function doLogout() {
    await fetch("/api/auth/logout", { method: "POST" }); // borra la cookie HttpOnly
    // Limpieza de la versión vieja (por si quedó algo en localStorage):
    if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
    }
    window.location.href = "/login";
}
