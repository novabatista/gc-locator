import {NextResponse} from 'next/server'
import {createServerClient} from '@supabase/ssr'

export async function middleware(request){
  const {pathname} = request.nextUrl

  if (!pathname.startsWith('/manager')) {
    return NextResponse.next()
  }

  if (pathname === '/manager/login') {
    return NextResponse.next()
  }

  const response = NextResponse.next({request})

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll(){
          return request.cookies.getAll()
        },
        setAll(cookiesToSet){
          cookiesToSet.forEach(({name, value, options}) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const {data: {user}} = await supabase.auth.getUser()

  if (!user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/manager/login'
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: ['/manager/:path*'],
}
