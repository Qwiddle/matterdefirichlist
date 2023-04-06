import { SALSA_CASINO_API } from './api';

export const fetchUserBets = async (userAddress, limit = 10000) => {
  const req = `${SALSA_CASINO_API}/getUserBets?userAddress=${userAddress}&limit=${limit}`;
  const res = await (await fetch(req)).json();

  const { bet } = res;

  return bet;
}

export const fetchUserInvestments = async (userAddress, limit = 10000) => {
  const req = `${SALSA_CASINO_API}/getUserInvestments?userAddress=${userAddress}&limit=${limit}`;
  const res = await (await fetch(req)).json();

  const { investment } = res;

  return investment;
}

export const fetchLeaderboard = async () => {
  const req = `${SALSA_CASINO_API}/getLeaderboard`;
  const res = await (await fetch(req)).json();

  const { bet_total_leaderboard_vw: leaderboard } = res;

  return leaderboard;
}