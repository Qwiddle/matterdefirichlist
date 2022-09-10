import './App.css';
import { useMatter } from './hooks/useMatter';

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

  if(loading) return <h1>Loading</h1>

  return (
    <div className="app">
      <h1>Data fetched successfully.</h1>
      {JSON.stringify(tokens)}
      <h1>Pools</h1>
      {JSON.stringify(pools)}
    </div>
  )
}

export default App;
