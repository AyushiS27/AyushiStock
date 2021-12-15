import { Route, useParams } from "react-router-dom";
import {useEffect, useState, useRef} from 'react';
import {CONSTANTS} from "../../constants";
import './index.css';

function apiResponse(stockId) {
    console.log("Run Api response for", stockId);
        return new Promise((resolve, reject) => {
            //fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${stockId}&apikey=demo`)
            fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=IBM&apikey=demo`)
            .then(response => response.json())
            .then(data => {console.log(data);
                if(data && Object.keys(data).length > 0 && data["Symbol"]){
                    resolve(data);
                }
                else{
                    throw new Error("Error ! Can't fetch List");
                }
                
            }).catch((error) => {
                console.log(error);
                reject(error);
              });
        }) 
}

function fetchStockPriceInterval(timer, stockId){
    console.log("Run Api response for");
        return new Promise((resolve, reject) => {
            //fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${stockId}&apikey=OEN1SRRSBJ5TSSNN&interval=${timer}min`)
            fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&outputsize=full&apikey=demo`)
            .then(response => response.json())
            .then(data => {console.log(data);
                if(data && Object.keys(data).length > 0){
                    resolve(data);
                }
                else{
                    throw new Error("Error ! Can't fetch List");
                }
                
            }).catch((error) => {
                console.log(error);
                reject(error);
              });
        }) 
}

export default function StockDetails({timer}){
    let { stockId } = useParams();
    const [currStock, setCurrStock] = useState('');
    const [tradeOn, setTradeOn] = useState(0);
    const [currPrice, setCurrPrice] = useState(136);
    const timerSet = useRef();

    useEffect(async() => {
        let result = await apiResponse(stockId);
        let priceResult;
        debugger;
        setCurrStock(result);
        timerSet.current = setInterval(async() => {
            console.log("run Interval");
            priceResult = await fetchStockPriceInterval(timer, stockId);
            console.log("Price ", priceResult);
            if(priceResult && Object.keys(priceResult).length > 1){ //Assumption
                debugger;
                let data = priceResult["Time Series (1min)"][priceResult["Meta Data"]["3. Last Refreshed"]];
                if(data){
                    setCurrPrice(data["1. open"]);
                    tradeOnVal(data["1. open"], data["4. close"])
                }
            }

        }, 1000 * 60 * timer);

        return () => clearInterval(timerSet.current);

    },[stockId]);

    const tradeOnVal = (openPrice, closePrice) => {
        let result = '', sign = '';
        let diff = (Number(openPrice) - Number(closePrice));
        result = diff/closePrice * 100;
        // if(diff > 0) {
        //     sign = "+";
        // }
       if(diff < 0) {
            sign = "-"
        } 
        result = 2; //Assumed
        result = result ? `${sign}${result.toFixed(2)} %` : 0;
        
        setTradeOn(result);
    }

    return (<div> 
        <h4>STOCK {stockId}</h4>
        {currStock && 
          <div className={'stock-details'}>
                <div className={'s-name'}>{currStock["Name"]}</div>
                <div className={'s-meta'}>
                    <div className={'sym'}><span className={'title'}>SYM:</span> {currStock["Symbol"]}</div>
                    <div className={'curr-price'}><span className={'title'}>Curr Price:</span> {currPrice} {currStock["Currency"]}</div>
                    <div className={'trade-on'}><span className={'title'}>Trade On:</span> {tradeOn}</div>
                    <div><span className={'title'}>P/E ratio:</span> {currStock["PERatio"]}</div>
                    <div><span className={'title'}>Mkt cap:</span> {currStock["MarketCapitalization"]}</div>
                </div>
                
                
                <div className={'s-details'}><span className={'title'}>Description: </span>{currStock["Description"]}</div>
                
          </div>
        }
    </div>);
}


/* Asumption
1. SetInterval api not running at first time as exoext details to come in metadatafrom stock metadata api
2. IBM was only working for setInterval as well as getting content so hardcoded and becoz of which the value is nt changing
3. Autocomplete api was working for tencent so validated content there and not able to validate fpr searchterm valid case as "TCHEY" was giving error in getting results of autocomplet
4. Validity - fetch results and check if symbol exists
5. Fetch resoponse by keys hardcodes "Meta data"etc
*/