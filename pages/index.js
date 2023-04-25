import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: animalInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setAnimalInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Memento GPT</title>
        <link rel="icon" href="/gold-elephant.png" />
      </Head>

      <main className={styles.main}>
        <img src="/buddha-elephant.png" className={styles.icon} />
        <h3>Memento GPT</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="animal"
            placeholder="Coming soon"
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
            disabled={true}
          />
          <input type="submit" value="Coming soon" disabled={true} />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
