import React, { useEffect, useState } from 'react';
 
interface Plant { 
  id: string; 
  name: string; 
  intervalDays: number; 
  nextWaterDate: string; 
} 
 
const STORAGE_KEY = 'plant-water-planner'; 
 
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
 
// Form where the user types a plant name and how many days apart it needs water 
function PlantForm({ onAdd }: PlantFormProps) { 
  const [name, setName] = useState<string>(''); 
  const [intervalText, setIntervalText] = useState<string>(''); 
 
  // Checks the inputs, sends the new plant up to App, and clears the form 
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
  onWater: (id: string) => void; 
} 
 
// Shows a titled list of plants, each with a button to mark it as watered 
function PlantList({ title, plants, emptyText, onWater }: PlantListProps) { 
  return ( 
    <section className='panel'> 
      <h2>{title}</h2> 
      {plants.length === 0 ? ( 
        <p className='empty'>{emptyText}</p> 
      ) : ( 
        <ul className='plant-list'> 
          {plants.map((plant: Plant) => ( 
            <li key={plant.id} className='plant-item'> 
              <div> 
                <strong>{plant.name}</strong> 
                <span>Every {plant.intervalDays} day(s), next watering: {plant.nextWaterDate}</span> 
              </div> 
              <button onClick={() => onWater(plant.id)}>Mark watered</button> 
            </li> 
          ))} 
        </ul> 
      )} 
    </section> 
  ); 
} 
 
// Main app: holds the plant list, saves it, and passes data and callbacks to the parts
export default function App() { 
  const [plants, setPlants] = useState<Plant[]>(loadPlants);
 
  // Saves the plant list to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plants));
  }, [plants]);
 
  const today = todayString(); 
  const duePlants = plants.filter((plant: Plant) => plant.nextWaterDate <= today); 
 
  // Adds a new plant that is due for its first watering today 
  function addPlant(name: string, intervalDays: number) { 
    const newPlant: Plant = { 
      id: `${Date.now()}-${Math.random()}`, 
      name, 
      intervalDays, 
      nextWaterDate: today, 
    }; 
    setPlants((current: Plant[]) => [...current, newPlant]); 
  } 
 
  // Moves the chosen plant's next watering date forward by its interval 
  function waterPlant(id: string) { 
    setPlants((current: Plant[]) => 
      current.map((plant: Plant) => 
        plant.id === id 
          ? { ...plant, nextWaterDate: addDays(plant.nextWaterDate, plant.intervalDays) } 
          : plant 
      ) 
    ); 
  } 
 
  return ( 
    <main className='app'> 
      <h1>Plant Water Planner</h1> 
      <PlantForm onAdd={addPlant} /> 
      <PlantList 
        title='Water today' 
        plants={duePlants} 
        emptyText='Nothing needs water today.' 
        onWater={waterPlant} 
      /> 
      <PlantList 
        title='All my plants' 
        plants={plants} 
        emptyText='No plants yet. Add one above.' 
        onWater={waterPlant} 
      /> 
    </main> 
  ); 
} 
