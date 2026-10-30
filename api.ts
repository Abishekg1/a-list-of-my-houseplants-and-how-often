export interface Plant {
  id: string;
  name: string;
  intervalDays: number;
  nextWaterDate: string;
}

// Get all plants from the server
export async function getPlants(): Promise<Plant[]> {
  const response = await fetch('/api/plants');

  const data = await response.json();

  return data as Plant[];
}

// Add a new plant
export async function addPlant(
  name: string,
  intervalDays: number
): Promise<Plant> {
  const response = await fetch('/api/plants', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      intervalDays,
    }),
  });

  const data = await response.json();

  return data as Plant;
}

// Update an existing plant
export async function updatePlant(plant: Plant): Promise<void> {
  await fetch('/api/plants/' + plant.id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: plant.name,
      intervalDays: plant.intervalDays,
      nextWaterDate: plant.nextWaterDate,
    }),
  });
}
