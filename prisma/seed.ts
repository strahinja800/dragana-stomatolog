import prisma from '../lib/db';

async function main() {
  console.log('Seeding database...');

  // Seed Working Hours (Pon-Pet 08-17, Sub 08-13, Ned zatvoreno)
  const workingHoursData = [
    { dayOfWeek: 0, startTime: '08:00', endTime: '17:00', isOpen: false }, // Nedelja
    { dayOfWeek: 1, startTime: '08:00', endTime: '17:00', isOpen: true }, // Ponedeljak
    { dayOfWeek: 2, startTime: '08:00', endTime: '17:00', isOpen: true }, // Utorak
    { dayOfWeek: 3, startTime: '08:00', endTime: '17:00', isOpen: true }, // Sreda
    { dayOfWeek: 4, startTime: '08:00', endTime: '17:00', isOpen: true }, // Cetvrtak
    { dayOfWeek: 5, startTime: '08:00', endTime: '17:00', isOpen: true }, // Petak
    { dayOfWeek: 6, startTime: '08:00', endTime: '13:00', isOpen: true }, // Subota
  ];

  for (const data of workingHoursData) {
    await prisma.workingHours.upsert({
      where: { dayOfWeek: data.dayOfWeek },
      update: data,
      create: data,
    });
  }
  console.log('Working hours seeded');

  // Seed Service Types
  const serviceTypesData = [
    {
      name: 'Pregled',
      durationMinutes: 30,
      description: 'Standardni stomatološki pregled',
      sortOrder: 1,
    },
    {
      name: 'Čišćenje kamenca',
      durationMinutes: 45,
      description: 'Profesionalno čišćenje zubnog kamenca',
      sortOrder: 2,
    },
    {
      name: 'Plomba',
      durationMinutes: 60,
      description: 'Popravka zuba plombom',
      sortOrder: 3,
    },
    {
      name: 'Vađenje zuba',
      durationMinutes: 45,
      description: 'Ekstrakcija zuba',
      sortOrder: 4,
    },
    {
      name: 'Beljenje zuba',
      durationMinutes: 90,
      description: 'Profesionalno beljenje zuba',
      sortOrder: 5,
    },
  ];

  for (const data of serviceTypesData) {
    const existing = await prisma.serviceType.findFirst({
      where: { name: data.name },
    });

    if (!existing) {
      await prisma.serviceType.create({ data });
    }
  }
  console.log('Service types seeded');

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
