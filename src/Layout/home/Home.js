import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DeckInfoCard from "./DeckInfoCard";
import { listDecks, deleteDeck } from "../../utils/api/index";
import DeckInfoCardMain from "./DeckInfoCardMain";

function Home() {
  const [decks, setDecks] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setDecks([]);
    const abortController = new AbortController();

    async function loadDecks() {
      try {
        let _decks = await listDecks(abortController.signal);
        setDecks(_decks);
        setLoaded(true);
      } catch (error) {
        if (error.name === "AbortError") {
          console.info("Aborted");
        } else {
          throw error;
        }
      }
    }
    loadDecks();
    return () => {
      abortController.abort();
    };
  }, []);

  async function handleDeleteDeck(id) {
    if (
      window.confirm("Delete this deck?\n\nYou will not be able to recover it.")
    ) {
      await deleteDeck(id);
      setDecks(() => decks.filter((deck) => deck.id !== id));
    }
  }

  const rows = decks.map((deck) => DeckInfoCard({ ...deck, handleDeleteDeck }));

  if (!loaded) {
    for (let i = 0; i < 3; i++) {
      rows.push(<DeckInfoCardMain key={i + 10} />);
    }
  }

  return (
    <span>
      <div className='row'>
        <Link to='/decks/new' className='btn btn-secondary'>
          <i className='bi bi-plus-lg'></i> Create Deck
        </Link>
      </div>
      <div className='row my-4'>{rows}</div>
    </span>
  );
}

export default Home;