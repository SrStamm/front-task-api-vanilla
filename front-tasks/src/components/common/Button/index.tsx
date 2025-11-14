import "./Button.css";

interface ButtonProps {
  className: string;
  text: string;
  onClick?: () => void;
}

function Button(props: ButtonProps) {
  return (
    <button
      className={`btn ${props.className}`}
      onClick={props.onClick && props.onClick}
    >
      {props.text}
    </button>
  );
}

export default Button;
