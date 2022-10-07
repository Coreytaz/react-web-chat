import React from 'react'
import styles from './Input.module.scss'
import cn from 'classnames'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <div className={cn(className, styles.form)}>
      <input className={cn(styles.input)} {...props} placeholder="" />
      <label className={cn(styles.labelName)} htmlFor={props.name}>
        <span className={cn(styles.contentName)}>{props.placeholder}</span>
      </label>
    </div>
  )
}

export default Input
