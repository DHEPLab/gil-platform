import "reflect-metadata";
import { DataSource } from "typeorm";
import ormconfig from "../src/config/ormconfig";
import { assignCasesToUser } from "../src/utils/assignmentHelper";

async function main() {
  const userId = process.argv[2];
  const targetArg = process.argv[3];
  if (!userId) {
    console.error(
      "Usage: ts-node scripts/assignCasesToUser.ts <userId> [targetCount]",
    );
    process.exit(1);
  }
  const target = targetArg ? parseInt(targetArg, 10) : undefined;

  const ds = new DataSource(ormconfig);
  await ds.initialize();

  const added = await assignCasesToUser(userId, target);
  console.log(`Assigned ${added} new cases to user ${userId}`);

  await ds.destroy();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
