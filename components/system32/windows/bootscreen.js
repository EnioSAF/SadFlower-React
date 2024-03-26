import { useState, useEffect, useRef } from "react";
import TypeIt from "typeit-react";

import styles from "@/styles/system32/windows/bootscreen.module.sass";

const packageJson = require("/package.json");

const BootsScreen = () => {
  const [showScreen, setShowScreen] = useState(true);
  const [allowKeyPress, setAllowKeyPress] = useState(false);
  const bootsScreenRef = useRef(null);
  const initMusic = useRef(null);
  const initSound = useRef(null);

  useEffect(() => {
    initMusic.current = new Audio(
      "/Sound/Music/sadflower-initialisation(withvoice).mp3",
    );
    initSound.current = new Audio("/Sound/Fx/startupsound.mp3");
  }, []);

  useEffect(() => {
    const checkFirstVisit = () => {
      const isFirstVisitEnabled = true;

      if (isFirstVisitEnabled) {
        const storedVersion = localStorage.getItem("version");

        if (storedVersion !== packageJson.version) {
          // Utilisez la version à partir de package.json
          localStorage.setItem("version", packageJson.version); // Stockez la version à partir de package.json
          localStorage.removeItem("hasVisited");
        }

        const hasVisited = localStorage.getItem("hasVisited");

        if (!hasVisited) {
          const timer = setTimeout(() => setAllowKeyPress(true), 16000);

          localStorage.setItem("hasVisited", "true");
          return () => clearTimeout(timer);
        } else {
          setShowScreen(false);
        }
      } else {
        setShowScreen(false);
      }
    };

    const cleanup = checkFirstVisit();
    return cleanup;
  }, []);

  const handleInteraction = () => {
    if (allowKeyPress) {
      setShowScreen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleInteraction);
    bootsScreenRef.current.addEventListener("click", handleInteraction);
    bootsScreenRef.current.addEventListener("touchstart", handleInteraction);

    return () => {
      document.removeEventListener("keydown", handleInteraction);
      if (bootsScreenRef.current) {
        bootsScreenRef.current.removeEventListener("click", handleInteraction);
        bootsScreenRef.current.removeEventListener(
          "touchstart",
          handleInteraction,
        );
      }
    };
  }, [allowKeyPress]);

  return (
    showScreen && (
      <div
        ref={bootsScreenRef}
        className={`${styles.bootsScreen} ${showScreen ? "" : styles.hidden}`}
      >
        {/* Logo ASCII */}

        <TypeIt
          options={{
            speed: 0.1,
            waitUntilVisible: false,
            lifelike: true,
            cursorChar: " ",
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
              lifelike: false,
              cursorChar: "▮",
              html: true,
              loop: false,
              waituntilvisible: true,
              breakLines: false,
            }}
            getBeforeInit={(instance) => {
              instance
                .exec(() => {
                  console.log("Attempting to play audio");
                  if (initSound.current) {
                    console.log("Sound is ready, playing...");
                    initSound.current.volume = 0.1; // Baisser le volume de 50%
                    initSound.current.play();
                  }
                })
                .options({ speed: 50, lifeLike: true })
                .type("INITIALISATION SADFLOWER CORE 1.0.1", { lifeLike: true })
                .break()
                .pause(3000)
                .delete(null, { instant: true })
                .options({ speed: 1, lifeLike: false })
                .pause(860)
                .type("ADDED :")
                .pause(2000)
                .break()
                .type(
                  " 1.0.0 : -Sadflower™ HUB first update !",
                )
                .break()
                .type(" 1.0.1 : -Added SadGotchu to created users !")
                .break()
                .type("(for registered user only)")
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
                .exec(() => {
                  console.log("Attempting to play audio");
                  if (initMusic.current) {
                    console.log("Audio is ready, playing...");
                    initMusic.current.volume = 0.2; // Baisser le volume de 50%
                    initMusic.current.play();
                  }
                })
                .pause(1500)
                .delete(null, { instant: true })
                .options({ speed: 1, lifeLike: false, instant: true })
                .type("PRESS ANY KEY TO ENTER THE :")
                .break()
                .options({ speed: 250, lifeLike: true })
                .type("S A D F L O W E R  W O R L D");
              return instance;
            }}
          />
        </div>
      </div>
    )
  );
};

export default BootsScreen;
