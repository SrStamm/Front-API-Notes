import Card from "./Card";
import type { cardDataInterface } from "./Card";

interface ListCardProps {
  listCards: cardDataInterface[];
  onDeleteNote: (noteId: number) => void;
  onEditNote: (editCard: cardDataInterface) => void;
  onShareNote: (noteId: number) => void;
  isSharedNotes: boolean 
}

function ListCard({ listCards, onDeleteNote, onEditNote, onShareNote, isSharedNotes }: ListCardProps) {
  return (
    <div className="grid">
      {listCards.map((item) => (
        <Card
          key={item.id}
          data={item}
          onDeleteNote={onDeleteNote}
          onEditNote={onEditNote}
          onShareNote={onShareNote}
          isSharedNotes={isSharedNotes}
        />
      ))}
    </div>
  );
}

export default ListCard;
