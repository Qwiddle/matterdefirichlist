import CollapsibleTable from '../components/CollapsibleTable';
import { useMatter } from '../hooks/useMatter';
import CircularProgress from '@mui/material/CircularProgress';

export const Matter = ({ searchFilter }) => {
  const { 
    loading,
    accounts
  } = useMatter();
  return loading ? (
    <div className="loading">
      <CircularProgress color="inherit" />
    </div>
  ) : (
    <div className="content">
      <CollapsibleTable accounts={accounts} input={searchFilter} />
    </div> 
  )
}