import React from "react";

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
}

const Form: React.FC<FormProps> = ({ children, className }) => {
  return (
    <form action="" className={className}>
      {children}
    </form>
  );
};

export default Form;
