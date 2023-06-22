import React, { useState } from "react";
import "./style-kanban.css";

type Card = {
  id: number;
  title: string;
  content: string;
  column: string;
};

const KanbanBoard: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [newCard, setNewCard] = useState({ title: "", content: "" });
  const [editMode, setEditMode] = useState<number | null>(null);
  const [editedCard, setEditedCard] = useState({ id: 0, title: "", content: "" });

  const addCard = () => {
    const updatedCard: Card = {
      id: cards.length + 1,
      title: newCard.title,
      content: newCard.content,
      column: "TODO"
    };

    setCards((prevCards) => [...prevCards, updatedCard]);
    setNewCard({ title: "", content: "" });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addCard();
  };

  const moveCard = (cardId: number, direction: string) => {
    setCards((prevCards) =>
      prevCards.map((card) => {
        if (card.id === cardId) {
          switch (direction) {
            case "left":
              return { ...card, column: getPreviousColumn(card.column) };
            case "right":
              return { ...card, column: getNextColumn(card.column) };
            default:
              return card;
          }
        }
        return card;
      })
    );
  };

  const getPreviousColumn = (currentColumn: string) => {
    switch (currentColumn) {
      case "TODO":
        return "";
      case "DOING":
        return "TODO";
      case "DONE":
        return "DOING";
      default:
        return currentColumn;
    }
  };

  const getNextColumn = (currentColumn: string) => {
    switch (currentColumn) {
      case "":
        return "TODO";
      case "TODO":
        return "DOING";
      case "DOING":
        return "DONE";
      default:
        return currentColumn;
    }
  };

  const handleDeleteCard = (cardId: number) => {
    const confirmDelete = window.confirm(
      "Tem certeza de que deseja excluir o cartão?"
    );
    if (confirmDelete) {
      setCards((prevCards) =>
        prevCards.filter((card) => card.id !== cardId)
      );
    }
  };

  const handleEditCard = (card: Card) => {
    setEditMode(card.id);
    setEditedCard({ id: card.id, title: card.title, content: card.content });
  };

  const handleSaveCard = (e: React.FormEvent<HTMLFormElement>, cardId: number) => {
    e.preventDefault();
    setCards((prevCards) =>
      prevCards.map((card) => {
        if (card.id === cardId) {
          return { ...card, title: editedCard.title, content: editedCard.content };
        }
        return card;
      })
    );
    setEditMode(null);
    setEditedCard({ id: 0, title: "", content: "" });
  };

  const renderCards = (column: string) =>
    cards
      .filter((card) => card.column === column)
      .map((card) => (
        <div className="card" key={card.id}>
          {editMode === card.id ? (
            <form onSubmit={(e) => handleSaveCard(e, card.id)}>
              <input
                type="text"
                name="title"
                value={editedCard.title}
                onChange={(e) => setEditedCard({ ...editedCard, title: e.target.value })}
                className="input-field"
              />
              <textarea
                name="content"
                value={editedCard.content}
                onChange={(e) => setEditedCard({ ...editedCard, content: e.target.value })}
                className="textarea-field"
              ></textarea>
              <button type="submit" className="salvar-button">Salvar</button>
            </form>
          ) : (
            <>
              <button className="edit-button" onClick={() => handleEditCard(card)}>
                Editar
              </button>
              <h3>{card.title}</h3>
              <p>{card.content}</p>
              <div className="card-actions">
                {column !== "" && (
                  <>
                    <button onClick={() => moveCard(card.id, "left")}>&larr;</button>
                    <button onClick={() => handleDeleteCard(card.id)}>Excluir</button>
                  </>
                )}
                {column !== "DONE" && (
                  <button onClick={() => moveCard(card.id, "right")}>&rarr;</button>
                )}
              </div>
            </>
          )}
        </div>
      ));

  return (
    <div className="kanban-board">
      <div className="column">
        <h2>Novo</h2>
        <form onSubmit={handleSubmit} className="form-container">
          <input
            type="text"
            name="title"
            placeholder="Título"
            value={newCard.title}
            onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
            className="input-field"
          />
          <textarea
            name="content"
            placeholder="Conteúdo"
            value={newCard.content}
            onChange={(e) => setNewCard({ ...newCard, content: e.target.value })}
            className="textarea-field"
          ></textarea>
          <button type="submit" className="submit-button">+</button>
        </form>
      </div>
      <div className="column">
        <h2>To Do</h2>
        {renderCards("TODO")}
      </div>
      <div className="column">
        <h2>Doing</h2>
        {renderCards("DOING")}
      </div>
      <div className="column">
        <h2>Done</h2>
        {renderCards("DONE")}
      </div>
    </div>
  );
};

export default KanbanBoard;
