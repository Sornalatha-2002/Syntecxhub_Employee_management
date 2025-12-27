import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <div className="container">
            <Routes>
              <Route path="/" element={<EmployeeList />} />
              <Route path="/add" element={<EmployeeForm />} />
              <Route path="/edit/:id" element={<EmployeeForm isEdit={true} />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
