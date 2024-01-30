import React, { useState } from "react";
import { PixelArtCard } from "react-pixelart-face-card";

const EditAvatar = ({ initialAvatar, onSave }) => {
  const [avatar, setAvatar] = useState(initialAvatar);

  // Listes des différents éléments de l'avatar
  const hairTypes = Array.from(
    { length: 30 },
    (_, i) => `hair-${i + 1}`,
  ).concat("none");
  const headAccessoryTypes = Array.from(
    { length: 16 },
    (_, i) => `head-accessory-${i + 1}`,
  ).concat("none");
  const eyeTypes = ["eyes-1", "eyes-2"];
  const eyesAccessoryTypes = Array.from(
    { length: 10 },
    (_, i) => `eyes-accessory-${i + 1}`,
  ).concat("none");
  const earAccessoryTypes = Array.from(
    { length: 5 },
    (_, i) => `ear-accessory-${i + 1}`,
  ).concat("none");
  const noseTypes = ["nose-1", "nose-2", "nose-3"];
  const beardTypes = Array.from(
    { length: 10 },
    (_, i) => `beard-${i + 1}`,
  ).concat("none");
  const mouthTypes = ["mouth-1", "mouth-2", "mouth-3", "mouth-4"];
  const mouthAccessoryTypes = Array.from(
    { length: 4 },
    (_, i) => `mouth-accessory-${i + 1}`,
  ).concat("none");
  const neckAccessoryTypes = Array.from(
    { length: 5 },
    (_, i) => `neck-accessory-${i + 1}`,
  ).concat("none");

  // Fonction pour mettre à jour une partie spécifique de l'avatar
  const updateAvatarPart = (part, value) => {
    setAvatar({ ...avatar, [part]: value });
  };

  // Fonction pour mettre à jour la couleur d'une partie spécifique de l'avatar
  const updateAvatarColor = (part, value) => {
    setAvatar({ ...avatar, [`${part}Color`]: value });
  };

  return (
    <div className='edit-avatar-container'>
      <PixelArtCard
        size={100}
        color={avatar.baseColor}
        hoverColor={avatar.hoverColor}
      >
        <PixelArtCard.Hair value={avatar.hair} color={avatar.hairColor} />
        <PixelArtCard.HeadAccessory
          value={avatar.headAccessory}
          color={avatar.headAccessoryColor}
        />
        <PixelArtCard.Eyes value={avatar.eyes} color={avatar.eyesColor} />
        <PixelArtCard.EyesAccessory
          value={avatar.eyesAccessory}
          color={avatar.eyesAccessoryColor}
        />
        <PixelArtCard.EarAccessory
          value={avatar.earAccessory}
          color={avatar.earAccessoryColor}
        />
        <PixelArtCard.Nose value={avatar.nose} />
        <PixelArtCard.Beard value={avatar.beard} />
        <PixelArtCard.Mouth value={avatar.mouth} color={avatar.mouthColor} />
        <PixelArtCard.MouthAccessory
          value={avatar.mouthAccessory}
          color={avatar.mouthAccessoryColor}
        />
        <PixelArtCard.NeckAccessory
          value={avatar.neckAccessory}
          color={avatar.neckAccessoryColor}
        />
      </PixelArtCard>
      <div>
        <div>
          <label>Peau:</label>
          <input
            type='color'
            value={avatar.baseColor}
            onChange={(e) => updateAvatarColor("base", e.target.value)}
          />
        </div>
        <div>
          <label>Cheveux:</label>
          <select
            onChange={(e) => updateAvatarPart("hair", e.target.value)}
            value={avatar.hair}
          >
            {hairTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <input
            type='color'
            value={avatar.hairColor}
            onChange={(e) => updateAvatarColor("hair", e.target.value)}
          />
        </div>
        <div>
          <label>Accessoire de tête:</label>
          <select
            onChange={(e) => updateAvatarPart("headAccessory", e.target.value)}
            value={avatar.headAccessory}
          >
            {headAccessoryTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <input
            type='color'
            value={avatar.headAccessoryColor}
            onChange={(e) => updateAvatarColor("headAccessory", e.target.value)}
          />
        </div>
        <div>
          <label>Yeux:</label>
          <select
            onChange={(e) => updateAvatarPart("eyes", e.target.value)}
            value={avatar.eyes}
          >
            {eyeTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <input
            type='color'
            value={avatar.eyesColor}
            onChange={(e) => updateAvatarColor("eyes", e.target.value)}
          />
        </div>
        <div>
          <label>Accessoire pour les yeux:</label>
          <select
            onChange={(e) => updateAvatarPart("eyesAccessory", e.target.value)}
            value={avatar.eyesAccessory}
          >
            {eyesAccessoryTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <input
            type='color'
            value={avatar.eyesAccessoryColor}
            onChange={(e) => updateAvatarColor("eyesAccessory", e.target.value)}
          />
        </div>
        <div>
          <label>Accessoire oreille:</label>
          <select
            onChange={(e) => updateAvatarPart("earAccessory", e.target.value)}
            value={avatar.earAccessory}
          >
            {earAccessoryTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <input
            type='color'
            value={avatar.earAccessoryColor}
            onChange={(e) => updateAvatarColor("earAccessory", e.target.value)}
          />
        </div>
        <div>
          <label>Nez:</label>
          <select
            onChange={(e) => updateAvatarPart("nose", e.target.value)}
            value={avatar.nose}
          >
            {noseTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Barbe:</label>
          <select
            onChange={(e) => updateAvatarPart("beard", e.target.value)}
            value={avatar.beard}
          >
            {beardTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Bouche:</label>
          <select
            onChange={(e) => updateAvatarPart("mouth", e.target.value)}
            value={avatar.mouth}
          >
            {mouthTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <input
            type='color'
            value={avatar.mouthColor}
            onChange={(e) => updateAvatarColor("mouth", e.target.value)}
          />
        </div>
        <div>
          <label>Accessoire de bouche:</label>
          <select
            onChange={(e) => updateAvatarPart("mouthAccessory", e.target.value)}
            value={avatar.mouthAccessory}
          >
            {mouthAccessoryTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <input
            type='color'
            value={avatar.mouthAccessoryColor}
            onChange={(e) =>
              updateAvatarColor("mouthAccessory", e.target.value)
            }
          />
        </div>
        <div>
          <label>Accessoire de cou:</label>
          <select
            onChange={(e) => updateAvatarPart("neckAccessory", e.target.value)}
            value={avatar.neckAccessory}
          >
            {neckAccessoryTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <input
            type='color'
            value={avatar.neckAccessoryColor}
            onChange={(e) => updateAvatarColor("neckAccessory", e.target.value)}
          />
        </div>
      </div>

      <button onClick={() => onSave(avatar)}>Save Avatar</button>
    </div>
  );
};

export default EditAvatar;
