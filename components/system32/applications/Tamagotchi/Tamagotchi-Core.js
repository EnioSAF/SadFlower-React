import React from 'react';
import Image from 'next/image';

import styles from "styles/system32/applications/Tamagotchi/tamagotchi.module.sass";
const TamagotchiCore = ({ closing }) => {
    return (
        <div className={`${styles.tamagotchiCore} ${closing ? styles.closingAnimation : ''}`}>
                    <Image
                        className={'Tamagotchi'}
                        src={'/SadGotchu/ado thug sadgotchu.png'}
                        alt='tamagotchi'
                        width='447'
                        height='360'
                    />
        </div>

    );
};

export default TamagotchiCore;
