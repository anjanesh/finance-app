import { FieldError } from "react-hook-form";

interface FormErrorProps {
    // FieldError is the standard type for a single input's error state
    error?: FieldError | string;
}
export default function FormError({ error }: FormErrorProps)
{
    if (!error) return null;

    // If it's a FieldError object, get the .message; otherwise, use the string
    const message = typeof error === 'string' ? error : error.message;

    return error ? (
        <p className="mt-1 text-red-500 text-sm">
            {message}
        </p>
    ) : null;
}