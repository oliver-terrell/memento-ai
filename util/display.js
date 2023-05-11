import { getAspectPercentages } from "./marshal";

export const getAspectPercentagesDisplay = (data) => {
    var aspectPercentages = getAspectPercentages(data);
    var data = JSON.stringify(aspectPercentages).split(',');
    var output = data.sort((a, b) => {
        return parseFloat(b.split(':')[1]) - parseFloat(a.split(':')[1]);
      })
      .map((trait) => {
          return <div key={trait}>
            <div>
              <b>{trait.split(':')[0].replace(/"([^"]+(?="))"/g, '$1').replace('{','')}:</b>
              <span className={styles.numbers}>{parseFloat(trait.split(':')[1]).toString()} %</span>
            </div>
          </div>
      });
    return output;
};
