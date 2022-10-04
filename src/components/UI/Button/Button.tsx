import React from "react";
import styles from "./Button.module.scss";
import cn from "classnames";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  appearance?: "primary" | "ghost";
}

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  appearance,
  ...props
}) => {
  return (
    <button
      className={cn(styles.button, className, {
        [styles.primary]: appearance === "primary",
        [styles.ghost]: appearance === "ghost",
      })}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
