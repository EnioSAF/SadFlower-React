
// Configuration pour la section "Présentation" - Vibes rétro-gaming
export const retroGamingParticles = {
    particles: {
        number: {
            value: 50,
            density: {
                enable: true,
                value_area: 800,
            },
        },
        shape: {
            type: "circle", // Change cela en "image" et fournis des images de vieux jeux si tu veux
        },
        color: {
            value: "#ff0000",
        },
        opacity: {
            value: 0.5,
            random: false,
            anim: {
                enable: false,
            },
        },
        size: {
            value: 3,
            random: true,
        },
        line_linked: {
            enable: false,
        },
        move: {
            enable: true,
            speed: 2,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "bounce",
            bounce: false,
        },
    },
    interactivity: {
        detectsOn: "canvas",
        events: {
            onhover: {
                enable: true,
                mode: "repulse",
            },
            onclick: {
                enable: true,
                mode: "push",
            },
        },
        modes: {
            repulse: {
                distance: 100,
                duration: 0.4,
            },
            push: {
                particles_nb: 4,
            },
        },
    },
    retina_detect: true,
};

// Configuration pour la section "ChatGPT" - Effet Matrice
export const matrixParticles = {
    particles: {
        number: {
            value: 100,
            density: {
                enable: true,
                value_area: 800,
            },
        },
        color: {
            value: "#00ff00",
        },
        shape: {
            type: "char",
            character: {
                value: "A",
                font: "Pixelify Sans",
                style: "",
                weight: "500",
            },
        },
        opacity: {
            value: 0.8,
            random: true,
        },
        size: {
            value: 16,
            random: { enable: true, minimumValue: 10 },
        },
        move: {
            enable: true,
            speed: 3,
            direction: "bottom",
            random: false,
            straight: false,
            out_mode: "out",
        },
    },
    interactivity: {
        detectsOn: "canvas",
        events: {
            onhover: {
                enable: false,
            },
            onclick: {
                enable: false,
            },
        },
    },
    retina_detect: true,
};

// Configuration pour la section "Expérience" - Ambiance jeu de cartes
export const cardGameParticles = {
    particles: {
        number: {
            value: 30,
            density: {
                enable: true,
                value_area: 800,
            },
        },
        shape: {
            type: "image",
            image: {
                src: "/path/to/card/icon.png", // Change le chemin vers ton icône de carte
                width: 100,
                height: 100,
            },
        },
        color: {
            value: "#CCC",
        },
        opacity: {
            value: 0.7,
            random: false,
        },
        size: {
            value: 20,
            random: true,
        },
        move: {
            enable: true,
            speed: 5,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
        },
    },
    interactivity: {
        detectsOn: "canvas",
        events: {
            onhover: {
                enable: true,
                mode: "bubble",
            },
            onclick: {
                enable: true,
                mode: "repulse",
            },
        },
        modes: {
            bubble: {
                distance: 400,
                size: 40,
                duration: 2,
                opacity: 8,
            },
            repulse: {
                distance: 200,
                duration: 0.4,
            },
        },
    },
    retina_detect: true,
};

// Configuration pour la section "Timeline" - Fin classique et élégante
