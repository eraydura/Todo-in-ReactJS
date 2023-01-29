import "./App.css";
import Todo from "./components/Todo";
import TodoImage from "./components/Todoimage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/todo" element={<Todo />} />
          <Route path="/todoimage" element={<TodoImage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
