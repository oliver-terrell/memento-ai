import Head from "next/head";
import { useState } from "react";
import axios from "axios";
import styles from 'styles/index.module.css';
import { DataContext } from 'util/context.jsx';
import { TopMenu, SideMenu } from "components/page";
import { ArrowClockwise } from "react-bootstrap-icons";
import { getAspectPercentages } from "util/marshal.js";
import { getAspectPercentagesDisplay } from "util/display";

const devData = {
  data: 
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
  const [bigFiveResult, setBigFiveResult] = useState(null);
  const [textSummaryResult, setTextSummaryResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  const rerun = () => {
    setQuery(prevQuery);
    setTimeout(() => {
      document.getElementById("submit").click();
    }, 500);
  }

  async function onSubmit(e) {
    e.preventDefault();

    if (query === '') {
      setBigFiveResult('An empty vessel can quench no thirst . . .');
      setTextSummaryResult('Speak unto your world. Discovery awaits . . .')
      return;
    }

    setLoading(true);
    setError(false);
    setBigFiveResult(null);
    setTextSummaryResult(null);

    try {

      const bigFiveResponse = await axios.post("/api/bigFive", { query: query });
      const textSummaryResponse = await axios.post(
        "/api/textSummary",
         { 
          query: query, 
          aspectPercentages: getAspectPercentages(bigFiveResponse.data)
        }
      );
      // const bigFiveResponse = devData;
      const bigFiveOutput = getAspectPercentagesDisplay(bigFiveResponse.data);
      setBigFiveResult(bigFiveOutput);
      setTextSummaryResult(textSummaryResponse.data.result);
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
          <meta name="description" content="Leverage AI to glean the emotional context and personality of written text using the widely accepted Big Five Personality Traits from Modern Psychology. Use to illuminate author intent, decode text messages, or compose more powerful emails!" />
        </Head>

        <main className={`${styles.main}`}>

          {/* TODO: Mobile styling first on these components */}
          <TopMenu />
          <SideMenu />

          <div className={`absolute mt-36 mx-auto justify-center align-center text-center`}>
            <form onSubmit={onSubmit} className={`m-auto`}>

              {/* TODO: Better input design - steal from monte's textarea in GPT-starter */}
              
              <label htmlFor="message" className="block mb-2 text-sm font-lighter text-gray-900">Analyze the emotional tone of language:</label>
              <textarea id="message" rows="4" className={`block 
              p-2.5 w-[600px] mt-[10px] text-sm text-gray-900 bg-gray-50 rounded-lg border 
              border-gray-300 focus:ring-blue-500 focus:border-blue-500`} placeholder="Write or paste text here . . ."></textarea>
              <input id="submit" type="submit" value="Submit" className={`w-[340px] mx-auto mt-[20px]`} />

            </form>
            <div className={`${styles.results}`}>

              {/* TODO: Loading component */}
              {loading && <div className={`${styles.loading}`}>Loading...</div>}

              {/* TODO: Error component */}
              {error && <div>Error: {error}</div>}

              {/* TODO: ResultHeader component */}
              {!loading && prevQuery && <div>
                <div className={`text-center font-bold`}>Your words:</div> 
                <div className={`flex gap-2`}>
                  {prevQuery}
                  {/* <ArrowClockwise className={`hover:cursor-pointer`} size={30} onClick={() => rerun()} /> */}
                </div>
                </div>}

              {/* TODO: TextSummary component */}
              {textSummaryResult && <div>
                <h1 className={`text-m font-semibold py-8 text-center`}>Overview</h1>
                  <span className={`py-4 text-base`}>{textSummaryResult}</span>
                </div>
              }

              {/* TODO: BigFive component */}
              {bigFiveResult && <div>
                  <h1 className={`text-xl font-semibold py-8 text-center`}>Your insights</h1>
                  <pre className={`py-4 text-base`}>{bigFiveResult}</pre>
                </div>
              }

            </div>
          </div>
        </main>
      </div>
    </DataContext.Provider>);
}
