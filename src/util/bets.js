import { fetchSpicyToken } from '../api/spicy'

export const isWinningBet = (bet) => {
  return bet.winner
}

export const filterWhitelisted = (bets, whitelist) => {
  return bets.filter((bet) => whitelist.has(bet.tag))
}

export const splitBetsByTokenAndSum = (bets) => {
  return bets.reduce((acc, curr) => {
    const found = acc.get(curr.tag);

    if (!found) {
      acc.set(curr.tag, {
        bets: [curr], 
        total: parseInt(curr.amount), 
      });
    } else {
      acc.set(curr.tag, {
        ...found, 
        bets: [...found.bets, curr],
        total: found.total + parseInt(curr.amount)
      });
    }

    return acc;
  }, new Map());
}

export const getWinningBets = (bets) => {
  return bets.filter((bet) => bet.winner)
}

export const getHighestWinStreak = (bets) => {
  let streak, highest = 0;

  bets.forEach((bet) => {
    bet.winner == true ? streak++ : streak = 0;
    if (streak > highest) highest = streak;
  });

  return highest;
}

export const getTotalWageredToken = (bets) => {
  return bets.reduce((acc, curr) => {
    return acc + Number(curr.amount);
  }, 0)
}

export const matchTokenToBankroll = async (tokens) => {
  for (let [key, value] of tokens) {
    const tokenData = await fetchSpicyToken(key);
    const { bets } = value;

    tokens.set(key, {
      bets: bets.map((bet) => ({
        ...bet,
        amount: bet.amount / Math.pow(10, tokenData.decimals),
        payout: bet.payout / Math.pow(10, tokenData.decimals),
      })),
      token: tokenData,
      totalShifted: value.total / Math.pow(10, tokenData.decimals),
      totalWinnings: getTotalWin(bets) / Math.pow(10, tokenData.decimals),
      totalLosses: getTotalLoss(bets) / Math.pow(10, tokenData.decimals),
    });
  }

  return tokens;
};

export const tokenMapToArray = (tokens) => {
  const bets = [];

  tokens.forEach(value => {
    bets.push(...value.bets);
  });

  return bets;
}

export const getTotalWagered = (bets) => {
  return Object.values(bets);
}

export const getTotalWin = (bets) => {
  return bets.reduce((acc, curr) => {
    return acc + (curr.winner ?  Number(curr.payout) : 0);
  }, 0)
}

export const getTotalLoss = (bets) => {
  return bets.reduce((acc, curr) => {
    return acc + (curr.winner ? 0 : Number(curr.amount));
  }, 0)
}