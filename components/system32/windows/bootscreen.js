import { useState, useEffect } from 'react';
import TypeIt from "typeit-react";

import styles from '@/styles/system32/windows/bootscreen.module.sass';

const BootsScreen = () => {
    const [showScreen, setShowScreen] = useState(true);
    const [allowKeyPress, setAllowKeyPress] = useState(false);

    useEffect(() => {
        const isFirstVisitEnabled = process.env.FIRST_VISIT_ENABLED === 'true';
    
        if (!isFirstVisitEnabled) {
            setShowScreen(false);
            return;
        }
    
        // Ici, tu peux ajouter du code pour gérer l'affichage du bootscreen
        // Tu peux utiliser une variable de session ou un cookie pour suivre la première visite
        const hasVisited = sessionStorage.getItem('hasVisited');
    
        if (hasVisited === null) {
            // Affiche le bootscreen
            const timer = setTimeout(() => {
                setAllowKeyPress(true);
            }, 16000); // Temps avant de pouvoir appuyer sur les touches (16 secondes)
        
            // Enregistre la visite dans la session
            sessionStorage.setItem('hasVisited', 'true');
        
            return () => clearTimeout(timer);
        } else {
            // L'utilisateur a déjà visité le site avant ce déploiement
            setShowScreen(false);
        }

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
                            .type("INITIALISATION CORE 1.04", { lifeLike: true })
                            .pause(3000)
                            .delete(null, { instant: true })
                            .options({ speed: 1, lifeLike: false })
                            .pause(860)
                            .type("ADDED :")
                            .pause(2000)
                            .break()
                            .type(" 1.04 : -Phone Compatibility updated + Bootscreen updated")
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