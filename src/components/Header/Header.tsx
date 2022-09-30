import React from 'react'
import style from './Header.module.scss'

const Header = () => {
  return (
    <header>
        <div className={style.header}>
            <img src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png" alt="logo" />
        </div>
    </header>
  )
}

export default Header