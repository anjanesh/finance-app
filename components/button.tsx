import { Size, Variant } from "@/lib/variants";
import { sizes, variants } from "@/lib/variants";

// 2. Extend the standard HTML button props
interface ButtonProps extends React.ComponentProps<"button">
{
    variant?: Variant;
    size?: Size;
}

export default function Button({variant = 'default', size = 'base', className = '', ...props}: ButtonProps)
{
    // Combine classes: Logic + any extra classes passed via props
    const combinedClassName = `${variants[variant]} ${sizes[size]} ${className || ''}`;

    return (<button {...props} className={combinedClassName} />);
}