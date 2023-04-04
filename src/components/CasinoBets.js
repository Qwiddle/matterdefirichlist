import { DataGrid } from '@mui/x-data-grid';
import { casinoBankrollTagTickers } from '../const';
import { sortBetsByGame } from '../util/util';

const renderDateColumn = (params) => {
  if (!params.value) return '';

  const renderedDate = new Date(params.value).toLocaleDateString(
    'en-US',
    {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
    }
  );

  return (<a href={`https://tzkt.io/${params.row.operation}`} target="_blank" rel="noreferrer">{renderedDate}</a>);
}

const columns = [
  {
    field: 'timestamp',
    headerName: 'Date',
    width: 130,
    flex: 1,
    renderCell: (params) => renderDateColumn(params),
  },
  { 
    field: 'token', 
    headerName: 'Token', 
    width: 130,
    flex: 1,
    valueGetter: (params) =>
      casinoBankrollTagTickers.get(params.row.tag) || `Unknown`,
  },
  { 
    field: 'amount', 
    headerName: 'Bet Amount', 
    width: 100, 
    flex: 1,
    type: 'number', 
  },
  {
    field: 'payout',
    headerName: 'Payout',
    type: 'number',
    flex: 1,
    width: 130,
  },
  {
    field: 'winner',
    headerName: 'Winner',
    width: 160,
    type: 'boolean',
    flex: 1
  },
];

export const CasinoBets = ({ bets }) => {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={sortBetsByGame(bets, true)}
        columns={columns}
        disableRowSelectionOnClick
        getRowId={(row) => row.gameId}
      />
    </div>
  );
}