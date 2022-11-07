import React from "react";

interface ButtonsProps {
  text: string;
  className?: string;
  disabled?: boolean;
  type?: string;
  onClick?: () => void;
}

const Buttons = ({
  text,
  className,
  disabled,
  type,
  onClick,
}: ButtonsProps) => {
  return (
    <button
      type={"button" || type}
      className={`${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Buttons;
