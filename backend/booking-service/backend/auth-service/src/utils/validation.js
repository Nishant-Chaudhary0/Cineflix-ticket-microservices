import z, { email, string } from 'zod';

export const userSchemaValidation = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string().min(6)
});

export const loginValidation = z.object({
    email: string().email(),
    password: string().min(6)
});