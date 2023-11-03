import React from 'react';
import { Rnd } from 'react-rnd';
import Header from '@/components/header';
import "@/styles/styles.sass";

function About() {
    return (
        <Rnd
            default={{
                x: 0,
                y: 0,
                width: 320,
                height: 200,
            }}
            minWidth={200}
            minHeight={150}
            style={{ border: '2px solid #000' }}
        >
            <div className="fenetre-article">
                <h2>Titre de l'article</h2>
                <hr />
                <p>Contenu de l'article...</p>
            </div>
        </Rnd>
    );
};

export default About;