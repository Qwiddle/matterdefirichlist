import './App.css';
import { useEffect, useRef, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Matter } from './pages/Matter';
import { Casino } from './pages/Casino';
import { PageLayout } from './components/PageLayout';

const App = () => {
  const [searchFilter, setSearchFilter] = useState('');
  const userAddress = useRef('');

  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleInputChange = (input) => {
    setSearchFilter(input);
    userAddress.current = input;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if(location.pathname.includes('casino')) {
      navigate(`/casino/${userAddress.current}`);
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={
          <PageLayout
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
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
            >
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
