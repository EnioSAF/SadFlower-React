export default function MachineDisplay({ message, phase }) {
  return (
    <output
      className="cd-machine-display"
      data-phase={phase}
      aria-live="polite"
      aria-atomic="true"
    >
      {message}
    </output>
  );
}
