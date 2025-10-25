import Card from "./Card";
import type { cardDataInterface } from "./Card";

interface ListCardProps {
  listCards: cardDataInterface[];
  onDeleteNote: (noteId: number) => void;
  onEditNote: (editCard: cardDataInterface) => void;
}

function ListCard({ listCards, onDeleteNote, onEditNote }: ListCardProps) {
  return (
    <div className="grid">
      {listCards.map((item) => (
        <Card
          key={item.id}
          data={item}
          onDeleteNote={onDeleteNote}
          onEditNote={onEditNote}
        />
      ))}
    </div>
  );
}

export default ListCard;
