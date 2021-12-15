
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import SearchStockWidget from "./components/SearchStockWidget";

function App() {
  return (
    <div className="App">
       <Router>
      <div>
        
        {/* <Link to="/">Home</Link> */}
        <h1 className="heading-trade">Welcome to MyTrade</h1>
        <Switch>
          <Route path="/" render={() => {
                    return (
                      <Redirect to="/search" />  
                    )
                }}>
            <SearchStockWidget />
          </Route>
          {/* <Route path="/search">
            <SearchStockWidget />
          </Route> */}
        </Switch>
      </div>
    </Router>
    </div>
  );
}

export default App;
