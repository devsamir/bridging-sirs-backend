import { IsDefined, IsEmail, MinLength } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";

@Entity()
@Unique("Username", ["username"])
@Unique("Email", ["email"])
export default class User {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  @IsDefined({ message: "Username Tidak Boleh Kosong" })
  @MinLength(1, { message: "Username Harus Diisi" })
  username: string;
  @Column()
  @IsDefined({ message: "Password Tidak Boleh Kosong" })
  password: string;
  @Column()
  @IsDefined({ message: "Email Tidak Boleh Kosong" })
  @IsEmail({}, { message: "Format Email Tidak Valid" })
  email: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @Column("boolean", { default: true, select: false })
  active: boolean;
}
