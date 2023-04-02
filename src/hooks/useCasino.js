import { fetchUserBets, fetchUserInvestments } from '../api/casino';
import { useState, useEffect } from 'react';

const useCasino = (userAddress) => {
  const [investments, setInvestments] = useState(null);
  const [bets, setBets] = useState(null);

  const fetchAll = async () => {
    const [
      userBets,
      userInvestments
    ] = await Promise.all([
      fetchUserBets(userAddress),
      fetchUserInvestments(userAddress),
    ]);

    setBets(userBets);
    setInvestments(userInvestments);
  }

  useEffect(() => {
    fetchAll();
  }, [])

  return {
    investments,
    bets,
  }
}

export default useCasino;