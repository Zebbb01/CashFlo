// src/lib/services/user.service.ts
import { prisma } from "@/lib/prisma"; // Assuming your prisma client is at this path
import bcrypt from "bcryptjs"; // Make sure you have bcryptjs installed: npm install bcryptjs
import { User } from "@prisma/client"; // Import Prisma's User type

export class UserService {
  /**
   * Creates a new user after checking for existing email and hashing the password.
   * @param name The user's name.
   * @param email The user's email address.
   * @param password The user's plain text password.
   * @returns The newly created user object.
   * @throws Error if a user with the email already exists or for other creation failures.
   */
  static async createUser(name: string, email: string, password: string): Promise<User> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    return user;
  }

  /**
   * Finds a user by email.
   * @param email The email of the user to find.
   * @returns The user object or null if not found.
   */
  static async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email }
    });
  }

  /**
   * Finds a user by ID.
   * @param id The ID of the user to find.
   * @returns The user object or null if not found.
   */
  static async findUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id }
    });
  }

  // You would add other user-related methods here (e.g., updateUser, deleteUser, etc.)
  // static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  //   return bcrypt.compare(plainPassword, hashedPassword);
  // }
}