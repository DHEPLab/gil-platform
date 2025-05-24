import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Assignment } from "./Assignment";
import { UserResponse } from "./UserResponse";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true, nullable: true })
  email?: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ type: "date", nullable: true })
  dob?: string;

  @Column({ type: "text", nullable: true })
  bio?: string;

  @Column({ type: "text", nullable: true })
  medicalHistory?: string;

  @Column({ type: "text", nullable: true })
  background?: string;

  @Column({ type: "json", nullable: true })
  demographics?: Record<string, any>;

  @Column({ type: "text", nullable: true })
  avatarUrl!: string | null;

  @OneToMany(() => Assignment, (a) => a.user)
  assignments!: Assignment[];

  @OneToMany(() => UserResponse, (r) => r.user)
  responses!: UserResponse[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
