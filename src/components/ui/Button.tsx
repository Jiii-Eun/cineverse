import {
  Pressable,
  type PressableProps,
  type PressableStateCallbackType,
} from "react-native";

import { Text } from "@/components/ui/Text";

interface ButtonProps extends PressableProps {
  label: string;
  variant?: "primary" | "outline" | "ghost" | "destructive";
  size?: "default" | "compact";
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-primary active:opacity-80",
  outline: "border border-primary/40 bg-transparent active:opacity-80",
  ghost: "bg-elevated active:opacity-80",
  destructive: "active:opacity-80",
};

const labelClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "text-foreground",
  outline: "text-primary",
  ghost: "text-foreground",
  destructive: "",
};

const destructiveColor = "#EF4444";
const destructiveStyle = {
  borderWidth: 1,
  borderColor: destructiveColor,
  backgroundColor: "rgba(239, 68, 68, 0.12)",
} as const;

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
  style,
  onPress,
  ...props
}: ButtonProps) {
  const resolvedStyle =
    typeof style === "function"
      ? (state: PressableStateCallbackType) => [
          variant === "destructive" ? destructiveStyle : undefined,
          style(state),
        ]
      : [variant === "destructive" ? destructiveStyle : undefined, style];

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      className={`items-center justify-center rounded-button ${sizeClasses[size]} ${variantClasses[variant]} ${disabled ? "opacity-50" : ""} ${className}`}
      style={resolvedStyle}
      {...props}
    >
      <Text
        className={`font-semibold ${size === "compact" ? "text-sm" : ""} ${labelClasses[variant]}`}
        style={
          variant === "destructive" ? { color: destructiveColor } : undefined
        }
      >
        {label}
      </Text>
    </Pressable>
  );
}
