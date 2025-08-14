
import './App.css'
import { use, useEffect,useState } from 'react'

import CurrencyRow from './CurrencyRow'

const BASE_URL='https://api.frankfurter.app/latest'

function App() {
  const [currencyOptions, setCurrencyOptions] = useState([])
  const[fromCurrency,setFromCurrency]=useState()
  const[toCurrency,setToCurrency]=useState()
  const[exchageRate,setExchangeRate]=useState()
  const[amount,setAmount]=useState(1)
  const[amountInFromCurrency,setAmountInFromCurrency]=useState(true)
  let toAmount,fromAmount
  if(amountInFromCurrency){
    fromAmount=amount
    toAmount=amount * exchageRate

  }else{
    toAmount=amount
    fromAmount=amount / exchageRate
  }
  

  
  useEffect(()=>{
    fetch(BASE_URL)
    .then(res=>res.json())
    .then(data=>{
      setCurrencyOptions([data.base, ...Object.keys(data.rates)])
      // Set default currencies to USD and INR if available, else fallback
      const availableCurrencies = [data.base, ...Object.keys(data.rates)];
      const defaultFrom = availableCurrencies.includes('USD') ? 'USD' : data.base;
      const defaultTo = availableCurrencies.includes('INR') ? 'INR' : Object.keys(data.rates)[0];
      setFromCurrency(defaultFrom);
      setToCurrency(defaultTo);
      setExchangeRate(data.rates[defaultTo] || data.rates[Object.keys(data.rates)[0]]);
    })

    
    
  },[])

  useEffect(()=>{
    if(fromCurrency != null && toCurrency != null){
      fetch(`${BASE_URL}?base=${fromCurrency}&symbols=${toCurrency}`)
        .then(res=>res.json())
        .then(data=>setExchangeRate(data.rates[toCurrency]))
    }
  },[fromCurrency,toCurrency])

  function handleFromAmountChange(e){
    setAmount(e.target.value)
    setAmountInFromCurrency(true)
  }
  function handleToAmountChange(e){
    setAmount(e.target.value)
    setAmountInFromCurrency(false)
  }
 
  return (
    <>
    <div className='card'>
      <h1> Currency Converter</h1>
      <CurrencyRow
      currencyOptions={currencyOptions}
      selectedCurrency={fromCurrency}
      onChangeCurrency={e=>setFromCurrency(e.target.value)}
      amount={fromAmount}
      onChangeAmount={handleFromAmountChange}
      
      />

      
      <div className='equals'>
        <p>&#8644;</p>
        
      </div>
      <CurrencyRow
      currencyOptions={currencyOptions}
      selectedCurrency={toCurrency}
      onChangeCurrency={e=>setToCurrency(e.target.value)}
      amount={toAmount}
      onChangeAmount={handleToAmountChange}
      
      />
      </div>
      
    </>
  )
}

export default App
