const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function seed() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.users.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      nama: 'Administrator',
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: 'Admin',
      no_hp: '081234567890',
    },
  });

  const operator = await prisma.users.upsert({
    where: { email: 'operator@gmail.com' },
    update: {},
    create: {
      nama: 'Operator 1',
      email: 'operator@gmail.com',
      password: hashedPassword,
      role: 'Operator',
      no_hp: '081234567891',
    },
  });

  // Create default Pertashop locations if they don't exist
  await prisma.pertashop.createMany({
    data: [
      { nama: 'Sumingkir', lokasi: 'Sumingkir' },
      { nama: 'Kemutug', lokasi: 'Kemutug' },
      { nama: 'Kalibenda', lokasi: 'Kalibenda' },
      { nama: 'Kalitapen', lokasi: 'Kalitapen' }
    ],
    skipDuplicates: true,
  });

  // Create default BBM config
  await prisma.bbm_config.createMany({
    data: [
      { nama_bbm: 'Pertamax', harga: 12950, stok: 3000, kapasitas: 3000 }
    ],
    skipDuplicates: true,
  });

  console.log('Seeding Supabase Database Complete!');
  console.log('Admin:', admin.email);
  console.log('Operator:', operator.email);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
