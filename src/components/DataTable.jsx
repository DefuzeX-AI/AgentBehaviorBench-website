export default function DataTable({ columns, rows, label = 'Leaderboard data', caption = 'Model evaluation leaderboard' }) {
  return (
    <div className="table-scroll" role="region" aria-label={label} tabIndex={0}>
      <table>
        <caption className="sr-only">{caption}</caption>
        <thead><tr>{columns.map((column) => <th key={column.key} scope="col">{column.label}</th>)}</tr></thead>
        <tbody>{rows.map((row) => (
          <tr key={row.id}>
            {columns.map((column) => <td key={column.key}>{row[column.key] ?? '—'}</td>)}
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}
