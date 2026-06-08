import styles from './header.module.css';
import placeholder4 from './../assets/images/4.png'

export default function Header() {
    return <>
        <div className={styles.HeaderText}>Amphion</div>
        <div className={styles.HeaderInput}><input type="text" name="" id="" /></div>
        <div><img src={placeholder4} style={{ filter: "invert(1)" }} alt="" width="50px" height="50px" /></div>
    </>
}