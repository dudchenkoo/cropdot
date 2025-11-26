import { z } from "zod"

export const carouselFormSchema = z.object({
  topic: z
    .string()
    .trim()
    .min(3, "Topic must be at least 3 characters.")
    .max(200, "Topic cannot exceed 200 characters."),
  platform: z.enum(["linkedin", "instagram", "telegram", "threads"], {
    required_error: "Platform is required.",
    invalid_type_error: "Platform is required.",
  }),
  goal: z
    .string()
    .trim()
    .max(500, "Goal cannot exceed 500 characters.")
    .optional()
    .or(z.literal("")),
  tone: z
    .enum(["professional", "friendly", "bold", "storytelling"], {
      invalid_type_error: "Tone must be one of the provided options.",
    })
    .optional(),
})

export type CarouselFormValues = z.infer<typeof carouselFormSchema>
