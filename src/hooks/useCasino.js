import { casinoBankrollWhitelest } from '../const';
import { filterWhitelisted, splitBetsByTokenAndSum, getHighestWinStreak, matchTokenToBankroll } from '../util/bets';
import { fetchLeaderboard, fetchUserBets, fetchUserDayData, fetchUserInvestments } from '../api/casino';
import { useState } from 'react';
import { fetchUserAvatar } from '../api/tzkt';

const useCasino = () => {
  const [userBets, setUserBets] = useState([]);
  const [userBetsByToken, setUserBetsByToken] = useState([]);
  const [userInvestments, setUserInvestments] = useState([]);
  const [userDayData, setUserDayData] = useState([]);
  const [winningBets, setWinningBets] = useState(0);
  const [losingBets, setLosingBets] = useState(0);
  const [userHighestWinStreak, setUserHighestWinStreak] = useState(0);

  const fetchAvatar = async (userAddress) => {
    return fetchUserAvatar(userAddress);
  }

  const fetchAllSums = async () => {
    return fetchLeaderboard();
  }

  const fetchUserStats = async (userAddress) => {
    const [
      userBets,
      userInvestments,
      userDayData,
    ] = await Promise.all([
      fetchUserBets(userAddress),
      fetchUserInvestments(userAddress),
      fetchUserDayData(userAddress),
    ]);

    const {
      bets,
      betsByToken,
      dayData,
      investments,
      winningBets,
      losingBets,
      highestWinStreak,
    } = await transformUserStatistics(
      userBets,
      userDayData,
      userInvestments, 
      casinoBankrollWhitelest
    );

    setUserBets(bets);
    setUserBetsByToken(betsByToken);
    setUserInvestments(investments);
    setUserDayData(dayData);
    setWinningBets(winningBets);
    setLosingBets(losingBets);
    setUserHighestWinStreak(highestWinStreak);
  }

  const transformUserStatistics = async (bets, dayData, investments, whitelist) => {
    const whitelistedBets = filterWhitelisted(bets, whitelist);
    const whitelistedDayData = filterWhitelisted(dayData, whitelist);
    const betsByToken = splitBetsByTokenAndSum(whitelistedBets);
    const highestWinStreak = getHighestWinStreak(whitelistedBets);
    const winningBets = (whitelistedBets.filter((bet) => bet.winner)).length;
    const losingBets = (whitelistedBets.filter((bet) => !bet.winner)).length;

    const matchedBetsByToken = await matchTokenToBankroll(betsByToken);

    return {
      bets: whitelistedBets,
      betsByToken: matchedBetsByToken,
      dayData: whitelistedDayData,
      investments,
      winningBets,
      losingBets,
      highestWinStreak,
    }
  }

  return { 
    fetchUserStats,
    fetchAvatar,
    fetchAllSums,
    matchTokenToBankroll,
    userBets,
    userBetsByToken,
    userInvestments,
    userDayData,
    winningBets,
    losingBets,
    userHighestWinStreak,
  }
}

export default useCasino;