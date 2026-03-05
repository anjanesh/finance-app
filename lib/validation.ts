import {z} from "zod";
import {categories, dateRangeValues, types} from "./consts";

export const settingsSchema = z.object({
    fullName: z.string().min(2),
    defaultView: z.enum(dateRangeValues),
});

export const transactionSchema = z.object({
    type: z.enum(types),
    // 1. Cast 'val' to string to access .length safely
    category: z.preprocess(
        (val) => (typeof val === "string" && val.length > 0 ? val : undefined),
        z.string().optional()
    ),
    amount: z.coerce.number().min(1, { message: "Amount must be at least 1" }),
    description: z.string().optional(),
    created_at: z.string().refine(
        val => !isNaN(Date.parse(val)),
        {
            message: "Date needs to contain a valid date"
        }
    )
}).refine((data) =>
    {
        if (data.type === "Expense")
        {
            // 2. Use 'as any' or cast categories to string[] to bypass the strict inclusion check
            return data.category !== undefined && (categories as readonly string[]).includes(data.category);
        }
        return true;
    },
    {
        path: ["category"],
        message: "Category is required for Expense"
    }
);

// Drive your FormValues type from the Schema to ensure it matches exactly
export type TransactionFormValues = z.infer<typeof transactionSchema>;