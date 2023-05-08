import Head from "next/head";
import { useState } from "react";
import axios from "axios";
import styles from 'styles/index.module.css';
import { DataContext } from 'util/context.jsx';
import { TopMenu, SideMenu } from "components/page";

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

export default function MyMemento() {
  const [query, setQuery] = useState("");
  const [prevQuery, setPrevQuery] = useState(query);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);


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

      // TODO: clean up ui and show a simple text based summary then ship that live

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

  return (<DataContext.Provider value={{
    styles: styles,
    sideMenuOpenContext: [sideMenuOpen, setSideMenuOpen]
  }}>
      <div className={``}>
        <Head>
          <title>My Memento</title>
          <link rel="icon" href="/buddha-elephant.png" />
        </Head>

        <main className={`${styles.main}`}>
          <TopMenu />
          <SideMenu />
          <div className={`absolute mt-36 mx-auto`}>
            <form onSubmit={onSubmit} className={`m-auto`}>
              <input
                type={"text"}
                name={"queryInput"}
                placeholder={"Analyze emotional tone of language..."}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <input type="submit" value="Submit" />
            </form>
            <div className={`${styles.results}`}>
              {loading && <div className={`${styles.loading}`}>Loading...</div>}
              {error && <div>Error: {error}</div>}
              {!loading && prevQuery && <div>
                <div className={`text-center font-bold`}>Your query:</div> 
                <div>{prevQuery}</div>
                </div>}
              {result && <div>
                  <h1 className={`text-xl font-semibold py-8 text-center`}>Your insights</h1>
                  <pre className={`py-4 text-base`}>{result}</pre>
                </div>
              }
            </div>
          </div>
        </main>
      </div>
    </DataContext.Provider>);
}
