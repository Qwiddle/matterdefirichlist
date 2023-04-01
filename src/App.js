import './App.css';
import { useState } from 'react';
import SearchAppBar from './components/SearchAppBar';
import { Routes, Route } from 'react-router-dom';
import { Matter } from './pages/Matter';
import { PageLayout } from './components/PageLayout';

const App = () => {
  const [searchFilter, setSearchFilter] = useState('');

  const handleInputChange = (input) => {
    setSearchFilter({ ...searchFilter, input });
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
