import z from 'zod';

export const movieSchemaValidation = z.object({
    name: z.string(),
    releaseDate: z.string(),
    description: z.string(),
    genre: z.string(),
    image: z.string()
});

export const theatreSchemaValidation = z.object({
    theatreName: z.string(),
    row: z.number(),
    column: z.number()
});
