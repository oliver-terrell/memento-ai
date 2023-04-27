import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import axios from "axios";

export default function Home() {
  const [query, setQuery] = useState("");
  const [prevQuery, setPrevQuery] = useState(query);
  const [result, setResult] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  async function onSubmit(event) {
    event.preventDefault();

    if (query === '') {
      setResult('An empty vessel can quench no thirst . . .');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/api/bigFive", { query: query });
      var data = JSON.stringify(response.data).split(',');
      var output = data.filter(trait => trait.includes('.'))
        .sort((a, b) => {
          return parseFloat(b.split(':')[1]) - parseFloat(a.split(':')[1]);
        })
        .map((trait) => <div key={trait}>{trait.replace('[','')}</div>);
      setResult(output);
      setPrevQuery(query);
      setQuery("");
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setPrevQuery(query);
      setQuery("");
      setLoading(false);
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
            name="queryInput"
            placeholder="Learn how you communicate..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <input type="submit" value="Submit" />
        </form>
        {loading && <div>Loading...</div>}
        {error && <div>Error: {error}</div>}
        {prevQuery && <div>{prevQuery}</div>}
        {result && <div><h1>Your insights</h1><pre>{result}</pre></div>}
      </main>
    </div>
  );
}
