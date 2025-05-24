import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Case } from "./Case";

@Entity()
export class UserResponse {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, (u) => u.responses, { onDelete: "CASCADE" })
  user!: User;

  @ManyToOne(() => Case, (c) => c.responses, { onDelete: "CASCADE" })
  case!: Case;

  @Column()
  isReal!: boolean;

  @CreateDateColumn()
  respondedAt!: Date;
}
