import Card from "./Card";
import type { cardDataInterface } from "./Card";

interface ListCardProps {
  data: cardDataInterface;
}

function ListCard({ data }: ListCardProps) {
  return (
    <div className="grid">
      <Card data={data} />
    </div>
  );
}

export default ListCard;
