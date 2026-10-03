export default function EmptyState({ title, description, children }) {
  return (
    <div className="empty-state">
      <svg className="empty-icon" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <rect x="9" y="7" width="30" height="34" rx="5" />
        <path d="M17 17h14M17 24h14M17 31h8" />
      </svg>
      <h2>{title}</h2>
      <p>{description}</p>
      {children}
    </div>
  );
}
