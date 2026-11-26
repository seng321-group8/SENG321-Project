export default function PlaceholderPage({ title, note }) {
  return (
    <section className="card">
      <h1>{title}</h1>
      {note && <p className="muted">{note}</p>}
      <p className="muted">This screen is a placeholder from the React skeleton.</p>
    </section>
  );
}