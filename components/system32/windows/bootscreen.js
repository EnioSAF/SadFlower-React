import { useState, useEffect } from 'react';
import TypeIt from "typeit-react";

import styles from '@/styles/system32/windows/bootscreen.module.sass';

const BootsScreen = () => {
    const [showScreen, setShowScreen] = useState(true);
    const [allowKeyPress, setAllowKeyPress] = useState(false);

    // Fonction pour réinitialiser le cookie
    const resetVisitedCookie = () => {
        localStorage.removeItem('hasVisited');
        document.cookie = "hasVisited=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    };


    const handleKeyPress = () => {
        if (allowKeyPress) {
            setShowScreen(false);
            localStorage.setItem('hasVisited', 'true');
            document.cookie = "hasVisited=true; max-age=31536000";
        }
    };

    useEffect(() => {
        const keyPressHandler = (event) => {
            if (showScreen) {
                handleKeyPress();
            }
        };

        window.addEventListener('keydown', keyPressHandler);
        window.addEventListener('mousedown', keyPressHandler);

        return () => {
            window.removeEventListener('keydown', keyPressHandler);
            window.removeEventListener('mousedown', keyPressHandler);
        };
    }, [showScreen, allowKeyPress]);

    useEffect(() => {
        const hasVisitedCookie = document.cookie
            .split(";")
            .some((item) => item.trim().startsWith("hasVisited="));

        if (hasVisitedCookie) {
            setShowScreen(false);
        } else {
            const timer = setTimeout(() => {
                setAllowKeyPress(true);
            }, 16000); //Temps avant de pouvoir appuiller sur les touches (16secondes)

            return () => clearTimeout(timer);
        }
    }, []);

    return (
        <div className={`${styles.bootsScreen} ${showScreen ? '' : styles.hidden}`}>

            {/* Logo ASCII */}

            <TypeIt
                options={{
                    speed: 0.1,
                    waitUntilVisible: false,
                    lifelike: true,
                    cursorChar: " ", //- modify cursor
                }}
            >
                <pre className={styles.asciiLogo}>
                    {`
             --:=#**+-==     ===#==-    --+#%*-=:              
          =:%-=:.   .-=-%*-+@=:.  -=*=%#=:    .-+%=             
        .#*=             -+%   -    =@=      .   -%@            
       -#%                 +*===--==*-  -   :+     %@           
       @%     .    =  :+-+*+--:-=-:--+#+=-=:=      *@           
      =%       :+. =*++-=:             :====-=     @@           
      #%         =*++=                     =+-==  #@            
      :*=    .. *=#:   +++*.          %:-++  :#.%%= .-=+@-=     
       %#:     @:+    -+:-:@         @@+=+*    +-#.      :=++   
        *%=   #.%      @@@@+          =@@%.     #.@        =**. 
     .=@--=#= @%      +=                         @*          @% 
   :#%-     --%@     #@     ==#@+*#%+=           @=.-=--.    -+ 
  =@=         @--    +@@  =#=:       =@*         #%      .    * 
 +@=       :--=-@        #*            =%       @ @.         ++ 
 @@     -==: :=+=%                             %.@          :#@ 
 #@    :.       ====                         =+==%*.       ==@  
 #@             # ====-                    =+++:  =%=    =*==   
 =+%.          #@   =++====.          .=-+#+=      =**-#*--     
  -++==        @%   .- ===+**++-=*=*##*+=- -*       @=:         
    .=-*%##**#:@@         -- :#==:-:  +*+   =*       *@         
               @@         *   +       %%-    #.      %@         
               :##        #           @%      .     .*#         
                =##       :          @@             @%          
                 :#*=              -@**           :##.          
                  =-@==-      ==:%*- =@+==.   -=##=             
                     :=:*#*##+:-=      :--=+++:=. 
                     `}
                </pre>
            </TypeIt>

            {/* Texte TypeIt */}

            <div className={styles.textBoot}>
                <TypeIt
                    options={{
                        speed: 0,
                        lifelike: false, //- non random typing speed
                        cursorChar: "▮", //- modify cursor
                        html: true, //- display html
                        loop: false, //- stop looping
                        waituntilvisible: true, //- hahem
                        breakLines: false, //- lines printed on top of each others
                    }}
                    getBeforeInit={(instance) => {
                        instance
                            .options({ speed: 50, lifeLike: true })
                            .type("INITIALISATION CORE 1.03(02)", { lifeLike: true })
                            .pause(3000)
                            .delete(null, { instant: true })
                            .options({ speed: 1, lifeLike: false })
                            .pause(860)
                            .type("ADDED :")
                            .pause(2000)
                            .break()
                            .type(" 1.02 : -Changed Articles.exe style + scroll")
                            .pause(2000)
                            .break()
                            .type(" 1.03(02) : -Added touchscreen compatibility + Twitch.exe")
                            .pause(2000)
                            .delete(null, { instant: true })
                            .type("■□□□□□□□□□ 01%", { instant: true })
                            .pause(1000)
                            .delete(null, { instant: true })
                            .type("■□□□□□□□□□ 420%", { instant: true })
                            .pause(42)
                            .delete(null, { instant: true })
                            .type("■■■□□□□□□□ 30%", { instant: true })
                            .pause(1000)
                            .delete(null, { instant: true })
                            .type("■■■■■■□□□□ 69%", { instant: true })
                            .pause(69)
                            .delete(null, { instant: true })
                            .type("■■■■■■■■■■ 100%", { instant: true })
                            .pause(1500)
                            .delete(null, { instant: true })
                            .options({ speed: 1, lifeLike: false, instant: true })
                            .type("PRESS ANY KEY TO ENTER THE :")
                            .break()
                            .options({ speed: 250, lifeLike: true })
                            .type("S A D F L O W E R  W O R L D")
                        return instance;
                    }}
                />
            </div>
        </div>
    );
};

export default BootsScreen;