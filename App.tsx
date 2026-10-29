
import React, { useEffect, useState } from 'react';
import { todayString, addDays } from './dates';

interface Plant {
  id: string;
  name: string;
  intervalDays: number;
  nextWaterDate: string;
}

const STORAGE_KEY = 'plant-water-planner';

// Loads saved plants from localStorage, or returns an empty list if none exist
function loadPlants(): Plant[] {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved === null) {
    return [];
  }

  try {
    return JSON.parse(saved) as Plant[];
  } catch {
    return [];
  }
}

interface PlantFormProps {
  onAdd: (name: string, intervalDays: number) => void;
}

// Form where the user enters a plant name and watering interval
function PlantForm({ onAdd }: PlantFormProps) {
  const [name, setName] = useState<string>('');
  const [intervalText, setIntervalText] = useState<string>('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const days = Number(intervalText);

    if (name.trim() === '' || !Number.isInteger(days) || days < 1) {
      return;
    }

    onAdd(name.trim(), days);
    setName('');
    setIntervalText('');
  }

  return (
    <form className="plant-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Plant name"
        value={name}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setName(event.target.value)
        }
        required
      />

      <input
        type="number"
        min="1"
        placeholder="Water every (days)"
        value={intervalText}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setIntervalText(event.target.value)
        }
        required
      />

      <button type="submit">Add plant</button>
    </form>
  );
}

interface PlantListProps {
  title: string;
  plants: Plant[];
  emptyText: string;
  onWater: (id: string) => void;
}

// Displays a list of plants and their next watering dates
function PlantList({
  title,
  plants,
  emptyText,
  onWater,
}: PlantListProps) {
  return (
    <section className="panel">
      <h2>{title}</h2>

      {plants.length === 0 ? (
        <p className="empty">{emptyText}</p>
      ) : (
        <ul className="plant-list">
          {plants.map((plant: Plant) => (
            <li key={plant.id} className="plant-item">
              <div>
                <strong>{plant.name}</strong>
                <span>
                  Every {plant.intervalDays} day(s), next watering:{' '}
                  {plant.nextWaterDate}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onWater(plant.id)}
              >
                Mark watered
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// Main application
export default function App() {
  const [plants, setPlants] = useState<Plant[]>(loadPlants);

  // Save plants whenever the list changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plants));
  }, [plants]);

  const today = todayString();

  const duePlants = plants.filter(
    (plant: Plant) => plant.nextWaterDate <= today
  );

  // Add a plant with its first watering due today
  function addPlant(name: string, intervalDays: number) {
    const newPlant: Plant = {
      id: `${Date.now()}-${Math.random()}`,
      name,
      intervalDays,
      nextWaterDate: todayString(),
    };

    setPlants((current: Plant[]) => [...current, newPlant]);
  }

  // Move the next watering date forward by the plant's interval
  function waterPlant(id: string) {
    setPlants((current: Plant[]) =>
      current.map((plant: Plant) =>
        plant.id === id
          ? {
              ...plant,
              nextWaterDate: addDays(
                plant.nextWaterDate,
                plant.intervalDays
              ),
            }
          : plant
      )
    );
  }

  return (
    <main className="app">
      <h1>Plant Water Planner</h1>

      <PlantForm onAdd={addPlant} />

      <PlantList
        title="Water today"
        plants={duePlants}
        emptyText="Nothing needs water today."
        onWater={waterPlant}
      />

      <PlantList
        title="All my plants"
        plants={plants}
        emptyText="No plants yet. Add one above."
        onWater={waterPlant}
      />
    </main>
  );
}
