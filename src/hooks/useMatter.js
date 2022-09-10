import { useEffect, useState } from 'react';
import { mapAccounts, matchFarms } from '../util/util.js';
import { 
  fetchSpicyPools, 
  fetchSpicyTokens, 
  fetchMatterPrice 
} from '../api/spicy.js';
import { 
  fetchMatterConfigs,
  fetchMatterFarms,
  fetchAccountsInternal,
} from '../api/tzkt.js';

export const useMatter = () => {
  const [loading, setLoading] = useState(true)
  const [tokens, setTokens] = useState(null)
  const [pools, setPools] = useState(null)
  const [matterPrice, setMatterPrice] = useState(null)
  const [configs, setConfigs] = useState(null)
  const [farms, setFarms] = useState(null)
  const [accounts, setAccounts] = useState(null)

  const fetchAll = async () => {
    const accounts = await fetchAccountsInternal();
    const farms = await fetchMatterFarms();
    const configs = await fetchMatterConfigs();
    const tokens = await fetchSpicyTokens();
    const pools = await fetchSpicyPools();

    const matchedFarms = matchFarms(pools, tokens, farms, configs);
    const matchedAccounts = mapAccounts(accounts, matchedFarms);

    setTokens(tokens);
    setPools(pools);
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
    matterPrice,
    configs, 
    farms, 
    accounts
  }
};