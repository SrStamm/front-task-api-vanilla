import "./Button.css";

interface ButtonProps {
  className: string;
  text: string;
  type?: string;
  form?: string;
  onClick?: () => void;
  disabled?: boolean;
}

function Button(props: ButtonProps) {
  return (
    <button
      className={`btn ${props.className}`}
      onClick={props.onClick && props.onClick}
      type={props.type && props.type}
      form={props.form && props.form}
      disabled={props.disabled && props.disabled}
    >
      {props.text}
    </button>
  );
}

export default Button;
