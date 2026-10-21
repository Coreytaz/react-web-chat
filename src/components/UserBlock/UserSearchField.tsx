import { useRef } from 'react'
import Input from '../UI/Input/Input'
import Close from '../../assets/close.svg?react'
import cn from 'classnames'
import styles from './UserSearchField.module.scss'
interface UserSearchFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
  className: string
  clearClassName: string
}
export default function UserSearchField({
  value,
  onChange,
  placeholder,
  className,
  clearClassName
}: UserSearchFieldProps) {
  const input = useRef<HTMLInputElement>(null)
  return (
    <div className={className}>
      <Input
        name="Поиск"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        ref={input}
        autoComplete="off"
      />
      {value && (
        <button
          type="button"
          aria-label="Очистить поиск"
          className={cn(styles.clear, clearClassName)}
          onClick={() => {
            onChange('')
            input.current?.focus()
          }}
        >
          <Close />
        </button>
      )}
    </div>
  )
}
