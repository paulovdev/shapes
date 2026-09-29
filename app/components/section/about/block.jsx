export default function SectionBlock({ title, items }) {
  return (
    <div className="mb-20">
      <p className="text-p text-[1.25em] font-medium uppercase mb-4">{title}</p>
      <ul className="text-p text-[.8em] font-medium uppercase space-y-1">
        {items.map((i, idx) => (
          <li key={idx}>• {i}</li>
        ))}
      </ul>
    </div>
  );
}
