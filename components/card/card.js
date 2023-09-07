import Image from 'next/image';
import Button from '../button/button';
import styles from './card.module.sass';

const Card = () => (
    <div className={styles.card}>
        <div className={styles.card_imageWrap}>
            <div className={styles.card_image}>
                <Image src="/1.jpg" alt="legang" fill={true} />
            </div>
        </div>
        <div className={styles.card_content}>
            <div className={`${styles.card_label} h6 mb-10 c-orange`}>Info</div>
            <div className={`${styles.card_title} h3 mb-20`}>Enio and the Gang</div>
            <p className={`${styles.card_summary} fw-600`}>Purus in mollis nunc sed id semper risus in hendrerit. Odio euismod lacinia at quis risus sed vulputate odio. Consectetur adipiscing elit pellentesque habitant. Viverra suspendisse potenti nullam ac tortor. Leo urna molestie at elementum eu facilisis sed odio morbi. Odio eu feugiat pretium nibh ipsum. Auctor augue mauris augue neque gravida in. Purus in mollis nunc sed id semper risus in hendrerit. Ut aliquam purus sit amet luctus venenatis lectus. Sagittis vitae et leo duis. Tellus orci ac auctor augue mauris.</p>
            <Button href="#">Donne-m'en plus</Button>
        </div>
    </div>
);

export default Card;