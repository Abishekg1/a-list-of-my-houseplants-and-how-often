import React, { useState } from 'react';

interface Plant {
  id: string;
  name: string;
  intervalDays: number;
}

// Formats a Date as YYYY-MM-DD using local time
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Returns today's date as YYYY-MM-DD
function todayString(): string {
  return formatDate(new Date());
}

// Adds a number of days to a YYYY-MM-DD string and returns the new date string
function addDays(dateString: string, days: number): string {
  const [year, month, day] = dateString.split('-').map(Number);
  return formatDate(new Date(year, month - 1, day + days));
}

// Form where the user types a plant name and how many days apart it needs water
function PlantForm() {
  const [name, setName] = useState<string>('');
  const [intervalText, setIntervalText] = useState<string>('');

  // Checks the inputs and clears the form when they are good
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const days = Number(intervalText);
    if (name.trim() === '' || !Number.isInteger(days) || days < 1) {
      return;
    }
    setName('');
    setIntervalText('');
  }

  return (
    <form className='plant-form' onSubmit={handleSubmit}>
      <input
        type='text'
        placeholder='Plant name'
        value={name}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
      />
      <input
        type='number'
        min='1'
        placeholder='Water every (days)'
        value={intervalText}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setIntervalText(event.target.value)}
      />
      <button type='submit'>Add plant</button>
    </form>
  );
}

interface PlantListProps {
  title: string;
  plants: Plant[];
  emptyText: string;
}

// Shows a titled section that displays a message when empty, or a list of plant names
function PlantList({ title, plants, emptyText }: PlantListProps) {
  return (
    <section className='panel'>
      <h2>{title}</h2>
      {plants.length === 0 ? (
        <p className='empty'>{emptyText}</p>
      ) : (
        <ul className='plant-list'>
          {plants.map((plant: Plant) => (
            <li key={plant.id} className='plant-item'>
              <strong>{plant.name}</strong>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// Main app: draws the heading, the form and both sections
export default function App() {
  const plants: Plant[] = [];
  const today = todayString();
  const duePlants = plants.filter((plant: Plant) => plant.id === today);

  return (
    <main className='app'>
      <h1>Plant Water Planner</h1>
      <PlantForm />
      <PlantList
        title='Water today'
        plants={duePlants}
        emptyText='Nothing needs water today.'
      />
      <PlantList
        title='All my plants'
        plants={plants}
        emptyText='No plants yet. Add one above.'
      />
    </main>
  );
}