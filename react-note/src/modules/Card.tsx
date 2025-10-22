export interface cardDataInterface {
  id: number;
  text: string;
  category: string;
  tag: string;
  date: string;
}

interface CardProps {
  data: cardDataInterface;
}

function Card({ data }: CardProps) {
  return (
    <div>
      <div className="card">
        <div className="card-header">
          <span className="badge" id="noteCategoryBadge">
            {data.category}
          </span>
          <span className="badge" id="noteOriginalUserID"></span>
          <small className="text-muted note-date">{data.date}</small>
        </div>
        <p className="note-text">{data.text}</p>
        <div className="tags" id="noteTagsContainer">
          {data.tag}
        </div>
        <div className="card-actions">
          <button type="button" className="btn btn-primary editBtn">
            Editar
          </button>
          <button type="button" className="btn btn-danger deleteBtn">
            Eliminar
          </button>
          <button type="button" className="btn btn-success shareBtn">
            Compartir
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;
