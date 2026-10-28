import Image from "next/image";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import AlbumSlot from "./AlbumSlot";
import MachineDisplay from "./MachineDisplay";
import { DEMO_ALBUMS } from "./vendingMachineData";
import { INITIAL_MACHINE_STATE, MACHINE_PHASES, transitionMachine } from "./vendingMachineState";
import { playMachineSound, stopMachineAudio } from "./machineAudio";

export default function CdVendingMachine({ albums = DEMO_ALBUMS }) {
  const [state, dispatch] = useReducer(transitionMachine, INITIAL_MACHINE_STATE);
  const [muted, setMuted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timerRef = useRef(null);
  const deliveredRef = useRef(null);

  const selectedAlbum = useMemo(
    () => albums.find((album) => album.id === state.selectedAlbumId) || null,
    [albums, state.selectedAlbumId]
  );
  const deliveredAlbum = useMemo(
    () => albums.find((album) => album.id === state.deliveredAlbumId) || null,
    [albums, state.deliveredAlbumId]
  );
  const displayMessage = albums.length === 0
    ? "MACHINE EMPTY"
    : state.phase === MACHINE_PHASES.SELECTED && selectedAlbum
      ? selectedAlbum.machineMessage
      : state.message;
  const controlsLocked = state.phase === MACHINE_PHASES.DISPENSING;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(query.matches);
    updatePreference();
    query.addEventListener?.("change", updatePreference);
    return () => query.removeEventListener?.("change", updatePreference);
  }, []);

  useEffect(() => () => {
    window.clearTimeout(timerRef.current);
    stopMachineAudio();
  }, []);

  useEffect(() => {
    if (state.phase === MACHINE_PHASES.DELIVERED && state.deliveredAlbumId !== deliveredRef.current) {
      deliveredRef.current = state.deliveredAlbumId;
      playMachineSound("deliver", muted);
    }
  }, [muted, state.deliveredAlbumId, state.phase]);

  const selectAlbum = (albumId) => {
    deliveredRef.current = null;
    dispatch({ type: "SELECT", albumId });
    playMachineSound("select", muted);
  };

  const obtainAlbum = () => {
    if (!selectedAlbum || controlsLocked) return;
    dispatch({ type: "OBTAIN" });
    playMachineSound("obtain", muted);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(
      () => dispatch({ type: "COMPLETE" }),
      reducedMotion ? 80 : 2800
    );
  };

  const resetMachine = () => {
    window.clearTimeout(timerRef.current);
    deliveredRef.current = null;
    dispatch({ type: "RESET" });
    playMachineSound("reset", muted);
  };

  return (
    <section
      className="cd-vending-machine"
      data-phase={state.phase}
      aria-label="Distributeur de CD SadFlower"
    >
      <div className="cd-machine-header" aria-hidden="true">
        <span>SADFLOWER</span>
        <small>DISC DISPENSER / UNIT 01</small>
      </div>

      <div className="cd-machine-cabinet">
        <div className="cd-machine-glass">
          <div className="cd-machine-rack">
            {albums.map((album) => (
              <AlbumSlot
                key={album.id}
                album={album}
                selected={album.id === state.selectedAlbumId}
                disabled={controlsLocked}
                onSelect={selectAlbum}
              />
            ))}
          </div>
          {albums.length === 0 && <p className="cd-machine-empty">NO DISC LOADED</p>}
        </div>

        <aside className="cd-machine-controls" aria-label="Commandes du distributeur">
          <div className="cd-control-screws" aria-hidden="true"><i /><i /><i /><i /></div>
          <MachineDisplay message={displayMessage} phase={state.phase} />
          <p className="cd-selection-readout">
            <span>SELECTION</span>
            <strong>{selectedAlbum?.slotCode || "--"}</strong>
          </p>
          <button
            type="button"
            className="cd-obtain-button"
            disabled={!selectedAlbum || controlsLocked || state.phase === MACHINE_PHASES.DELIVERED}
            onClick={obtainAlbum}
          >
            OBTENIR
          </button>
          <button
            type="button"
            className="cd-mute-button"
            aria-pressed={muted}
            onClick={() => setMuted((current) => !current)}
          >
            {muted ? "SON: OFF" : "SON: ON"}
          </button>
          <span className="cd-coin-return" aria-hidden="true">NO CASH</span>
        </aside>

        <div className="cd-delivery-zone">
          <div className="cd-delivery-tray" aria-label="Bac de retrait">
            <span className="cd-tray-flap" aria-hidden="true">PUSH / TAKE</span>
            {deliveredAlbum && (
              <div className="cd-delivered-disc">
                <Image src={deliveredAlbum.cover} alt={`CD ${deliveredAlbum.title}`} width={170} height={170} unoptimized />
              </div>
            )}
          </div>
          <button
            type="button"
            className="cd-reset-button"
            disabled={state.phase !== MACHINE_PHASES.DELIVERED && state.phase !== MACHINE_PHASES.ERROR}
            onClick={resetMachine}
          >
            RESET
          </button>
        </div>
      </div>

      <div className="cd-machine-status" aria-hidden="true">
        <span className="cd-status-led" />
        <span>LOCAL CATALOGUE</span>
        <span>{String(albums.length).padStart(2, "0")} DISCS</span>
      </div>
    </section>
  );
}
