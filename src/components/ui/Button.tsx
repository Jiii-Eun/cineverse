import { Pressable, type PressableProps } from "react-native";

import { Text } from "@/components/ui/Text";

interface ButtonProps extends PressableProps {
  label: string;
  variant?: "primary" | "outline" | "ghost";
  size?: "default" | "compact";
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-primary active:opacity-80",
  outline: "border border-primary/40 bg-transparent active:opacity-80",
  ghost: "bg-elevated active:opacity-80",
};

const labelClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "text-foreground",
  outline: "text-primary",
  ghost: "text-foreground",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  default: "min-h-[44px] px-4 py-3",
  compact: "min-h-7 px-3 py-2",
};

export function Button({
  label,
  variant = "primary",
  size = "default",
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      className={`items-center justify-center rounded-button ${sizeClasses[size]} ${variantClasses[variant]} ${disabled ? "opacity-50" : ""} ${className}`}
      {...props}
    >
      <Text
        className={`font-semibold ${size === "compact" ? "text-sm" : ""} ${labelClasses[variant]}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
