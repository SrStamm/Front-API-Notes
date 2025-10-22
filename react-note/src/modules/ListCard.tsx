import Card from "./Card";
import type { cardDataInterface } from "./Card";

interface ListCardProps {
  listCards: cardDataInterface[];
  onDeleteNote: (noteId: number) => void;
}

function ListCard({ listCards, onDeleteNote }: ListCardProps) {
  return (
    <div className="grid">
      {listCards.map((item) => (
        <Card key={item.id} data={item} onDeleteNote={onDeleteNote} />
      ))}
    </div>
  );
}

export default ListCard;
