'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

export async function createInvoice(formData: FormData) {
  const clientName = formData.get('clientName') as string
  const amount = parseFloat(formData.get('amount') as string)
  const invoiceNumber = formData.get('invoiceNumber') as string
  const isPrepared = formData.get('isPrepared') === 'on'
  const noInvoice = formData.get('noInvoice') === 'on'
  const issueDateStr = formData.get('issueDate') as string
  const issueDate = issueDateStr ? new Date(issueDateStr) : new Date()

  // Find or create client
  let client = await prisma.client.findFirst({
    where: { name: clientName }
  })

  if (!client) {
    client = await prisma.client.create({
      data: { name: clientName }
    })
  }

  // Create invoice
  await prisma.invoice.create({
    data: {
      clientId: client.id,
      amount,
      invoiceNumber: noInvoice ? null : invoiceNumber,
      isPrepared: noInvoice ? false : isPrepared,
      noInvoice,
      issueDate,
      isPaid: false, // Default to pending
    }
  })

  revalidatePath('/')
  redirect('/')
}

export async function markAsPaid(invoiceId: number) {
  await prisma.invoice.update({
    where: { id: invoiceId },
    data: { 
      isPaid: true,
      paymentDate: new Date()
    }
  })
  revalidatePath('/')
}

export async function updateUser(formData: FormData) {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')
  
  if (!session || session.value !== 'admin') {
    throw new Error('No autorizado. Solo el administrador puede realizar esta acción.')
  }

  const currentPassword = formData.get('currentPassword') as string
  const newUsername = formData.get('newUsername') as string
  const newPassword = formData.get('newPassword') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (newPassword !== confirmPassword) {
    throw new Error('Las contraseñas no coinciden.')
  }

  const user = await prisma.user.findUnique({
    where: { username: 'admin' }
  })

  if (!user) throw new Error('Usuario no encontrado.')

  const passwordMatch = await bcrypt.compare(currentPassword, user.password)
  if (!passwordMatch) {
    throw new Error('La contraseña actual es incorrecta.')
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10)

  await prisma.user.update({
    where: { username: 'admin' },
    data: {
      username: newUsername,
      password: hashedPassword
    }
  })

  // Force logout to re-authenticate
  cookieStore.delete('session')
  redirect('/login?message=Credenciales+actualizadas.+Por+favor+inicie+sesión+nuevamente.')
}
