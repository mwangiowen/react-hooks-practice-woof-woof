// src/App.js
import React, { useState, useEffect } from "react";


function App() {
  const [pups, setPups] = useState([]);
  const [selectedPup, setSelectedPup] = useState(null);
  const [filterGoodDogs, setFilterGoodDogs] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3001/pups")
      .then((response) => response.json())
      .then((data) => setPups(data))
      .catch((error) => console.error("Error fetching pups:", error));
  }, []);

  const handlePupClick = (pup) => {
    setSelectedPup(pup);
  };

  const handleToggleGoodDog = () => {
    if (selectedPup) {
      const updatedPups = pups.map((pup) =>
        pup.id === selectedPup.id ? { ...pup, isGoodDog: !pup.isGoodDog } : pup
      );

      setPups(updatedPups);
      fetch(`http://localhost:3001/pups/${selectedPup.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isGoodDog: !selectedPup.isGoodDog }),
      })
        .then((response) => response.json())
        .then((data) => console.log("Pup updated:", data))
        .catch((error) => console.error("Error updating pup:", error));
    }
  };

  const handleFilterToggle = () => {
    setFilterGoodDogs(!filterGoodDogs);
  };

  const filteredPups = filterGoodDogs
    ? pups.filter((pup) => pup.isGoodDog)
    : pups;

  return (
    <div className="App">
      <div id="filter-div">
        <button onClick={handleFilterToggle}>
          Filter good dogs: {filterGoodDogs ? "ON" : "OFF"}
        </button>
      </div>
      <div id="dog-bar">
        {filteredPups.map((pup) => (
          <span key={pup.id} onClick={() => handlePupClick(pup)}>
            {pup.name}
          </span>
        ))}
      </div>
      <div id="dog-summary-container">
        {selectedPup && (
          <>
            <img src={selectedPup.image} alt={selectedPup.name} />
            <h2>{selectedPup.name}</h2>
            <button onClick={handleToggleGoodDog}>
              {selectedPup.isGoodDog ? "Good Dog!" : "Bad Dog!"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
