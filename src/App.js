import './App.css';
import { useState } from 'react';
import { useMatter } from './hooks/useMatter';
import CollapsibleTable from './components/CollapsibleTable';
import SearchAppBar from './components/SearchAppBar';
import CircularProgress from '@mui/material/CircularProgress';

const App = () => {
  const { 
    loading,
    accounts
  } = useMatter();

  const [searchFilter, setSearchFilter] = useState('');

  const handleInputChange = (input) => {
    setSearchFilter({ ...searchFilter, input });
  }

  return (
    <div className="app">
      <SearchAppBar handleInputChange={handleInputChange} />
      {loading ?
      <div className="loading">
        <CircularProgress color="inherit" />
      </div> : <div className="content">
        <CollapsibleTable accounts={accounts} input={searchFilter} />
      </div>}
    </div>
  )
}

export default App;
