import "./Button.css";

interface ButtonProps {
  className: string;
  text: string;
  type?: string;
  form?: string;
  onClick?: () => void;
}

function Button(props: ButtonProps) {
  return (
    <button
      className={`btn ${props.className}`}
      onClick={props.onClick && props.onClick}
      type={props.type && props.type}
      form={props.form && props.form}
    >
      {props.text}
    </button>
  );
}

export default Button;
