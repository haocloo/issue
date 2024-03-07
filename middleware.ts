import { auth } from "@/lib/auth/auth"

export default auth((req) => {
  // req.auth
  console.log("Route Middleware", req.nextUrl.pathname)
})

// Optionally, don't invoke Middleware on some paths
// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  // matcher:[]
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
    // matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}