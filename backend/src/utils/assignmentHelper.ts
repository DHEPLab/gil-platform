import { AppDataSource } from "../index";
import { Assignment } from "../entities/Assignment";
import { Case } from "../entities/Case";
import { User } from "../entities/User";
import { faker } from "@faker-js/faker";

const userRepo = () => AppDataSource.getRepository(User);
const caseRepo = () => AppDataSource.getRepository(Case);
const assignRepo = () => AppDataSource.getRepository(Assignment);

/**
 * Tops the given user up to `targetCount` assignments,
 * never re-assigning a case they already have.
 * Returns how many new assignments were created.
 */
export async function assignCasesToUser(
  userId: string,
  targetCount: number = 20,
): Promise<number> {
  const user = await userRepo().findOne({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  const existing = await assignRepo().find({
    where: { user: { id: userId } },
    relations: ["case"],
  });
  const haveCount = existing.length;
  if (haveCount >= targetCount) return 0;

  const need = targetCount - haveCount;
  const allCases = await caseRepo().find();
  const assignedIds = new Set(existing.map((a) => a.case.id));
  const available = allCases.filter((c) => !assignedIds.has(c.id));
  if (available.length === 0) return 0;

  // use faker.number.int in v8+
  const toAssign = faker.helpers.arrayElements(available, need);
  const assigns = toAssign.map((c) => assignRepo().create({ user, case: c }));
  await assignRepo().save(assigns);
  return assigns.length;
}
