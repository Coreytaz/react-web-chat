import React from 'react'
import ContentLoader, { IContentLoaderProps } from 'react-content-loader'
import styles from './UserBlock.module.scss'

const UserBlockReqSkeleton: React.FC = (props: JSX.IntrinsicAttributes & IContentLoaderProps) => {
  return (
    <ContentLoader
    className={styles.skeleton}
    speed={2}
    width={470}
    height={76}
    viewBox="0 0 470 80"
    backgroundColor="#a3a3a3"
    foregroundColor="#c3c1c1"
    {...props}
  >
    <circle cx="40" cy="40" r="40" />
    <rect x="90" y="30" rx="10" ry="10" width="97" height="30" />
    <rect x="360" y="20" rx="15" ry="15" width="110" height="52" />
  </ContentLoader>
  )
}

export default UserBlockReqSkeleton
