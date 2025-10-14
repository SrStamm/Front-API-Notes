import "./App.css";
import LoginForm from "./modules/LoginForm.tsx";
import ListCard from "./modules/ListCard";
import Header from "./modules/Header.tsx";
import RegisterForm from "./modules/RegisterForm.tsx";

const data = {
  text: "Esto es una nota",
  category: "category",
  tag: "tag",
  date: "12/12",
};

function App() {
  return (
    <>
      <Header />
      <main className="container">
        <ListCard data={data} />
        <LoginForm />
        <RegisterForm />
      </main>
    </>
  );
}

export default App;
