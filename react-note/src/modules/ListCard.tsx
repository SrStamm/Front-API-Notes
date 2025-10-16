import Card from "./Card";
import type { cardDataInterface } from "./Card";

interface ListCardProps {
  data: cardDataInterface[];
}

function ListCard({ data }: ListCardProps) {
  return (
    <div className="grid">
      {data.map((item, idx) => (
        <Card key={idx} data={item} />
      ))}
    </div>
  );
}

export default ListCard;
