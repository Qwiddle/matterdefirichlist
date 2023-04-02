import './App.css';
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Matter } from './pages/Matter';
import { Casino } from './pages/Casino';
import { PageLayout } from './components/PageLayout';

const App = () => {
  const [searchFilter, setSearchFilter] = useState('');

  const handleInputChange = (input) => {
    setSearchFilter(input);
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
          <Route 
            path="casino"
            element={<Casino />}
          />
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
