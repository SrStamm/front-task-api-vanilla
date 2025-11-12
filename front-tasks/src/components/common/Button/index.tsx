import "./Button.css";

interface ButtonProps {
  className: string;
  text: string;
}

function Button(props: ButtonProps) {
  return <button className={`btn ${props.className}`}> {props.text}</button>;
}

export default Button;
