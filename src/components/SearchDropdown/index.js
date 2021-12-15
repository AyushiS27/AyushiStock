import { useEffect, useRef, useState } from "react";
import {CONSTANTS} from "../../constants";
import { withRouter } from "react-router";
import './index.css';

function apiResponse(searchKey) {
    console.log("Run Api response for", searchKey);
        return new Promise((resolve, reject) => {
            fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${searchKey}&apikey=demo`)
            .then(response => response.json())
            .then(data => {console.log(data);
                if(data && data.bestMatches){
                    resolve(data.bestMatches);
                }
                else{
                    debugger;
                    throw new Error("Error ! Can't fetch List");
                }
                
            }).catch((error) => {
                debugger;
                console.log(error);
                reject(error);
              });
        }) 
}
const useDebounce = (value, ms) => {
    const [debouncedVal, setDebounceVal]  = useState('');
    const timer = useRef();
    
    useEffect(() =>{
        if(timer.current){
            clearTimeout(timer.current);
        }

        timer.current = setTimeout(() => {
            console.log("run debounce value");
            setDebounceVal(value);
        },ms);
    },[value]);
    
    return debouncedVal;
}

const SearchDropDown = withRouter((props) => {
    const [textInput, setTextInput] = useState('');
    const [list, setList] = useState([]);
    const [error, setError] = useState(false);
    const [inValidStock, setInvalidStock] = useState(false);
    const onInputChange = (evt) => {
        setError(false);
        setTextInput(evt.target.value);
        setInvalidStock(false);
    };

    const debounceText = useDebounce(textInput, 1000);

    const fetchSearchResult = async () => {
        let result;
        if(debounceText){
            try{
                result = await apiResponse(textInput);    
            }
            catch(e){
                console.log("Error",e);
                result = [];
                setError(true);
            }
        }else{
            result = [];
        }
        setList(result);
    }

    useEffect(async ()=>{

        fetchSearchResult(textInput);
        
    }, [debounceText]);

    const searchOnCLick = (e) => { // Cant chek the sceanrios as api was not working
        e.preventDefault();
        let isValidStock = list && list.filter((ele) => {
            return ele[CONSTANTS.SYM_NAME] === textInput;
        })

        if(isValidStock && isValidStock.length > 0){
            props.history.push(`/search/${textInput}`);
        }else{
            setInvalidStock(true);
        }
        setList([]);
    }

    const onClickListItem = (ele) => {
        setInvalidStock(false);
        setList(false);
        props.history.push(`/search/${ele[CONSTANTS.SYM_NAME]}`)
    }

    return (<div class="search-container">
        <div class="search-content">
            <form class="form-content" onSubmit={searchOnCLick}>
                <input type="text" value={textInput} onChange = {onInputChange} />
                <button>Search</button>
                {error && <div className={'err-mesg'}>{CONSTANTS.FETCH_LIST_ERROR_MESSAGE }</div>}
            </form>

            
            {list.length > 0  && <div className={`result-container`}>
                <ul>
                {list.map((ele) => {
                    return <li onClick={() => {onClickListItem(ele)}}>{ele[CONSTANTS.SYM_NAME]}</li>
                })}
                </ul>
            </div>}
        </div>
        {inValidStock && <div class="invalid-stock">Requested Stock: {textInput} is not valid !!</div>}
    </div>

        
    )

})

export default SearchDropDown;