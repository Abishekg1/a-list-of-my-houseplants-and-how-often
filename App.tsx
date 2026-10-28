import React, { useState } from 'react';

interface Plant { id: string; name: string; intervalDays: number; }

interface PlantListProps { title: string; plants: Plant[]; emptyText: string; }

function PlantForm() { const [name, setName] = useState(''); const [intervalText, setIntervalText] = useState('');

function handleSubmit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault();

const interval = Number(intervalText);

if (
  name.trim() === '' ||
  !Number.isInteger(interval) ||
  interval < 1
) {
  return;
}

setName('');
setIntervalText('');


}

return ( <form className="plant-form" onSubmit={handleSubmit}> <input type="text" placeholder="Plant name" value={name} onChange={(event) => setName(event.target.value)} />

  <input
    type="number"
    min="1"
    placeholder="Water every (days)"
    value={intervalText}
    onChange={(event) => setIntervalText(event.target.value)}
  />

  <button type="submit">Add plant</button>
</form>


); }

function PlantList({ title, plants, emptyText }: PlantListProps) { return ( <section className="panel"> <h2>{title}</h2>

  {plants.length === 0 ? (
    <p className="empty">{emptyText}</p>
  ) : (
    <ul className="plant-list">
      {plants.map((plant) => (
        <li className="plant-item" key={plant.id}>
          {plant.name}
        </li>
      ))}
    </ul>
  )}
</section>


); }

function App() { const plants: Plant[] = []; const duePlants: Plant[] = [];

return ( <main className="app"> <h1>Plant Water Planner</h1>

  <PlantForm />

  <PlantList
    title="Water today"
    plants={duePlants}
    emptyText="Nothing needs water today"
  />

  <PlantList
    title="All my plants"
    plants={plants}
    emptyText="No plants yet. Add one above."
  />
</main>


); }

export default App;