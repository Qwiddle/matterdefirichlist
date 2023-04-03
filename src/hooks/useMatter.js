import { useEffect, useState } from 'react';
import { mapAccounts, matchFarms } from '../util/util.js';
import { 
  fetchSpicyPools, 
  fetchSpicyTokens, 
  fetchMatterPrice, 
  fetchSpicyStablePools
} from '../api/spicy.js';
import {
  fetchMatterBalances,
  fetchMatterConfigs,
  fetchMatterFarms,
  fetchAccountsInternal,
} from '../api/tzkt.js';

export const useMatter = () => {
  const [loading, setLoading] = useState(true)
  const [tokens, setTokens] = useState(null)
  const [pools, setPools] = useState(null)
  const [stablePools, setStablePools] = useState(null)
  const [matterPrice, setMatterPrice] = useState(null)
  const [configs, setConfigs] = useState(null)
  const [farms, setFarms] = useState(null)
  const [accounts, setAccounts] = useState(null)

  const fetchAll = async () => {
    const [
      accounts, 
      farms, 
      configs, 
      tokens, 
      pools, 
      stablePools, 
      balances
    ] = await Promise.all([
      fetchAccountsInternal(),
      fetchMatterFarms(),
      fetchMatterConfigs(),
      fetchSpicyTokens(),
      fetchSpicyPools(),
      fetchSpicyStablePools(),
      fetchMatterBalances(),
    ]);

    const matchedFarms = matchFarms(
      pools,
      stablePools,
      tokens, 
      farms, 
      configs,
      balances
    );
    
    const matchedAccounts = mapAccounts(
      accounts, 
      matchedFarms
    );

    setTokens(tokens);
    setPools(pools);
    setStablePools(stablePools);
    setConfigs(configs);
    setFarms(matchedFarms);
    setAccounts(matchedAccounts);
    setMatterPrice(await fetchMatterPrice());
    setLoading(false);
  }

  useEffect(() => {
    fetchAll();
  }, []);

  return { 
    loading, 
    tokens, 
    pools,
    stablePools,
    matterPrice,
    configs, 
    farms, 
    accounts
  }
};