import { z } from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const userSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  middle_name: z.string().optional(),
  last_name: z.string().min(1, "Last name is required"),
  date_of_birth: z
    .string()
    .refine(
      (val) => new Date(val) < new Date(),
      "Date of birth must be in the past"
    ),
  email: z.string().email("Invalid email address"),
  phone_no: z.string().refine(
    (val) =>
      /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/.test(val) || // India
      /^(\+1)?\d{10}$/.test(val), // US
    {
      message: "Phone number must be a valid Indian or US number",
    }
  ),
  password: z
    .string()
    .min(8)
    .refine(
      (val) =>
        /[a-z]/.test(val) &&
        /[A-Z]/.test(val) &&
        /[0-9]/.test(val) &&
        /[^A-Za-z0-9]/.test(val),
      {
        message:
          "Password must include uppercase, lowercase, number, and special character",
      }
    ),
  gender: z.string().min(1, "Gender is required"),
  role_ids: z.array(z.string()).min(1, "At least one role must be selected"),
  profile_image: z
    .any()
    .optional()
    .refine((file) => !file || file instanceof File, {
      message: "Invalid file type",
    })
    .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Only .jpg, .jpeg, .png files are accepted",
    })
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
      message: "File must be less than 10MB",
    }),
});
