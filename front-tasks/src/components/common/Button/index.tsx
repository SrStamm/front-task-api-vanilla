import "./Button.css";
import type { ReactNode } from "react";

interface ButtonProps {
  className: string;
  text: string;
  type?: "submit" | "reset" | "button";
  form?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

function Button(props: ButtonProps) {
  const { leftIcon, rightIcon, loading, text, ...rest } = props;
  return (
    <button
      className={`btn ${props.className}`}
      onClick={props.onClick}
      type={props.type ?? "button"}
      form={props.form}
      disabled={props.disabled}
    >
      {loading ? (
        "..."
      ) : (
        <>
          {leftIcon && <span className="btn-icon-left">{leftIcon}</span>}
          {text}
          {rightIcon && <span className="btn-icon-right">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}

export default Button;
