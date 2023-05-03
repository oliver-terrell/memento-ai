import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import axios from "axios";


const devData = {data: 
"outgoing:0.8960937095330063,"+
"intellectual:0.7939263435966878,"+
"sympathy:0.7783130212148792,"+
"cooperative:0.7511118017478042,"+
"dutiful:0.7486107102951731,"+
"trusting:0.7467607905816888,"+
"authority_challenging:0.742335782627034,"+
"uncompromising:0.7197297637282543,"+
"modesty:0.7196483672608609,"+
"emotionally_aware:0.6747619153328746,"+
"gregariousness:0.6745473246461103,"+
"cheerful:0.6639879829215412,"
};




export default function Home() {
  const [query, setQuery] = useState("");
  const [prevQuery, setPrevQuery] = useState(query);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  async function onSubmit(event) {
    event.preventDefault();

    if (query === '') {
      setResult('An empty vessel can quench no thirst . . .');
      return;
    }

    setLoading(true);
    setError(false);
    setResult(null);

    try {
      const response = await axios.post("/api/bigFive", { query: query });
      // const response = devData;
      var data = JSON.stringify(response.data).split(',');
      var output = data.filter(trait => trait.includes('.'))
        .sort((a, b) => {
          return parseFloat(b.split(':')[1]) - parseFloat(a.split(':')[1]);
        })
        .map((trait) => {
            return <div key={trait}>
              <div>
                <b>{trait.split(':')[0].replace(/"([^"]+(?="))"/g, '$1')}:</b>
                <span className={styles.numbers}>{parseFloat(trait.split(':')[1]).toString()}</span>
              </div>
            </div>
        });
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
        <title>My Memento</title>
        <link rel="icon" href="/gold-elephant.png" />
      </Head>

      <main className={styles.main}>
        <img src="/buddha-elephant.png" className={styles.icon} />
        <h3>My Memento</h3>
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
        <div className={styles.results}>
          {loading && <div className={styles.loading}>Loading...</div>}
          {error && <div>Error: {error}</div>}
          {!loading && prevQuery && <div><b>Your query:</b> {prevQuery}</div>}
          {result && <div><h1>Your insights</h1><pre>{result}</pre></div>}
        </div>
      </main>
    </div>
  );
}
