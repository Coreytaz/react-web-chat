import React from 'react'
import ContentLoader, { IContentLoaderProps } from 'react-content-loader'
import styles from './UserBlock.module.scss'

const UserBlockSkeleton: React.FC = (props: JSX.IntrinsicAttributes & IContentLoaderProps) => {
  return (
    <ContentLoader
    className={styles.skeleton}
    speed={2}
    width={200}
    height={45}
    viewBox="0 0 200 45"
    {...props}
  >
    <circle cx="23" cy="22" r="22" />
    <rect x="55" y="10" rx="10" ry="10" width="140" height="23" />
  </ContentLoader>
  )
}

export default UserBlockSkeleton
