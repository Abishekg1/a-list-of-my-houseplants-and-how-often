import React, { useState } from 'react';

interface Plant { id: string; name: string; intervalDays: number; nextWaterDate: string; }

function formatDate(date: Date): string { const year = date.getFullYear(); const month = String(date.getMonth() + 1).padStart(2, '0'); const day = String(date.getDate()).padStart(2, '0');

return `${year}-${month}-${day}`;}

function todayString(): string { return formatDate(new Date()); }

function addDays(dateString: string, days: number): string { const [year, month, day] = dateString.split('-').map(Number);

return formatDate(new Date(year, month - 1, day + days)); }

interface PlantFormProps { onAdd: (name: string, intervalDays: number) => void; }

function PlantForm({ onAdd }: PlantFormProps) { const [name, setName] = useState(''); const [intervalText, setIntervalText] = useState('');

function handleSubmit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault();

const days = Number(intervalText);

if (
  name.trim() === '' ||
  intervalText.trim() === '' ||
  !Number.isInteger(days) ||
  days < 1
) {
  return;
}

onAdd(name.trim(), days);

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

interface PlantListProps { title: string; plants: Plant[]; emptyText: string; }

function PlantList({ title, plants, emptyText }: PlantListProps) { return ( <section className="panel"> <h2>{title}</h2>

  {plants.length === 0 ? (
    <p className="empty">{emptyText}</p>
  ) : (
    <ul className="plant-list">
      {plants.map((plant) => (
        <li key={plant.id} className="plant-item">
          <div>
            <strong>{plant.name}</strong>
            <span>
              Every {plant.intervalDays} day(s), next watering:{' '}
              {plant.nextWaterDate}
            </span>
          </div>
        </li>
      ))}
    </ul>
  )}
</section>


); }

export default function App() { const [plants, setPlants] = useState<Plant[]>([]); const today = todayString();

function addPlant(name: string, intervalDays: number) { const newPlant: Plant = { id: `${Date.now()}-${Math.random()}`, name, intervalDays, nextWaterDate: today, };

setPlants((current: Plant[]) => [...current, newPlant]);


}

return ( <main className="app"> <h1>Plant Water Planner</h1>

  <PlantForm onAdd={addPlant} />

  <PlantList
    title="Water today"
    plants={[]}
    emptyText="Nothing needs water today."
  />

  <PlantList
    title="All my plants"
    plants={plants}
    emptyText="No plants yet. Add one above."
  />
</main>


); }