import { Copyright } from '@mui/icons-material'
import { Box, Card, CardContent, Container, Grid, Paper, Typography } from '@mui/material'
import { UserStatistics } from '../components/UserStatistics'
import useCasino from '../hooks/useCasino';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { casinoBankrollTagTickers } from '../const';
import { CasinoBets } from '../components/CasinoBets';
import { tokenMapToArray } from '../util/bets';

export const Casino = () => {
  const { userAddress } = useParams();

  const [totalWagered, setTotalWagered] = useState([]);
  const [totalWinnings, setTotalWinnings] = useState([]);
  const [totalLosses, setTotalLosses] = useState([]);

  const { 
    fetchUserStats,
    userBets,
    userBetsByToken,
    userInvestments,
    winningBets,
    losingBets,
    userHighestWinStreak,
  } = useCasino();

  useEffect(() => {
    if(userAddress) {
      const fetchStats = async () => { 
        await fetchUserStats(userAddress);
      }

      fetchStats().catch(console.error);
    }
  }, []);

  useEffect(() => {
    if (userBetsByToken) {
      setTotalWagered(Array.from(userBetsByToken).map(([key, value]) => {
        return {
          symbol: value.token.metadata.symbol,
          total: value.totalShifted,
          won: value.totalWinnings,
          lost: value.totalLosses,
        }
      }));


    }
  }, [userBetsByToken]);

  

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
      }}
    >
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center' }}>
      <div style={{overflow: "hidden", textOverflow: "ellipsis", textAlign: 'center', width: '100%'}}> 
        <Typography variant="h5" fontWeight={600} noWrap>{userAddress}</Typography>
      </div>

        <Grid container spacing={3}>
          {/* Chart */}
          <Grid item xs={12} md={8} lg={9}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 310
              }}
            >
              <div style={{overflow: "hidden", textOverflow: "ellipsis", width: '100%'}}> 
                <Typography variant="h5" fontWeight={600} noWrap>Lifetime Wagers</Typography>
              </div>  
            </Paper>
          </Grid>
          {/* Recent Deposits */}
          <Grid item xs={12} md={4} lg={3}>
            <Card>
              <CardContent>
                <div style={{overflow: "hidden", textOverflow: "ellipsis", width: '100%'}}> 
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  Lifetime Wagers
                  </Typography>
                </div>
                <Typography variant="h5" component="div">
                  Total Bets: {userBets && userBets.length}
                </Typography><br></br>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {totalWagered && totalWagered.map((wager, index) => (
                  <>
                    <b>{wager.symbol}</b>: - total: <b>{wager.total}</b>
                    <Typography 
                      sx={{ 
                        fontSize: 14, 
                      }}
                      color={`${(wager.won - wager.lost) > 0 ? `green` : `red`}`}
                      gutterBottom
                    >
                    p&l: <b>{wager.won - wager.lost > 0 ? `${(wager.won - wager.lost).toFixed(2)} ++` : `${(wager.won - wager.lost).toFixed(2)} --`}</b>
                    </Typography>
                  </>
                ))}  
                </Typography>
                <Typography variant="body2">
                  the sdao community thanks you
                  <br />
                </Typography>
              </CardContent>
            </Card>
            <UserStatistics />
          </Grid>
          {/* Recent Orders */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <CasinoBets bets={tokenMapToArray(userBetsByToken)} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}