import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Case } from "./Case";

@Entity()
export class Assignment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, (u) => u.assignments, { onDelete: "CASCADE" })
  user!: User;

  @ManyToOne(() => Case, (c) => c.assignments, { onDelete: "CASCADE" })
  case!: Case;

  @CreateDateColumn()
  assignedAt!: Date;
}
