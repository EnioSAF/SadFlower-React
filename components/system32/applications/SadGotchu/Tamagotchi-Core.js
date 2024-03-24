import React from 'react';
import Image from 'next/image';

import styles from "styles/system32/applications/SadGotchu/tamagotchi.module.sass";

const TamagotchiCore = ({ closing }) => {
    return (
        <div className={`${styles.tamagotchiCore} ${closing ? styles.closingAnimation : ''}`}>
                    <Image
                        className={'Tamagotchi'}
                        src={'/SadGotchu/tamas/ado thug sadgotchu.png'}
                        alt='tamagotchi'
                        width='447'
                        height='360'
                        onDragStart={(e) => e.preventDefault()}
                    />
        </div>

    );
};

export default TamagotchiCore;