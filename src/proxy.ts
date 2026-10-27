import { NextResponse, type NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Leer la cookie segura del Access Token
  const accessToken = request.cookies.get("accessToken")?.value;
  const payload = accessToken ? await verifyAccessToken(accessToken) : null;

  // 1. Proteger rutas privadas del usuario regular (/dashboard)
  if (pathname.startsWith("/dashboard")) {
    if (!payload) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Proteger rutas de administración (/admin)
  if (pathname.startsWith("/admin")) {
    // Si no está autenticado, al login
    if (!payload) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Si está autenticado pero no es ADMIN, bloquearlo enviándolo a su dashboard
    if (payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

// Exportar también como middleware por compatibilidad estándar de Next.js
export { proxy as middleware };

// Configuración de rutas interceptadas por el proxy
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};