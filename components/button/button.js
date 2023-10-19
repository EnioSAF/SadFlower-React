import Link from 'next/link'
import styles from './button.module.sass';

export const IconTypes = {
    ARROW_RIGHT: 'ARROW_RIGHT'
};

const Button = (props) => {
    if (props.href) {
        return (
        <Link className={styles.button} href={props.href}>
        {props.children}
        <Button.Icon iconType={props.icon} />
        </Link>
        );
    }

    return <button className={styles.button}>{props.children}</button>
};

Button.Icon = ({ iconType }) => {
    if (iconType === 'ARROW_RIGHT') {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
            <path fill="currentColor" d="m18.707 12.707-3 3a1 1 0 0 1-1.414-1.414L15.586 13H6a1 1 0 0 1 0-2h9.586l-1.293-1.293a1 1 0 0 1 1.414-1.414l3 3a1 1 0 0 1 0 1.414z" data-name="Right"/>
        </svg>
    );
  }

  return null;
};

Button.Icon.displayName = 'Icon';

export default Button
