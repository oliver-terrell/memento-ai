import { getAspectPercentages } from "./marshal";
import styles from 'styles/index.module.css';

const renderExtensionResult = (aspect) => {
  const key = aspect.split(':')[0].replace(/"([^"]+(?="))"/g, '$1').replace('{', '');
  const value = parseFloat(aspect.split(':')[1]).toString();

  return `<div class="result"><span><b>${key}:</b></span><span class="number">${value} %</span></div>`;
};

const renderWebAppResult = (aspect) => {
  const key = aspect.split(':')[0].replace(/"([^"]+(?="))"/g, '$1').replace('{', '');
  const value = parseFloat(aspect.split(':')[1]).toString();

  return (
    <div key={aspect}>
      <div>
        <b>{key}:</b>
        <span className={styles.numbers}>{value} %</span>
      </div>
    </div>
  );
};

export const getAspectPercentagesDisplay = (data, forExtension=false) => {
    const aspectPercentages = getAspectPercentages(data);
    const dataArray = JSON.stringify(aspectPercentages).split(',');
    var output = dataArray.sort((a, b) => {
        return parseFloat(b.split(':')[1]) - parseFloat(a.split(':')[1]);
    })
    .map(aspect => forExtension ? renderExtensionResult(aspect) : renderWebAppResult(aspect));
    return output;
};
