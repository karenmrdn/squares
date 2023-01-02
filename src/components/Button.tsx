import React from "react";

type ButtonProps = {
  title: string;
  className?: string;
};

export const Button: React.FC<ButtonProps> = ({ title, className, ...restProps }) => {
  return (
    <button
      className={`rounded bg-primary-500 py-1.5 px-4 font-bold uppercase text-white transition-colors hover:bg-primary-700 ${
        className ?? ""
      }`}
      {...restProps}
    >
      {title}
    </button>
  );
};
