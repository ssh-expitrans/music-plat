import * as dotenv from 'dotenv';
dotenv.config();


console.log('DATABASE_URL:', process.env.DATABASE_URL);

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'student1@example.com' },
    update: {},
    create: {
      name: 'Student One',
      email: 'student1@example.com',
      password: 'password123', // plaintext for now
      lessons: {
        create: [
          {
            date: new Date('2025-06-05T15:00:00.000Z'),
            duration: 30,
          },
          {
            date: new Date('2025-06-12T15:00:00.000Z'),
            duration: 45,
          },
        ],
      },
    },
  });

  console.log('Seeded user:', user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
