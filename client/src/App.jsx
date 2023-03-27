import React from "react"
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import Home from "./routes/Home";
import ProfessorPage from "./routes/ProfessorPage";
import ReviewPage from "./routes/ReviewPage";

const App = () => {
    return(
        <Router>
            <Switch>
                <Route exact path='/' component={Home} />
                <Route exact path='/professor/:id' component={ProfessorPage} />
                <Route exact path='/review' component={ReviewPage} />
            </Switch>
        </Router>
    )
}

export default App;