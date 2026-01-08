import "./Button.css";

interface ButtonProps {
  className: string;
  text: string;
  type?: "submit" | "reset" | "button";
  form?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

function Button(props: ButtonProps) {
  return (
    <button
      className={`btn ${props.className}`}
      onClick={props.onClick && props.onClick}
      type={props.type ?? "button"}
      form={props.form && props.form}
      disabled={props.disabled && props.disabled}
    >
      {props.loading ? "..." : props.text}
    </button>
  );
}

export default Button;
