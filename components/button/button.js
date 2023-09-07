import Link from 'next/link'
import styles from './button.module.sass';

const Button = (props) => {
    if (props.href) {
        return <Link className={styles.button} href={props.href}>{props.children}</Link>
    }

    return <button className={styles.button}>{props.children}</button>
};

export default Button
