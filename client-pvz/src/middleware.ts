import { NextResponse, type NextRequest } from "next/server";
import { EnumTokens } from "./services/auth/auth-token.service";
import { cookies } from "next/headers";

export async function middleware(request:NextRequest) {
    const refreshToken = request.cookies.get(EnumTokens.REFRESH_TOKEN)?.value


    const isAuthPage = request.url.includes('http://localhost:3000/auth') 
    if(isAuthPage) {
        if(refreshToken) {
            return NextResponse.redirect(new URL('http://localhost:3000/my', request.url))
        }
        return NextResponse.next()
    }
    if(refreshToken === undefined) {
        return NextResponse.redirect(new URL('http://localhost:3000/auth', request.url))
    }

    return NextResponse.next()

    
}

export const config = {
    matcher: ['/my/:path*', '/auth']
}