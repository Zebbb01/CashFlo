// src/app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/lib/services/user.service"; // Import the UserService
import { signupSchema } from "@/lib/validations/user.validation"; // Import the signupSchema
import { ZodError } from "zod"; // Import ZodError explicitly

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Validate the request body using the Zod schema
    const validatedData = signupSchema.parse(body);

    const { name, email, password } = validatedData;

    // Delegate the user creation logic to the UserService
    const newUser = await UserService.createUser(name, email, password);

    return NextResponse.json(
      { message: "User created successfully", userId: newUser.id },
      { status: 201 }
    );
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    // Handle specific errors thrown by the UserService
    if (error instanceof Error) {
      if (error.message.includes("User with this email already exists")) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
    }

    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}