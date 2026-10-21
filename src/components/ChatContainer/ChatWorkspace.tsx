import AsideFriends from '../AsideFriends/AsideFriends'
import ChatContainer from './ChatContainer'
import styles from '../../style/Page/Home.module.scss'
export default function ChatWorkspace() {
  return (
    <div className={styles.inbox}>
      <AsideFriends />
      <main>
        <ChatContainer />
      </main>
    </div>
  )
}
