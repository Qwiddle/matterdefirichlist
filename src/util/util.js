import BigNumber from 'bignumber.js';
import { spicyStablePoolSymbol } from '../const';

const lpToTez = (staked, farm) => {
  if(!farm.single) {
    const { reserve, supply, decimals } = farm.pool;
    const tezPerLp = BigNumber(reserve).dividedBy(BigNumber(supply).shiftedBy(-decimals));
    const lpValue = tezPerLp.multipliedBy(BigNumber(staked).shiftedBy(-decimals));

    return lpValue.toFixed(2);
  } else {
    const { derivedXtz, decimals } = farm.token;
    const tokenValue = BigNumber(derivedXtz).multipliedBy(BigNumber(staked).shiftedBy(-decimals));

    return tokenValue.toFixed(2);
  }
}

export const matchFarms = (spicyPools, spicyStablePools, spicyTokens, farms, configs, balances) => {
  const today = new Date();
  const active = new Date(configs[0].active_time);

  let activeConfig = today.getTime() >= active.getTime() ?
    configs[0].farm_configs : 
    configs[1].farm_configs

  const mapped = farms.reduce((a, p) => {
    const findToken = spicyTokens.find(token => token.tag === `${p.key.fa2_address}:${p.key.token_id}`);
    const findPool = spicyPools.find(pool => pool.contract === p.key.fa2_address);
    const findStablePool = spicyStablePools.find(pool => pool.contract === p.key.fa2_address);
    const findConfig = activeConfig.find(config => config.key.fa2_address === p.key.fa2_address);
    const findBalance = balances.find(balance => balance.contract.address === p.key.fa2_address);

    if (findConfig) {
      a.push({
        key: p.key,
        value: p.value,
        ...(findPool  && { 
          pool: { 
            supply: p.supply,
            ...findPool,
            decimals: 18,
            balance: findBalance.balance
          },
          symbol: !findStablePool ? p.symbol : spicyStablePoolSymbol
        }),
        ...(findStablePool  && { 
          pool: { 
            supply: p.supply,
            ...findStablePool,
            decimals: 18,
            balance: findBalance.balance
          },
          symbol: !findStablePool ? p.symbol : spicyStablePoolSymbol
        }),
        ...(findToken && { 
          token: { 
            supply: p.supply,
            ...findToken,
            balance: findBalance.balance
          },
          symbol: !findStablePool ? p.symbol : spicyStablePoolSymbol,
        }),
        single: findPool || findStablePool ? false : true,
        rps: Number(findConfig.value.reward_per_sec),
      });
    }

    return a;
  }, []);

  return mapped;
}

export const mapAccounts = (accounts, farms) => {
  const mapped = accounts.reduce((map, current) => {
    const address = current.key.user_address;
    const grouped = map.get(address);
    
    const farm = farms.find(farm => farm.key.fa2_address === current.key.token.fa2_address);
    const farmValue = farm && current.value.staked != 0 ? Number(lpToTez(BigNumber(current.value.staked), farm)) : 0;
    const farmReserve = farm && farm.pool ? farm.pool.reserve : 0;
    const symbol = farm && farm.symbol ? farm.symbol : '';

    current.totalValue = Number(farmValue);

    if(farm && Number(farmValue) != 0) {
      const farmBalance = farm.pool ? farm.pool.balance : farm.token.balance;

      if(!grouped) {
        map.set(address, { 
          totalValue: current.totalValue,
          farms: {
            ...current.farms,
            ...(farmValue != 0 && { 
              [current.key.token.fa2_address]: { 
                tokenId: current.key.token.token_id,
                reward: BigNumber(current.value.reward), 
                staked: Number(current.value.staked),
                contract: current.key.token.fa2_address,
                totalPercent: '0',
                value: Number(farmValue),
                symbol: symbol,
                reserve: farmReserve,
                balance: Number(farmBalance)
              }
            }),
          }
        });
      } else {
        map.set(address, { 
          ...grouped, 
          totalValue: Number(grouped.totalValue) + Number(current.totalValue), 
          farms: {
            ...grouped.farms, 
            ...(farmValue != 0 && { 
              [current.key.token.fa2_address]: { 
                tokenId: current.key.token.token_id,
                reward: BigNumber(current.value.reward), 
                staked: Number(current.value.staked),
                contract: current.key.token.fa2_address,
                totalPercent: '0',
                value: Number(farmValue),
                symbol: symbol,
                reserve: farmReserve,
                balance: Number(farmBalance)
              }
            }),
          }
        });
      }
    }

    return map;
  }, new Map());

  return mapped;
}

export const sortAccounts = (accounts, descend = true) => {
  const sorted = [...accounts].sort((a, b) => {
    if(a[1].totalValue > b[1].totalValue) {
      return descend ? -1 : 1;
    } else {
      return descend ? 1 : -1;
    }
  })

  return sorted;
}

export const sortFarms = (farms, descend = true) => {
  const sorted = [...farms].sort((a, b) => {
    if(a.value > b.value) {
      return descend ? -1 : 1;
    } else {
      return descend ? 1 : -1;
    }
  })

  return sorted;
}

export const sortBetsByGame = (bets, descend = false) => {
  return bets.sort((a, b) => {
    if(a.gameId > b.gameId) {
      return descend ? -1 : 1;
    } else {
      return descend ? 1 : -1;
    }
  })
}