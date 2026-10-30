import express, { Request, Response, NextFunction } from 'express';
import { readFile, writeFile } from 'fs/promises';

interface Plant {
  id: string;
  name: string;
  nextWaterDate: string;
  intervalDays: number;
}

const app = express();
const FILE_NAME = 'plants.json';

// Sample plants
const samplePlants: Plant[] = [
  {
    id: '1',
    name: 'Fern',
    nextWaterDate: '2026-10-31',
    intervalDays: 7,
  },
  {
    id: '2',
    name: 'Snake Plant',
    nextWaterDate: '2026-11-02',
    intervalDays: 14,
  },
];

// Load plants from plants.json
async function loadPlants(): Promise<Plant[]> {
  try {
    const text = await readFile(FILE_NAME, 'utf8');
    return JSON.parse(text) as Plant[];
  } catch {
    return samplePlants;
  }
}

// Save plants to plants.json
async function savePlants(plants: Plant[]): Promise<void> {
  await writeFile(FILE_NAME, JSON.stringify(plants, null, 2));
}

// Validate a new plant
function validatePlant(
  body: any
): { status: number; message: string } | undefined {
  // Check plant name first
  if (
    typeof body.name !== 'string' ||
    body.name.trim() === ''
  ) {
    return {
      status: 400,
      message: 'Please type a plant name',
    };
  }

  // Check watering interval
  const days = Number(body.intervalDays);

  if (!Number.isInteger(days) || days < 1) {
    return {
      status: 422,
      message: 'Days must be 1 or more',
    };
  }

  return undefined;
}

let list: Plant[] = [];

// Parse JSON requests
app.use(express.json());

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// GET: List all plants
app.get('/api/plants', (req: Request, res: Response) => {
  res.json(list);
});

// POST: Add a new plant
app.post('/api/plants', async (req: Request, res: Response) => {
  const error = validatePlant(req.body);

  if (error) {
    res.status(error.status).json({
      error: error.message,
    });
    return;
  }

  const name = String(req.body.name).trim();
  const intervalDays = Number(req.body.intervalDays);

  const newPlant: Plant = {
    id: String(Date.now()),
    name,
    intervalDays,
    nextWaterDate: new Date().toISOString().slice(0, 10),
  };

  list.push(newPlant);

  await savePlants(list);

  res.status(201).json(newPlant);
});

// PUT: Update an existing plant
app.put('/api/plants/:id', async (req: Request, res: Response) => {
  const id = req.params.id;

  const plant = list.find((item) => item.id === id);

  if (!plant) {
    res.status(404).json({
      error: 'Plant not found',
    });
    return;
  }

  plant.name = String(req.body.name);
  plant.intervalDays = Number(req.body.intervalDays);
  plant.nextWaterDate = String(req.body.nextWaterDate);

  await savePlants(list);

  res.json(plant);
});

// DELETE: Delete a plant
app.delete('/api/plants/:id', async (req: Request, res: Response) => {
  const id = req.params.id;

  const index = list.findIndex((plant) => plant.id === id);

  if (index === -1) {
    res.status(404).json({
      error: 'Plant not found',
    });
    return;
  }

  list.splice(index, 1);

  await savePlants(list);

  res.status(204).send();
});

// Handle unknown API routes
app.use('/api', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route was not found',
  });
});

// Serve the main HTML page
app.get('/', (req: Request, res: Response) => {
  res.sendFile('index.html', { root: '.' });
});

// Serve CSS
app.get('/styles.css', (req: Request, res: Response) => {
  res.sendFile('styles.css', { root: '.' });
});

// Serve the built JavaScript bundle
app.get('/bundle.js', (req: Request, res: Response) => {
  res.sendFile('bundle.js', { root: '.' });
});

// Start server after loading saved plants
async function main(): Promise<void> {
  list = await loadPlants();

  // Ensure plants.json exists
  await savePlants(list);

  app.listen(Number(process.env.PORT) || 3000, () => {
    console.log('Plant Water Planner server is listening');
  });
}

main();
