import { getAspectPercentages } from "./marshal";
import styles from 'styles/index.module.css';

export const getAspectPercentagesDisplay = (data, forExtension=false) => {
    var aspectPercentages = getAspectPercentages(data);
    var data = JSON.stringify(aspectPercentages).split(',');
    var output = data.sort((a, b) => {
        return parseFloat(b.split(':')[1]) - parseFloat(a.split(':')[1]);
      })
      .map((aspect) => {
          return forExtension 
            ? `<div class="result"><span><b>${aspect.split(':')[0].replace(/"([^"]+(?="))"/g, '$1').replace('{','')}:</b></span><span class="number">${parseFloat(aspect.split(':')[1]).toString()} %</span></div>`
            : <div key={aspect}>
                <div>
                <b>{aspect.split(':')[0].replace(/"([^"]+(?="))"/g, '$1').replace('{','')}:</b>
                <span className={styles.numbers}>{parseFloat(aspect.split(':')[1]).toString()} %</span>
                </div>
             </div>
      });
    return output;
};
