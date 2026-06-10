export const CARDS = [
  { id: 1, title: 'Card 1', bg: '#16a34a', color: '#fff' },
  { id: 2, title: 'Card 2', bg: '#0ea5e9', color: '#fff' },
  { id: 3, title: 'Card 3', bg: '#a855f7', color: '#fff' },
  { id: 4, title: 'Card 4', bg: '#f59e0b', color: '#000' },
  { id: 5, title: 'Card 5', bg: '#ef4444', color: '#fff' },
];

export function Card({ card }: { card: (typeof CARDS)[number] }) {
  return (
    <div
      className="shrink-0 rounded-2xl border border-white/10 p-8"
      style={{
        width: '30vw',
        height: '60vh',
        backgroundColor: card.bg,
      }}
    >
      <span
        className="text-lg font-semibold"
        style={{ color: card.color }}
      >
        {card.title}
      </span>
    </div>
  );
}
