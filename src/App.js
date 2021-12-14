import React, { useState, useEffect } from 'react';
import './App.css';

const DEFAULT_SOURCE = 'USD';
const DEFAULT_DESTINATION = 'INR';

const DEFAULT_AMOUNT = 1;
const MIN_AMOUNT = 1;
const MAX_AMOUNT = 10000;

function App() {
  const [sourceCountry, setSourceCountry] = useState(DEFAULT_SOURCE);
  const [destinationCountry, setDestinationCountry] =
    useState(DEFAULT_DESTINATION);

  const [rates, setRates] = useState({});
  const [destinationList, setDestinationList] = useState([]);
  const [amount, setAmount] = useState(DEFAULT_AMOUNT);

  useEffect(() => {
    fetch(`https://open.er-api.com/v6/latest/${sourceCountry}`)
      .then((response) => response.json())
      .then((response) => {
        console.log('res==>', response);
        setRates(response.rates);
        const filteredCountryList = Object.keys(response.rates).filter(
          (currencyCode) => currencyCode !== sourceCountry
        );
        setDestinationList(filteredCountryList);
      })
      .catch((err) => {
        console.error('error fetching countries', err);
        // setCountries([]);
        setRates({});
        setDestinationList([]);
      });
  }, [sourceCountry]);

  const onAmountChange = (e) => {
    console.log('amount is ', e.target.value);
    const newAmount = e.target.value;
    if (newAmount >= MIN_AMOUNT && newAmount <= MAX_AMOUNT) {
      setAmount(newAmount);
    }
  };
  const onSourceChange = (e) => {
    console.log('source is ', e.target.value);
    const currencyCode = e.target.value;
    setSourceCountry(currencyCode);
  };
  const onDestinationChange = (e) => {
    console.log('destination is ', e.target.value);
    const currencyCode = e.target.value;
    setDestinationCountry(currencyCode);
  };

  const getConvertedAmount = () => {
    const rate = rates[destinationCountry];
    return amount * rate;
  };

  const reset = () => {
    setSourceCountry(DEFAULT_SOURCE);
    setDestinationCountry(DEFAULT_DESTINATION);
    setAmount(DEFAULT_AMOUNT);
  };

  const swap = () => {
    const source = sourceCountry;
    const destination = destinationCountry;

    setSourceCountry(destination);
    setDestinationCountry(source);
  };

  return (
    <div className="App">
      <div className="container">
        <div className="textCenter">Exchange Rate</div>
        <h2 className="textCenter">{`${destinationCountry} ${rates[sourceCountry]}`}</h2>
        <div className="amountBox">
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            onChange={onAmountChange}
            value={amount}
            type="number"
            min={MIN_AMOUNT}
            max={MAX_AMOUNT}
          />
        </div>
        <div className="selectionRow">
          <div className="selectBox">
            <label htmlFor="source">From:</label>
            <select
              name="source"
              id="source"
              value={sourceCountry}
              onChange={onSourceChange}
            >
              {Object.keys(rates).map((currencyCode) => (
                <option key={currencyCode} value={currencyCode}>
                  {currencyCode}
                </option>
              ))}
            </select>
          </div>
          <img src="swap.png" alt="swap" onClick={swap} className="swapImg" />
          <div className="selectBox">
            <label htmlFor="destination">To:</label>
            <select
              name="destination"
              id="destination"
              value={destinationCountry}
              onChange={onDestinationChange}
            >
              {destinationList.map((currencyCode) => (
                <option key={currencyCode} value={currencyCode}>
                  {currencyCode}
                </option>
              ))}
            </select>
          </div>
        </div>

        <h3>Converted Amount: {getConvertedAmount()}</h3>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}

export default App;
