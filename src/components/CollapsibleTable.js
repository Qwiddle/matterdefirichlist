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
import { sortAccounts } from '../util/util';

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          {row.address}
        </TableCell>
        <TableCell>{row.totalValue}</TableCell>
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
                  {row.farms.map((farm) => (
                    <TableRow key={farm.contract}>
                      <TableCell component="th" scope="row">
                        {farm.contract}
                      </TableCell>
                      <TableCell>{farm.staked}</TableCell>
                      <TableCell>NA</TableCell>
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
    address: PropTypes.string.isRequired,
    totalValue: PropTypes.number.isRequired,
    numFarms: PropTypes.number.isRequired,
    farms: PropTypes.arrayOf(
      PropTypes.shape({
        symbol: PropTypes.string.isRequired,
        staked: PropTypes.number.isRequired,
        totalPercent: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
};

export default function CollapsibleTable({ accounts }) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Address</TableCell>
            <TableCell>Total Staked</TableCell>
            <TableCell>Farms</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {[...sortAccounts(accounts)].map(([key, value]) => {
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