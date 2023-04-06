/* eslint-disable react/jsx-no-target-blank */
import { useEffect, useState } from "react";

import { Box, Grid, Paper, Typography } from "@mui/material";
import useCasino from "../hooks/useCasino";
import { DataGrid } from "@mui/x-data-grid";
import { casinoBankrollTagTickers, casinoBankrollTokenDecimals, displayTickerToTicker } from "../const";
import { Link } from "react-router-dom";

const columns = [
  {
    field: 'user',
    headerName: 'User',
    flex: 1,
    width: 130,
    renderCell: (params) => (
      <Link to={`/casino/${params.value}`}>{params.value}</Link>
    ),
  },
  { 
    field: 'sum', 
    headerName: 'Total Profit', 
    width: 100, 
    flex: 1,
    type: 'number',
  },
  {
    field: 'count',
    headerName: 'Total Games',
    type: 'number',
    flex: 1,
    width: 130,
  },
];

const LeaderTable = ({ bets }) => {
  console.log(bets);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={bets}
        columns={columns}
        disableRowSelectionOnClick
        getRowId={(row) => row.user}
        initialState={{
          sorting: {
            sortModel: [{ field: 'sum', sort: 'desc' }],
          },
        }}
      />
    </div>
  );
}

export const Leaderboard = () => {
  const [sums, setSums] = useState(null);

  const {
    fetchAllSums
  } = useCasino();

  useEffect(() => {
    const fetchSums = async () => {
      const sums = await fetchAllSums();

      const splitBetsByTokenAndSum = (bets) => {
        return bets.reduce((acc, curr) => {
          Object.keys(curr).forEach((key) => {
            const [token, type] = key.split('_');

            const tag = [...casinoBankrollTagTickers]
              .find(([, value]) => {
                return value.includes(displayTickerToTicker.get(token))
              });

            const found = tag && acc.get(tag[0]);
            
            if(!found && type == 'sum') {
              curr[`${token}_count`] > 0 && acc.set(tag[0], [{
                user: curr.user_address,
                sum: Number(curr[`${token}_sum`]) / Math.pow(10, casinoBankrollTokenDecimals.get(tag[0])),
                count: curr[`${token}_count`],
              }]);
            } else if (found && type == 'sum'){
              curr[`${token}_count`] > 0 &&acc.set(tag[0], [
                ...found,
                {
                  user: curr.user_address,
                  sum: Number(curr[`${token}_sum`]) / Math.pow(10, casinoBankrollTokenDecimals.get(tag[0])),
                  count: curr[`${token}_count`],
                }
              ]);
            }
          });

          return acc;
        }, new Map());
      }

      setSums(splitBetsByTokenAndSum(sums));
    }

    fetchSums();
  }, []);

  return (
    <Box sx={{
      p: 3,
      flexGrow: 1,
    }}>
      {/* Setting up the Fluid Grid system */}
      <Grid>
        <Grid item xs={4}>
            {
              sums && [...sums].map(([key, value], i1) => {
                return (
                  <Paper key={`${i1}-box`} sx={{ 
                    p: 3, 
                    m: 2, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '1rem' 
                    }}
                  >
                    <Typography variant="h6" component="h2">
                      {casinoBankrollTagTickers.get(key)}
                    </Typography>
                    <LeaderTable bets={value} />
                  </Paper>
                )
              })
            }

        </Grid>
      </Grid>
    </Box>
  );
}