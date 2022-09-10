import { useEffect, useState } from 'react';
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
    setTokens(await fetchSpicyTokens());
    setPools(await fetchSpicyPools());
    setMatterPrice(await fetchMatterPrice());
    setConfigs(await fetchMatterConfigs());
    setFarms(await fetchMatterFarms());
    setAccounts(await fetchAccountsInternal());
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