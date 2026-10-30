import React, { useEffect, useState } from 'react';
import { todayString, addDays } from './dates';
import { getPlants, addPlant, updatePlant } from './api';

interface Plant {
  id: string;
  name: string;
  intervalDays: number;
  nextWaterDate: string;
}

interface PlantFormProps {
  onAdd: (name: string, intervalDays: number) => void;
}

// Form for adding a plant
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
      />

      <input
        type="number"
        min="1"
        placeholder="Water every (days)"
        value={intervalText}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setIntervalText(event.target.value)
        }
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

// Displays a list of plants
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
  const [plants, setPlants] = useState<Plant[]>([]);

  // Load plants from the server
  async function refresh() {
    try {
      const updatedPlants = await getPlants();
      setPlants(updatedPlants);
    } catch (error) {
      console.error('Failed to load plants:', error);
    }
  }

  // Load plants when the page opens
  useEffect(() => {
    refresh();
  }, []);

  // Add a new plant through the server
  async function handleAdd(name: string, intervalDays: number) {
    try {
      await addPlant(name, intervalDays);
      await refresh();
    } catch (error) {
      console.error('Failed to add plant:', error);
    }
  }

  // Update a plant's next watering date
  async function waterPlant(id: string) {
    try {
      const plant = plants.find((item) => item.id === id);

      if (!plant) {
        return;
      }

      const updatedPlant: Plant = {
        ...plant,
        nextWaterDate: addDays(
          plant.nextWaterDate,
          plant.intervalDays
        ),
      };

      await updatePlant(updatedPlant);
      await refresh();
    } catch (error) {
      console.error('Failed to update plant:', error);
    }
  }

  const today = todayString();

  const duePlants = plants.filter(
    (plant: Plant) => plant.nextWaterDate <= today
  );

  return (
    <main className="app">
      <h1>Plant Water Planner</h1>

      <PlantForm onAdd={handleAdd} />

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
