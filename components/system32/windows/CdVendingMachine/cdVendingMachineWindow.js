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

  const desktopWidth = Math.min(700, window.innerWidth - 24);
  const desktopPosition = {
    x: Math.max(4, (window.innerWidth - desktopWidth) / 2),
    y: Math.max(4, (window.innerHeight - 760) / 2),
  };
  const close = () => {
    handleClose();
    closeWindow();
  };

  return (
    <Rnd
      className="cd-vending-shell"
      style={{ zIndex }}
      role="dialog"
      aria-label="SadFlowerDiscs.exe"
      default={{ ...desktopPosition, width: desktopWidth, height: "auto" }}
      size={mobile ? { width: "calc(100vw - 16px)", height: "auto" } : undefined}
      position={mobile ? { x: 4, y: 4 } : undefined}
      bounds="window"
      dragHandleClassName="cd-machine-header"
      cancel=".cd-machine-close"
      disableDragging={mobile}
      enableResizing={false}
      onMouseDown={() => setZIndex(bringToFront())}
    >
      <CdVendingMachine onClose={close} />
    </Rnd>
  );
}
