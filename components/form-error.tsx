import { FieldError } from "react-hook-form";

interface FormErrorProps {
    // FieldError is the standard type for a single input's error state
    error?: FieldError;
}
export default function FormError({ error }: FormErrorProps)
{
    return error ? (
        <p className="mt-1 text-red-500 text-sm">
            {error.message}
        </p>
    ) : null;
}