function PlantForm() { return ( <form className="plant-form"> <input type="text" placeholder="Plant name" />

  <input
    type="number"
    min="1"
    placeholder="Water every (days)"
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