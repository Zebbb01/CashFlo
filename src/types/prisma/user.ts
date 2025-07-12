// src/types/prisma/user.ts

import { User as PrismaUser } from "@prisma/client";

export interface User extends PrismaUser {
  // Add other User fields if you typically fetch them with relations
  // e.g., accounts?: Account[]; sessions?: Session[];
}