// App.js
import { useState } from "react";

export default function App() {
  const [joke, setJoke] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchJoke = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/joke");
      const data = await response.json();
      setJoke(`${data.setup} - ${data.punchline}`);
    } catch (error) {
      console.error(error);
      setJoke("Failed to fetch joke");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Random Joke Generator</h1>
      <button onClick={fetchJoke} style={{ padding: "0.5rem 1rem", marginBottom: "1rem" }}>
        {loading ? "Loading..." : "Get Joke"}
      </button>
      {joke && <p>{joke}</p>}
    </div>
  );
}
