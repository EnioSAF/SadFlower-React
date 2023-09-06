import Image from 'next/image';
import styles from './card.module.sass';

const Card = () => (
    <div className={styles.card}>
        <div className={styles.card_imageWrap}>
            <div className={styles.card_image}>
                <Image src="/1.jpg" alt="legang" fill={true} />
        </div>
        <div className={styles.card_content}>
            <div className={styles.card_label}>Enio and the Gang</div>
            <div className={`${styles.card_title} h3`}>Purus in mollis nunc sed id semper risus in hendrerit. Odio euismod lacinia at quis risus sed vulputate odio.</div>
        </div>
    </div>
);

export default Card;