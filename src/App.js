import './App.css';
import { useMatter } from './hooks/useMatter';
import CollapsibleTable from './components/CollapsibleTable';
import SearchAppBar from './components/SearchAppBar';
import CircularProgress from '@mui/material/CircularProgress';

const App = () => {
  const { 
    loading, 
    tokens, 
    pools, 
    matterPrice,
    configs,
    farms,
    accounts
  } = useMatter();

  if(loading) return (
    <div className="app">
      <SearchAppBar />
      <div className="loading">
        <CircularProgress color="inherit" />
      </div>
    </div>
  )

  return (
    <div className="app">
      <SearchAppBar />
      <div className="content">
        <CollapsibleTable accounts={accounts} />
      </div>
    </div>
  )
}

export default App;
