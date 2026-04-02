import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('Abogado2024!', 10)
  
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password,
    },
  })

  await prisma.user.upsert({
    where: { username: 'socio' },
    update: {},
    create: {
      username: 'socio',
      password,
    },
  })

  console.log('Seed completed: 2 users created (admin, socio)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
