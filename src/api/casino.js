import { SALSA_CASINO_API } from './api';

export const fetchUserBets = async (userAddress, limit = 1000) => {
  const req = `${SALSA_CASINO_API}/getUserBets?userAddress=${userAddress}&limit=${limit}`;
  const res = await (await fetch(req)).json();

  const { bet } = res;

  return bet;
}

export const fetchUserInvestments = async (userAddress, limit = 1000) => {
  const req = `${SALSA_CASINO_API}/getUserInvestments?userAddress=${userAddress}&limit=${limit}`;
  const res = await (await fetch(req)).json();

  const { investment } = res;

  return investment;
}