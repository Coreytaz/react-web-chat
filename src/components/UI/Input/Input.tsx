import { forwardRef, useId, type InputHTMLAttributes } from 'react'
import cn from 'classnames'
import styles from './Input.module.scss'
const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className, id, ...props },
  ref
) {
  const generated = useId()
  const inputId = id ?? generated
  return (
    <div className={cn(className, styles.form)}>
      <input {...props} className={styles.input} id={inputId} ref={ref} placeholder=" " />
      <label className={styles.labelName} htmlFor={inputId}>
        <span className={styles.contentName}>{props.placeholder}</span>
      </label>
    </div>
  )
})
export default Input
