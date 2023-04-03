import { DataGrid } from '@mui/x-data-grid';
import { casinoBankrollTagTickers } from '../const';

const columns = [
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
  console.log(bets);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={bets}
        columns={columns}
        disableRowSelectionOnClick
        pageSize={5}
        rowsPerPageOptions={[5]}
        getRowId={(row) => row.gameId}
      />
    </div>
  );
}