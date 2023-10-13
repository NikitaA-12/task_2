import { useState, useEffect } from 'react';
import CurrencyInput from './CurrencyInput';
import axios from 'axios';
import { format } from 'date-fns';
import './App.css';
import './CurrencyInput.css';
const API_KEY = '64a33ce7a17da81bbd376919';
const CURRENCY_API = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

function App() {
  const [amountOne, setAmountOne] = useState(1);
  const [amountTwo, setAmountTwo] = useState(1);
  const [currencyOne, setCurrencyOne] = useState('USD');
  const [currencyTwo, setCurrencyTwo] = useState('RUB');

  const [currencyRates, setCurrencyRates] = useState([]);

  useEffect(() => {
    axios
      .get(CURRENCY_API)
      .then((response) => setCurrencyRates(response.data.conversion_rates))
      .catch((err) => {
        console.log(err);
        setCurrencyRates(null);
      });
  }, []);

  const handleAmountOneChange = (amountOne) => {
    setAmountTwo(
      formatCurrency((amountOne * currencyRates[currencyTwo]) / currencyRates[currencyOne]),
    );
    setAmountOne(amountOne);
  };

  useEffect(() => {
    if (!currencyRates) {
      handleAmountOneChange(1);
    }
  }, [currencyRates]);

  const formatCurrency = (number) => {
    return number.toFixed(2);
  };

  const handleAmountTwoChange = (amountTwo) => {
    setAmountOne(
      formatCurrency((amountTwo * currencyRates[currencyOne]) / currencyRates[currencyTwo]),
    );
    setAmountTwo(amountTwo);
  };

  const handleCurrencyOneChange = (currencyOne) => {
    setAmountTwo(
      formatCurrency((amountOne * currencyRates[currencyTwo]) / currencyRates[currencyOne]),
    );
    setCurrencyOne(currencyOne);
  };

  const handleCurrencyTwoChange = (currencyTwo) => {
    setAmountOne(
      formatCurrency((amountTwo * currencyRates[currencyOne]) / currencyRates[currencyTwo]),
    );
    setCurrencyTwo(currencyTwo);
  };

  if (!currencyRates) return <p>Something went wrong!</p>;

  if (currencyRates.length === 0) return <p>Loading...</p>;

  return (
    <>
      <div>
        <h1>Конвертер валют</h1>
        <p className="oneCurrencyText">1 {currencyOne} равен</p>
        <p className="rateText">
          {formatCurrency(amountTwo / amountOne)} {currencyTwo}
        </p>
        <p className="date">{format(new Date(), 'dd/MM/yyyy h:mm')}</p>
        <CurrencyInput
          amount={amountOne}
          currency={currencyOne}
          currencies={Object.keys(currencyRates)}
          onAmountChange={handleAmountOneChange}
          onCurrencyChange={handleCurrencyOneChange}
        />
        <CurrencyInput
          amount={amountTwo}
          currency={currencyTwo}
          currencies={Object.keys(currencyRates)}
          onAmountChange={handleAmountTwoChange}
          onCurrencyChange={handleCurrencyTwoChange}
        />
      </div>
    </>
  );
}

export default App;
