import React, { useState } from 'react';

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
    required
  />

  <button type="submit">Add plant</button>
</form>


); }

function App() { return ( <main className="app"> <h1>Plant Water Planner</h1>

  <PlantForm />

  <section className="panel">
    <h2>Water today</h2>
  </section>

  <section className="panel">
    <h2>All my plants</h2>
  </section>
</main>


); }

export default App;