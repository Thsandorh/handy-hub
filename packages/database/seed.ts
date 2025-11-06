import { PrismaClient, UserRole, BudgetType, TaskStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clean database
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.taskPhoto.deleteMany();
  await prisma.task.deleteMany();
  await prisma.taskerSkill.deleteMany();
  await prisma.taskerProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.skill.deleteMany();

  console.log('✅ Database cleaned');

  // Create Skills
  const skills = await Promise.all([
    prisma.skill.create({
      data: {
        name: 'Bútorszerelés',
        category: 'Karbantartás',
        iconName: 'hammer',
      },
    }),
    prisma.skill.create({
      data: {
        name: 'Takarítás',
        category: 'Háztartás',
        iconName: 'broom',
      },
    }),
    prisma.skill.create({
      data: {
        name: 'Költöztetés',
        category: 'Szállítás',
        iconName: 'truck',
      },
    }),
    prisma.skill.create({
      data: {
        name: 'Festés-mázolás',
        category: 'Karbantartás',
        iconName: 'paint-brush',
      },
    }),
    prisma.skill.create({
      data: {
        name: 'Kertrendezés',
        category: 'Kert',
        iconName: 'tree',
      },
    }),
    prisma.skill.create({
      data: {
        name: 'Vízvezeték szerelés',
        category: 'Karbantartás',
        iconName: 'wrench',
      },
    }),
  ]);

  console.log(`✅ Created ${skills.length} skills`);

  // Create demo password hash
  const passwordHash = await bcrypt.hash('password123', 10);

  // Create Client User
  const client = await prisma.user.create({
    data: {
      email: 'client@mesterpont.hu',
      phone: '+36301234567',
      passwordHash,
      firstName: 'János',
      lastName: 'Kovács',
      role: UserRole.CLIENT,
    },
  });

  console.log('✅ Created client user');

  // Create Tasker Users
  const tasker1 = await prisma.user.create({
    data: {
      email: 'tasker1@mesterpont.hu',
      phone: '+36302345678',
      passwordHash,
      firstName: 'Péter',
      lastName: 'Nagy',
      role: UserRole.TASKER,
      taskerProfile: {
        create: {
          bio: 'Tapasztalt bútorszerelő vagyok 10+ év gyakorlattal. Precíz munkát végzek, gyorsan és megbízhatóan.',
          verificationStatus: 'VERIFIED',
          hourlyRate: 5000,
          locationLat: 47.4979,
          locationLng: 19.0402,
          serviceRadiusKm: 15,
          averageRating: 4.8,
          completedTasks: 127,
          totalEarnings: 1850000,
        },
      },
    },
  });

  // Add skills to tasker1
  await prisma.taskerSkill.createMany({
    data: [
      { taskerId: tasker1.id, skillId: skills[0].id, experienceYears: 10 },
      { taskerId: tasker1.id, skillId: skills[3].id, experienceYears: 5 },
    ],
  });

  const tasker2 = await prisma.user.create({
    data: {
      email: 'tasker2@mesterpont.hu',
      phone: '+36303456789',
      passwordHash,
      firstName: 'Anna',
      lastName: 'Tóth',
      role: UserRole.TASKER,
      taskerProfile: {
        create: {
          bio: 'Alapos takarítást végzek lakásokban és irodákban. Környezetbarát tisztítószereket használok.',
          verificationStatus: 'VERIFIED',
          hourlyRate: 3500,
          locationLat: 47.5012,
          locationLng: 19.0513,
          serviceRadiusKm: 10,
          averageRating: 4.9,
          completedTasks: 243,
          totalEarnings: 2100000,
        },
      },
    },
  });

  await prisma.taskerSkill.create({
    data: {
      taskerId: tasker2.id,
      skillId: skills[1].id,
      experienceYears: 7,
    },
  });

  const tasker3 = await prisma.user.create({
    data: {
      email: 'tasker3@mesterpont.hu',
      phone: '+36304567890',
      passwordHash,
      firstName: 'Gábor',
      lastName: 'Szabó',
      role: UserRole.TASKER,
      taskerProfile: {
        create: {
          bio: 'Költöztetés, nehéz tárgyak szállítása. Saját furgonnal dolgozom.',
          verificationStatus: 'VERIFIED',
          hourlyRate: 8000,
          locationLat: 47.4850,
          locationLng: 19.0621,
          serviceRadiusKm: 20,
          averageRating: 4.7,
          completedTasks: 89,
          totalEarnings: 1200000,
        },
      },
    },
  });

  await prisma.taskerSkill.create({
    data: {
      taskerId: tasker3.id,
      skillId: skills[2].id,
      experienceYears: 5,
    },
  });

  console.log('✅ Created 3 tasker users with profiles');

  // Create Admin User
  await prisma.user.create({
    data: {
      email: 'admin@mesterpont.hu',
      phone: '+36305678901',
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
    },
  });

  console.log('✅ Created admin user');

  // Create sample tasks
  const task1 = await prisma.task.create({
    data: {
      clientId: client.id,
      skillId: skills[0].id,
      title: 'IKEA szekrény összeszerelése',
      description:
        'Van egy PAX szekrényem, amit szeretnék összeszereltetni. Minden alkatrész megvan, csak nem áll össze...',
      locationAddress: 'Budapest, VIII. kerület, Üllői út 50.',
      locationLat: 47.4851,
      locationLng: 19.0621,
      budgetType: BudgetType.FIXED,
      budgetAmount: 15000,
      status: TaskStatus.OPEN,
    },
  });

  const task2 = await prisma.task.create({
    data: {
      clientId: client.id,
      skillId: skills[1].id,
      title: 'Lakás takarítás költözés előtt',
      description: 'Kb. 60 nm lakás alapos takarítása szükséges.',
      locationAddress: 'Budapest, XIII. kerület, Váci út 120.',
      locationLat: 47.5182,
      locationLng: 19.0568,
      budgetType: BudgetType.HOURLY,
      budgetAmount: 3500,
      status: TaskStatus.OPEN,
      scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    },
  });

  const task3 = await prisma.task.create({
    data: {
      clientId: client.id,
      taskerId: tasker1.id,
      skillId: skills[0].id,
      title: 'Polcok felszerelése',
      description: '3 db IKEA polc felszerelése gipszkarton falra.',
      locationAddress: 'Budapest, V. kerület, Váci utca 10.',
      locationLat: 47.4979,
      locationLng: 19.0535,
      budgetType: BudgetType.FIXED,
      budgetAmount: 12000,
      finalAmount: 12000,
      status: TaskStatus.COMPLETED,
      completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
  });

  console.log('✅ Created sample tasks');

  // Create offers for open tasks
  await prisma.offer.create({
    data: {
      taskId: task1.id,
      taskerId: tasker1.id,
      proposedAmount: 14000,
      message: 'Szívesen elvállalom! 10+ év tapasztalat IKEA bútorokkal.',
      status: 'PENDING',
    },
  });

  await prisma.offer.create({
    data: {
      taskId: task2.id,
      taskerId: tasker2.id,
      proposedAmount: 3500,
      message: 'Holnap délelőtt is tudok, ha sürgős!',
      status: 'PENDING',
    },
  });

  console.log('✅ Created sample offers');

  // Create review for completed task
  await prisma.review.create({
    data: {
      taskId: task3.id,
      reviewerId: client.id,
      revieweeId: tasker1.id,
      rating: 5,
      comment: 'Gyors, precíz munka. Csak ajánlani tudom!',
    },
  });

  await prisma.review.create({
    data: {
      taskId: task3.id,
      reviewerId: tasker1.id,
      revieweeId: client.id,
      rating: 5,
      comment: 'Kedves megbízó, pontos időpont egyeztetés.',
    },
  });

  console.log('✅ Created sample reviews');

  console.log('');
  console.log('🎉 Seed completed successfully!');
  console.log('');
  console.log('📧 Test accounts:');
  console.log('   Client:  client@mesterpont.hu / password123');
  console.log('   Tasker1: tasker1@mesterpont.hu / password123');
  console.log('   Tasker2: tasker2@mesterpont.hu / password123');
  console.log('   Tasker3: tasker3@mesterpont.hu / password123');
  console.log('   Admin:   admin@mesterpont.hu / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
