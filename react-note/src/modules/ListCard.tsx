import { useCallback, useEffect, useState } from "react";
import Fetch from "../utils/api";
import Card from "./Card";
import type { cardDataInterface } from "./Card";
import { useNavigate } from "react-router-dom";

function ListCard() {
  const [listCards, setListCards] = useState<cardDataInterface[]>([]);

  const navigate = useNavigate();

  const handleInvalidToken = useCallback(() => {
    localStorage.removeItem("auth_token");
    navigate("/login");
  }, [navigate]);

  const getNotes = useCallback(async (): Promise<cardDataInterface[]> => {
    try {
      const response = await Fetch({
        path: "notes/personal/",
        method: "GET",
      });

      if (response.ok) {
        const cards = await response.json();
        console.log("Cards: ", cards);
        setListCards(cards);
        return cards;
      } else if (response.status === 401) {
        handleInvalidToken();
        return [];
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail);
      }
    } catch (error) {
      console.error("Error: ", error);
      return [];
    }
  }, [handleInvalidToken, setListCards]);

  useEffect(() => {
    getNotes();
  }, [getNotes]);

  return (
    <div className="grid">
      {listCards.map((item, idx) => (
        <Card key={idx} data={item} />
      ))}
    </div>
  );
}

export default ListCard;
