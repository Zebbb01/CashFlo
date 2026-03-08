import { z } from "zod";

const envSchema = z.object({
    DATABASE_URL: z.string().url("Must be a valid PostgreSQL connection URL"),
    DIRECT_URL: z.string().url("Must be a valid direct connection URL for Prisma migrations").optional(),
    NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET must be defined"),
    NEXTAUTH_URL: z.string().url().optional(),
    NEXT_PUBLIC_SUPABASE_URL: z.string().url("Must be a valid Supabase URL").optional(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "Supabase anon key must be defined").optional(),
});

export const env = envSchema.parse({
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});
