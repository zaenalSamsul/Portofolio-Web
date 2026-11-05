export default function SweepText({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={`sweep-text ${className}`}>
      <span className="sweep-text-base">{text}</span>
      <span className="sweep-text-fill" aria-hidden="true">{text}</span>
    </span>
  )
}
