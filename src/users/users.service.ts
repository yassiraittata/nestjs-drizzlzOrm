import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as argon from 'argon2';
import { eq } from 'drizzle-orm';

import { DrizzleAsyncProvider } from '../drizzle/drizzle.provider';
import * as schema from '../drizzle/schema';
import { CreateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: BetterSQLite3Database<typeof schema>,
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.db.query.users.findFirst({
      where: eq(schema.users.email, dto.email),
    });

    if (user) throw new BadRequestException('User already exists!');

    const hash = await argon.hash(dto.password);

    const newUser = this.db
      .insert(schema.users)
      .values({ name: dto.name, email: dto.email, password: hash });

    return newUser;
  }

  async findByEmail(email: string) {
    const user = await this.db.query.users.findFirst({
      where: eq(schema.users.email, email),
    });

    if (!user) return undefined;

    return user;
  }

  async findById(id: number) {
    const user = await this.db.query.users.findFirst({
      where: eq(schema.users.id, id),
    });

    if (!user) return undefined;

    return user;
  }

  async updateUser(data: Partial<CreateUserDto>) {
    const user = await this.db.update(schema.users).set({ ...data });

    return user;
  }

  async deleteUser(id: number) {
    await this.db.delete(schema.users).where(eq(schema.users.id, id));
  }
}
