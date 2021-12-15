import { Route, useParams } from "react-router-dom";
import SearchDropDown from "../SearchDropdown";
import StockDetails from "../StockDetails";


export default function SearchStockWidget(){

    return (
    <div>
      <SearchDropDown/>

      <Route path={`/search/:stockId`}>
        <StockDetails timer={1}/>
      </Route>
    </div>
  );
}


/*  function Output(){
	console.log(a); //undefined
	console.log(b); //undefined
  
	var d=30;
  
	console.log(c); // undefined
  
	var b,c=20;
  a=10;
  
  console.log(d); //function d(){}
  
  function d(){
  	return 40;
  }
}*/