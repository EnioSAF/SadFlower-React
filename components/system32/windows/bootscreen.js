import { useState, useEffect } from 'react';
import TypeIt from "typeit-react";

import styles from '@/styles/system32/windows/bootscreen.module.sass';

const BootsScreen = () => {
    const [showScreen, setShowScreen] = useState(true);
    const [allowKeyPress, setAllowKeyPress] = useState(false);

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
            }, 16000);

            return () => clearTimeout(timer);
        }
    }, []);

    return (
        <div className={`${styles.bootsScreen} ${showScreen ? '' : styles.hidden}`}>

            {/* Logo ASCII */}

            <TypeIt
                options={{
                    strings: ["This will be typed!"],
                    speed: 0.1,
                    waitUntilVisible: false,
                    lifelike : true,
                    cursorChar: " ", //- modify cursor
                }}  
            >
                <pre className={styles.asciiLogo}>                                                              
{`            --:=#**+-==     ===#==-    --+#%*-=:              
          =:%-=:.   .-=-%*-+@=:.  -=*=%#=:    .-+%=             
        .#*=             -+%   -    =@=      .   -%@            
       -#%                 +*===--==*-  -   :+     %@           
       @%     .    =  :+-+*+--:-=-:--+#+=-=:=      *@           
      =%       :+. =*++-=:             :====-=     @@           
      #%         =*++=                     =+-==  #@ ::         
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
                     :=:*#*##+:-=      :--=+++:=. `}
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
                        .type("INITIALISATION", { instant: true })
                        .pause(3000)
                        .break({ delay: 500 }) //-- Retour à la ligne
                        .break({ delay: 500 })
                        .type("UPDATING CONNECTION...") //-- Penser à rajouter des trucs ici
                        .pause(2000) //-- T'as vraiment besoin d'explications ? 
                        .delete(null, { instant: true }) //-- Supprime les caractères (instantanéments)
                        .options({ speed: 1, lifeLike: false })
                        .type("connecting to the : SADFLOWER SERVER")
                        .break()
                        .break()
                        .type("BOOT system sequence")
                        .pause(500)
                        .break()
                        .options({ speed: 0, lifeLike: false })
                        .type("unpacking data preparing injection")
                        .break()
                        .type("data compromised, self check entering")
                        .break()
                        .options({ speed: 1, lifeLike: false })
                        .type("data 1,2,3,4,69,420,42,19,06,98 wrongly 3nC0d€aD")
                        .break()
                        .options({ speed: 0, lifeLike: false })
                        .type("entering recovering processus")
                        .break()
                        .type("breakpoint found {CHECK}")
                        .break()
                        .type("analysing lyrics and [self-care]")
                        .break()
                        .type("notion : [self-care] lacking inside ?")
                        .break()
                        .pause(860)
                        .delete(null, { instant: true })
                        .type("SIGNING IN")
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