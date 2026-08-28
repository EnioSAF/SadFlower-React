import Image from "next/image";
import { useState } from "react";

const FALLBACK_COVER = "/CdVendingMachine/generic-disc.svg";

export default function AlbumSlot({ album, selected, disabled, onSelect }) {
  const [cover, setCover] = useState(album.cover || FALLBACK_COVER);

  return (
    <button
      type="button"
      className={`cd-album-slot${selected ? " is-selected" : ""}`}
      style={{ "--disc-accent": album.accentColor }}
      aria-label={`${album.slotCode} — ${album.title} par ${album.artist}`}
      aria-pressed={selected}
      disabled={disabled}
      onClick={() => onSelect(album.id)}
    >
      <span className="cd-slot-light" aria-hidden="true" />
      <span className="cd-slot-cover">
        <Image
          src={cover}
          alt=""
          width={160}
          height={160}
          unoptimized
          onError={() => setCover(FALLBACK_COVER)}
        />
      </span>
      <span className="cd-slot-label">
        <strong>{album.slotCode}</strong>
        <span>{album.title}</span>
      </span>
    </button>
  );
}
