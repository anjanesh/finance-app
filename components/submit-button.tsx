import Button from "./button"
import {useFormStatus} from "react-dom"
import {Loader} from "lucide-react"
import { ComponentProps } from "react" // 1. Import ComponentProps

// 2. Define the interface by extending your base Button component props
// If your Button is a standard HTML button, use ComponentProps<"button">
interface SubmitButtonProps extends ComponentProps<typeof Button>
{
    // Add any custom props here if needed
}

export default function SubmitButton(props: SubmitButtonProps)
{
    const {pending} = useFormStatus();
    return <Button {...props} className={`${props.className} flex items-center justify-center space-x-2`}>
        {pending && <Loader className="animate-spin w-4 h-4" />}
        <span>{props.children}</span>
    </Button>
}