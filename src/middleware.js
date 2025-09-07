import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

/**
 * Middleware para autenticação e controle de acesso baseado em perfis
 */
export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Verificar se o usuário está autenticado
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Obter a URL atual
  const url = req.nextUrl.clone();
  const { pathname } = url;

  // Rotas que não precisam de autenticação
  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/reset-password',
    '/api/auth',
  ];

  // Verificar se a rota atual é pública
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // Se não estiver autenticado e a rota não for pública, redirecionar para login
  if (!session && !isPublicRoute) {
    url.pathname = '/login';
    url.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(url);
  }

  // Se estiver autenticado e tentar acessar rotas de autenticação, redirecionar para dashboard
  if (session && (pathname === '/login' || pathname === '/register')) {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // Verificar permissões para rotas protegidas
  if (session && !isPublicRoute) {
    // Obter perfil do usuário
    const { data: profile } = await supabase
      .from('perfis_usuarios')
      .select('perfil')
      .eq('id', session.user.id)
      .single();

    // Rotas administrativas
    if (pathname.startsWith('/admin') && profile?.perfil !== 'admin') {
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }

    // Rotas de comandante
    if (
      pathname.startsWith('/comandante') && 
      !['admin', 'comandante'].includes(profile?.perfil)
    ) {
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return res;
}

// Configurar quais rotas devem passar pelo middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};