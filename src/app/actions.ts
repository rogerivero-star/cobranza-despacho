'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

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
