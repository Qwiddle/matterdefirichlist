import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { 
  sortAccounts,
  sortFarms 
} from '../util/util';

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} onClick={() => setOpen(!open)}>
        <TableCell>
          {row.rank + 1}
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            sx={{ ml: 1 }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <a href={`https://tzkt.io/${row.address}/`} target="_blank">{row.address}</a>
        </TableCell>
        <TableCell>ꜩ {row.totalValue}</TableCell>
        <TableCell>{row.numFarms}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Farms
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Symbol</TableCell>
                    <TableCell>Total Staked</TableCell>
                    <TableCell>Percent of Farm</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortFarms(row.farms).map((farm) => (
                    <TableRow key={farm.contract}>
                      <TableCell component="th" scope="row">
                        {farm.symbol}
                      </TableCell>
                      <TableCell>ꜩ {farm.value}</TableCell>
                      <TableCell>{((farm.staked / farm.balance) * 100).toFixed(2)} %</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    rank: PropTypes.number.isRequired,
    address: PropTypes.string.isRequired,
    totalValue: PropTypes.number.isRequired,
    numFarms: PropTypes.number.isRequired,
    farms: PropTypes.arrayOf(
      PropTypes.shape({
        symbol: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        totalPercent: PropTypes.string.isRequired,
        reserve: PropTypes.number.isRequired
      }),
    ).isRequired,
  }).isRequired,
};

export default function CollapsibleTable({ accounts, input }) {

  const data = !input.input ? 
    [...sortAccounts(accounts)] : 
    [...sortAccounts(accounts)].filter(acc => acc[0].toLowerCase().includes(input.input.toLowerCase()))

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell>Ranking</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>TVL</TableCell>
            <TableCell>Farms (#)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { data.map(([key, value], index) => {
            value.rank = index;
            value.address = key;
            value.numFarms = Object.keys(value.farms).length;
            value.farms = Object.keys(value.farms).map(key => value.farms[key]);
            
            return <Row key={key} row={value} />
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}