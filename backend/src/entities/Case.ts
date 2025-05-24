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
export class Case {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  // New: a human‐readable name for each case
  @Column()
  name!: string;

  // Patient demographics
  @Column("int")
  age!: number;

  @Column()
  sex!: string;

  @Column()
  occupation!: string;

  // Medical history
  @Column({ type: "json", nullable: true })
  immunizations?: string[];

  @Column({ type: "json", nullable: true })
  chronicIllnesses?: string[];

  @Column({ type: "json", nullable: true })
  minorIllnesses?: string[];

  // Family & social
  @Column("text")
  familySocialHistory!: string;

  // Chief complaint
  @Column("text")
  chiefComplaint!: string;

  // Current symptoms
  @Column({ type: "json" })
  currentSymptoms!: string[];

  @OneToMany(() => Assignment, (a) => a.case)
  assignments!: Assignment[];

  @OneToMany(() => UserResponse, (r) => r.case)
  responses!: UserResponse[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
