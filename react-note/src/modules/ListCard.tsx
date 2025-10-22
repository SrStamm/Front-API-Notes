import Card from "./Card";
import type { cardDataInterface } from "./Card";

interface ListCardProps {
  listCards: cardDataInterface[];
}

function ListCard({ listCards }: ListCardProps) {
  return (
    <div className="grid">
      {listCards.map((item) => (
        <Card key={item.id} data={item} />
      ))}
    </div>
  );
}

export default ListCard;
