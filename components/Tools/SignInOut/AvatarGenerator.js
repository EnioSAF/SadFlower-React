// Fonction pour générer une couleur aléatoire
const randomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

// Fonction pour sélectionner un élément aléatoire d'un array
const randomElement = (array) => array[Math.floor(Math.random() * array.length)];

const generateRandomAvatar = () => {
  // Création des arrays pour chaque type d'élément de l'avatar
  const hairTypes = Array.from({ length: 30 }, (_, i) => `hair-${i + 1}`).concat('none');
  const headAccessoryTypes = Array.from({ length: 16 }, (_, i) => `head-accessory-${i + 1}`).concat('none');
  const eyeTypes = ['eyes-1', 'eyes-2'];
  const eyesAccessoryTypes = Array.from({ length: 10 }, (_, i) => `eyes-accessory-${i + 1}`).concat('none');
  const earAccessoryTypes = Array.from({ length: 5 }, (_, i) => `ear-accessory-${i + 1}`).concat('none');
  const noseTypes = ['nose-1', 'nose-2', 'nose-3'];
  const beardTypes = Array.from({ length: 10 }, (_, i) => `beard-${i + 1}`).concat('none');
  const mouthTypes = ['mouth-1', 'mouth-2', 'mouth-3', 'mouth-4'];
  const mouthAccessoryTypes = Array.from({ length: 4 }, (_, i) => `mouth-accessory-${i + 1}`).concat('none');
  const neckAccessoryTypes = Array.from({ length: 5 }, (_, i) => `neck-accessory-${i + 1}`).concat('none');

  // Sélection aléatoire des éléments et des couleurs
  return {
    baseColor: randomColor(),
    hair: randomElement(hairTypes),
    headAccessory: randomElement(headAccessoryTypes),
    eyes: randomElement(eyeTypes),
    eyesAccessory: randomElement(eyesAccessoryTypes),
    earAccessory: randomElement(earAccessoryTypes),
    nose: randomElement(noseTypes),
    beard: randomElement(beardTypes),
    mouth: randomElement(mouthTypes),
    mouthAccessory: randomElement(mouthAccessoryTypes),
    neckAccessory: randomElement(neckAccessoryTypes),
    hairColor: randomColor(),
    eyesColor: randomColor(),
    headAccessoryColor: randomColor(),
    eyesAccessoryColor: randomColor(),
    earAccessoryColor: randomColor(),
    mouthColor: randomColor(),
    mouthAccessoryColor: randomColor(),
    neckAccessoryColor: randomColor(),
  };
};

export default generateRandomAvatar