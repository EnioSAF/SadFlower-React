import React, { useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import { useZIndex } from "@/components/Tools/ZIndexContext";
import CdVendingMachine from "@/components/system32/applications/CdVendingMachine/CdVendingMachine";

const MOBILE_BREAKPOINT = 600;
const RESIZE_HANDLE_STYLES = {
  top: { top: 0 },
  right: { right: 0 },
  bottom: { bottom: 0 },
  left: { left: 0 },
  topRight: { top: 0, right: 0 },
  bottomRight: { bottom: 0, right: 0 },
  bottomLeft: { bottom: 0, left: 0 },
  topLeft: { top: 0, left: 0 },
};

export default function CdVendingMachineWindow({ closeWindow }) {
  const { bringToFront, handleClose } = useZIndex();
  const [zIndex, setZIndex] = useState(1);
  const [mobile, setMobile] = useState(false);
  const [viewport, setViewport] = useState(() => ({ width: window.innerWidth, height: window.innerHeight }));

  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const updateLayout = () => {
      setMobile(query.matches);
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };
    updateLayout();
    query.addEventListener?.("change", updateLayout);
    window.addEventListener("resize", updateLayout);
    return () => {
      query.removeEventListener?.("change", updateLayout);
      window.removeEventListener("resize", updateLayout);
    };
  }, []);

  const desktopWidth = Math.min(700, viewport.width - 16);
  const desktopPosition = {
    x: Math.max(4, (viewport.width - desktopWidth) / 2),
    y: Math.max(4, (viewport.height - 760) / 2),
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
      size={mobile ? { width: viewport.width - 16, height: "auto" } : undefined}
      position={mobile ? { x: 8, y: 4 } : undefined}
      bounds="window"
      dragHandleClassName="cd-machine-header"
      cancel=".cd-machine-close"
      disableDragging={mobile}
      enableResizing={!mobile}
      minWidth={mobile ? 0 : 320}
      minHeight={mobile ? 0 : 280}
      maxWidth={viewport.width - 16}
      maxHeight={viewport.height - (mobile ? 48 : 44)}
      resizeHandleStyles={RESIZE_HANDLE_STYLES}
      resizeHandleClasses={{ bottomRight: "cd-machine-resize-handle" }}
      onMouseDown={() => setZIndex(bringToFront())}
    >
      <CdVendingMachine onClose={close} />
    </Rnd>
  );
}
