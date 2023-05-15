import { getAspectPercentages } from "./marshal";
import styles from 'styles/index.module.css';

const renderResult = (aspect, forExtension) => {
  const key = aspect.split(':')[0].replace(/"([^"]+(?="))"/g, '$1').replace('{', '');
  const value = parseFloat(aspect.split(':')[1]).toString();
  const numberClass = forExtension ? 'number' : styles.number;

  return `<div class="ext-result"><span><b>${key}:</b></span><span class="${numberClass}">${value} %</span></div>`;
};

export const getAspectPercentagesDisplay = (data, forExtension = false) => {
  const aspectPercentages = getAspectPercentages(data);
  const dataAsArray = JSON.stringify(aspectPercentages).split(',');

  const sortedData = dataAsArray.sort((a, b) => {
    return parseFloat(b.split(':')[1]) - parseFloat(a.split(':')[1]);
  });

  const output = sortedData.map((aspect) => {
    const htmlString = renderResult(aspect, forExtension);

    return forExtension
      ? htmlString
      : <div key={aspect} dangerouslySetInnerHTML={{ __html: htmlString }} />;
  });

  return output;
};
