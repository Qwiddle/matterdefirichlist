import { casinoBankrollWhitelest } from '../const';
import { filterWhitelisted, splitBetsByTokenAndSum, getHighestWinStreak, matchTokenToBankroll } from '../util/bets';
import { fetchUserBets, fetchUserInvestments } from '../api/casino';
import { useState } from 'react';

const useCasino = () => {
  const [userBets, setUserBets] = useState([]);
  const [userBetsByToken, setUserBetsByToken] = useState([]);
  const [userInvestments, setUserInvestments] = useState([]);
  const [winningBets, setWinningBets] = useState(0);
  const [losingBets, setLosingBets] = useState(0);
  const [userHighestWinStreak, setUserHighestWinStreak] = useState(0);

  const fetchUserStats = async (userAddress) => {
    const [
      userBets,
      userInvestments
    ] = await Promise.all([
      fetchUserBets(userAddress),
      fetchUserInvestments(userAddress),
    ]);

    const {
      bets,
      betsByToken,
      investments,
      winningBets,
      losingBets,
      highestWinStreak,
    } = await transformUserStatistics(
      userBets, 
      userInvestments, 
      casinoBankrollWhitelest
    );

    setUserBets(bets);
    setUserBetsByToken(betsByToken);
    setUserInvestments(investments);
    setWinningBets(winningBets);
    setLosingBets(losingBets);
    setUserHighestWinStreak(highestWinStreak);
  }

  const transformUserStatistics = async (bets, investments, whitelist) => {
    const whitelistedBets = filterWhitelisted(bets, whitelist);
    const betsByToken = splitBetsByTokenAndSum(whitelistedBets);
    const highestWinStreak = getHighestWinStreak(whitelistedBets);
    const winningBets = (whitelistedBets.filter((bet) => bet.winner)).length;
    const losingBets = (whitelistedBets.filter((bet) => !bet.winner)).length;

    const matchedBetsByToken = await matchTokenToBankroll(betsByToken);

    return {
      bets: whitelistedBets,
      betsByToken: matchedBetsByToken,
      investments,
      winningBets,
      losingBets,
      highestWinStreak,
    }
  }

  return { 
    fetchUserStats,
    matchTokenToBankroll,
    userBets,
    userBetsByToken,
    userInvestments,
    winningBets,
    losingBets,
    userHighestWinStreak,
  }
}

export default useCasino;