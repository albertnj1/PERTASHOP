import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const users = await prisma.users.findMany({
      select: { nama: true, email: true, role: true }
    })
    console.log('Users in database:', JSON.stringify(users, null, 2))
  } catch (error) {
    console.error('Connection failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
