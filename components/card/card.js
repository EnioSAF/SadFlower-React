import Image from 'next/image';
import Button, { IconTypes } from '../button/button';
import ConditionalRender from './conditional-renderer';
import styles from './card.module.sass';

const Card = (props) => (
    <div className={`${styles.card_wrap} ${props.className || ''}`}>
      <div className={styles.card}>
        <div className={styles.card_imageWrap}>
            <div className={styles.card_image}>
                <Image src="/1.jpg" alt="legang" fill={true} />
            </div>
        </div>
        <div className={styles.card_content}>
          <ConditionalRender condition={props.label}>
            <div className={`${styles.card_label} h6 mb-10 c-orange`}>${props.label}</div>
          </ConditionalRender>
            <div className={`${styles.card_title} h3 mb-20`}>Enio and the Gang</div>
            <p className={`${styles.card_summary} fw-600`}>Purus in mollis nunc sed id semper risus in hendrerit. Odio euismod lacinia at quis risus sed vulputate odio. Consectetur adipiscing elit pellentesque habitant.</p>
            <Button href="#" icon={IconTypes.ARROW_RIGHT}>Donne-m'en plus</Button>
        </div>
      </div>
    </div>
);

export default Card;