export { default } from 'next-auth/middleware'

export const config = {
    matcher: ['/map/confirmation/:path*', '/travels']
}