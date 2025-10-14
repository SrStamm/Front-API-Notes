import "./App.css";
import ListCard from "./modules/ListCard";

const data = {
  text: "Esto es una nota",
  category: "category",
  tag: "tag",
  date: "12/12",
};

function App() {
  return (
    <>
      <ListCard data={data} />
    </>
  );
}

export default App;
