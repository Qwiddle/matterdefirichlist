import './App.css';
import { useRef, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Matter } from './pages/Matter';
import { Casino } from './pages/Casino';
import { PageLayout } from './components/PageLayout';

const App = () => {
  const [searchFilter, setSearchFilter] = useState('');

  const userAddress = useRef('');

  const handleInputChange = (input) => {
    setSearchFilter(input);
    userAddress.current = input;
  }

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={
          <PageLayout
            handleInputChange={handleInputChange} 
          />
        }>
          <Route 
            index 
            element={<Matter 
              searchFilter={searchFilter} 
            />}
          />
          <Route 
            path="matter" 
            element={<Matter 
              searchFilter={searchFilter} 
            />}
          />
          <Route path="casino">
            <Route 
              path=":userAddress" 
              element={<Casino />}
            />
          </Route>
          <Route
            path="*" 
            element={<Matter
              searchFilter={searchFilter}
            />}
          />
        </Route>
      </Routes>
    </div>
  )
}

export default App;
