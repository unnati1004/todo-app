import "./App.css";
import { BrowserRouter as Router, Route,Routes} from "react-router-dom";
import { Todo } from "./component/todo";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Todo />} />
          {/* Add more routes here */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
