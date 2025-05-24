import "reflect-metadata";
import { DataSource } from "typeorm";
import ormconfig from "../src/config/ormconfig";
import { Case } from "../src/entities/Case";
import { User } from "../src/entities/User";
import { Assignment } from "../src/entities/Assignment";
import { UserResponse } from "../src/entities/UserResponse";
import { faker } from "@faker-js/faker";
import { assignCasesToUser } from "../src/utils/assignmentHelper";

async function main() {
  const ds = new DataSource(ormconfig);
  await ds.initialize();

  const caseRepo = ds.getRepository(Case);
  const userRepo = ds.getRepository(User);
  // We still need these repos for assignmentHelper
  const assignRepo = ds.getRepository(Assignment);
  const responseRepo = ds.getRepository(UserResponse);

  console.log(
    "🔄 Deleting all user_responses, assignments & cases (with DELETE, not TRUNCATE)…",
  );
  // DELETE FROM user_response;
  await ds.createQueryBuilder().delete().from(UserResponse).execute();

  // DELETE FROM assignment;
  await ds.createQueryBuilder().delete().from(Assignment).execute();

  // DELETE FROM case;
  await ds.createQueryBuilder().delete().from(Case).execute();

  console.log("✅ All old data cleared.");

  console.log("🌱 Seeding 100 fake cases…");
  const immunList = ["DTP", "MMR", "Polio", "Hepatitis B", "Varicella"];
  const chronicList = ["Asthma", "Diabetes", "Hypertension", "HIV"];
  const minorList = ["Cold", "Flu", "Cough", "Headache"];
  const symptomList = [
    "Fever",
    "Cough",
    "Diarrhea",
    "Vomiting",
    "Fatigue",
    "Pain",
  ];

  const newCases: Case[] = [];
  for (let i = 0; i < 100; i++) {
    newCases.push(
      caseRepo.create({
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        age: faker.number.int({ min: 0, max: 90 }),
        sex: faker.helpers.arrayElement(["Male", "Female", "Other"]),
        occupation: faker.name.jobTitle(),
        immunizations: faker.helpers.arrayElements(
          immunList,
          faker.number.int({ min: 0, max: immunList.length }),
        ),
        chronicIllnesses: faker.helpers.arrayElements(
          chronicList,
          faker.number.int({ min: 0, max: chronicList.length }),
        ),
        minorIllnesses: faker.helpers.arrayElements(
          minorList,
          faker.number.int({ min: 0, max: minorList.length }),
        ),
        familySocialHistory: faker.lorem.sentences(2),
        chiefComplaint: faker.lorem.sentence(),
        currentSymptoms: faker.helpers.arrayElements(
          symptomList,
          faker.number.int({ min: 1, max: symptomList.length }),
        ),
      }),
    );
  }
  await caseRepo.save(newCases);
  console.log(`✅ Inserted ${newCases.length} cases.`);

  const users = await userRepo.find();
  console.log(
    `👥 Found ${users.length} users – assigning each 20–25 random cases…`,
  );

  for (const u of users) {
    const target = faker.number.int({ min: 20, max: 25 });
    const added = await assignCasesToUser(u.id, target);
    console.log(`   • ${u.email}: assigned ${added}`);
  }

  console.log("🎉 Seeding complete!");
  await ds.destroy();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
