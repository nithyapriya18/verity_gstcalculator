import { NextResponse } from 'next/server'
import { GST_AUTH_COOKIE, getExpectedGstPassword } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const password = String(body?.password || '')
    const expectedPassword = getExpectedGstPassword()

    if (!password || password !== expectedPassword) {
      return NextResponse.json({ ok: false, message: 'Invalid password' }, { status: 401 })
    }

    const res = NextResponse.json({ ok: true })
    res.cookies.set({
      name: GST_AUTH_COOKIE,
      value: '1',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
    return res
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid request' }, { status: 400 })
  }
}

