import React from 'react'
import Login from './components/Login';
import Category from './components/Category';
import Product from './components/Product';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import ApiState from './contexts/ApiState';
import './App.css';
import BillingPage from './components/BillingPage';

function App() {

  return (
    <div className="App">
      <Router>
        <div>
        <Navbar/>
          <ApiState>
            <Routes>
              <Route path='/login' element={<Login/>}></Route>
              <Route path='/bills' element={<BillingPage/>}></Route>
              <Route path='/category' element={<Category/>}></Route>
              <Route path='/product' element={<Product/>}></Route>
              <Route path='/dashboard' element={<Dashboard/>}></Route>
            </Routes>
          </ApiState>
        </div>
      </Router>
    </div>
  );
}

export default App;
