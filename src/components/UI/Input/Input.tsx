/* eslint-disable react/display-name */
import React, { ForwardedRef } from 'react'
import styles from './Input.module.scss'
import cn from 'classnames'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef(({ className, ...props }: InputProps, ref: ForwardedRef<HTMLInputElement>): JSX.Element => {
  return (
    <div className={cn(className, styles.form)}>
      <input className={cn(styles.input)} {...props} placeholder="" ref={ref}/>
      <label className={cn(styles.labelName)} htmlFor={props.name}>
        <span className={cn(styles.contentName)}>{props.placeholder}</span>
      </label>
    </div>
  )
})

export default Input
