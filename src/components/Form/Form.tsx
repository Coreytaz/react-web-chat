import React from 'react'

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode
}

const Form: React.FC<FormProps> = ({ children, className, ...props }) => {
  return (
    <form action="" className={className} {...props}>
      {children}
    </form>
  )
}

export default Form
