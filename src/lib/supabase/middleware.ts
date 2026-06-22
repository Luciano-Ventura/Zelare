import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase environment variables are missing. Auth will not work.");
    return supabaseResponse;
  }

  // Create an edge-compatible supabase client
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    // Rota solicitada
    const pathname = request.nextUrl.pathname;

    // Regras de Proteção de Rotas
    const isAdminRoute = pathname.startsWith('/admin');
    const isLoginRoute = pathname === '/admin/login';
    const isProfissionalRoute = pathname.startsWith('/profissional');
    const isProfissionalLogin = pathname === '/profissional/login';

    if (isAdminRoute && !isLoginRoute) {
      if (error || !user) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = '/admin/login';
        
        const redirectResponse = NextResponse.redirect(loginUrl);
        // Ensure cookies are passed to the redirect response
        request.cookies.getAll().forEach((cookie) => {
          redirectResponse.cookies.set(cookie.name, cookie.value);
        });
        
        return redirectResponse;
      }
    }

    if (isProfissionalRoute && !isProfissionalLogin) {
      // Futuro: se precisar proteger /profissional via Supabase Auth
    }

    return supabaseResponse;
  } catch (err) {
    console.error("Middleware edge error:", err);
    if (request.nextUrl.pathname.startsWith('/admin') && request.nextUrl.pathname !== '/admin/login') {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/admin/login';
      return NextResponse.redirect(loginUrl);
    }
    return supabaseResponse;
  }
}
