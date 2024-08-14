const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ["query", "info", "warn", "error"],
});

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "Computer Science" },
        { name: "Music" },
        { name: "Fitness" },
        { name: "Photography" },
        { name: "Accounting" },
        { name: "Engineering" },
        { name: "Filming" },
      ],
    });
    console.log("Course categories seeded to DB successfully!");
  } catch (error) {
    console.log("Error seeding the database with course categories", error);
  } finally {
    await database.$disconnect();
  }
}

main();
