import './App.css';
import { useMatter } from './hooks/useMatter';
import CollapsibleTable from './components/CollapsibleTable';
import SearchAppBar from './components/SearchAppBar';

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
      <div className="content">
        <h1>Loading</h1>
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
