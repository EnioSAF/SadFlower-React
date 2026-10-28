import React, { useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import { useZIndex } from "@/components/Tools/ZIndexContext";
import CdVendingMachine from "@/components/system32/applications/CdVendingMachine/CdVendingMachine";

const MOBILE_BREAKPOINT = 600;

export default function CdVendingMachineWindow({ closeWindow }) {
  const { bringToFront, handleClose } = useZIndex();
  const [zIndex, setZIndex] = useState(1);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const updateLayout = () => setMobile(query.matches);
    updateLayout();
    query.addEventListener?.("change", updateLayout);
    return () => query.removeEventListener?.("change", updateLayout);
  }, []);

  const desktopWidth = Math.min(760, Math.max(360, window.innerWidth - 24));
  const desktopHeight = Math.min(680, Math.max(520, window.innerHeight - 64));
  const desktopPosition = {
    x: Math.max(4, (window.innerWidth - desktopWidth) / 2),
    y: Math.max(4, (window.innerHeight - desktopHeight - 34) / 2),
  };
  const close = () => {
    handleClose();
    closeWindow();
  };

  return (
    <Rnd
      className="window cd-vending-window"
      style={{ zIndex }}
      role="dialog"
      aria-label="SadFlowerDiscs.exe"
      default={{ ...desktopPosition, width: desktopWidth, height: desktopHeight }}
      size={mobile ? { width: "calc(100vw - 12px)", height: "calc(100dvh - 48px)" } : undefined}
      position={mobile ? { x: 4, y: 4 } : undefined}
      minWidth={360}
      minHeight={520}
      bounds="window"
      disableDragging={mobile}
      enableResizing={!mobile}
      onMouseDown={() => setZIndex(bringToFront())}
    >
      <div className="title-bar">
        <div className="title-bar-text">SadFlowerDiscs.exe</div>
        <div className="title-bar-controls">
          <button aria-label="Minimize" disabled />
          <button aria-label="Maximize" disabled />
          <button aria-label="Close" onClick={close} />
        </div>
      </div>
      <div className="window-body cd-vending-body">
        <CdVendingMachine />
      </div>
      <div className="status-bar">
        <p className="status-bar-field">CD BUS READY</p>
        <p className="status-bar-field">LOCAL DEMO</p>
      </div>
    </Rnd>
  );
}
