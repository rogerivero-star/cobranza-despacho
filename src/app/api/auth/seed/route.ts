import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    const password = await bcrypt.hash('Abogado2024!', 10)
    
    const admin = await prisma.user.upsert({
      where: { username: 'admin' },
      update: {},
      create: {
        username: 'admin',
        password,
      },
    })

    const socio = await prisma.user.upsert({
      where: { username: 'socio' },
      update: {},
      create: {
        username: 'socio',
        password,
      },
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Usuarios inicializados correctamente',
      users: ['admin', 'socio']
    })
  } catch (error: any) {
    console.error('Seed error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}
