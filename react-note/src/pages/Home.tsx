import Header from "../modules/Header";
import ListCard from "../modules/ListCard";

const data = [
  {
    text: "Esto es una nota",
    category: "category",
    tag: "tag",
    date: "12/12",
  },

  {
    text: "Hola mundo",
    category: "category",
    tag: "tag",
    date: "19/9",
  },
];

export default function Home() {
  return (
    <>
      <Header />
      <main className="container">
        <div className="auth-section">
          <button className="btn btn-primary"> Nueva nota </button>
          <button className="btn btn-secondary"> Notas compartidas </button>
          <ListCard data={data} />
        </div>
      </main>
    </>
  );
}

