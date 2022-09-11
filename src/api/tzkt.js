import { 
  TZKT_API, 
  MATTER 
} from './api.js';

export const fetchTokenName = async (contract) => {
  const req = `${TZKT_API}/contracts/${contract}`;
  const res = await (await fetch(req)).json();
  
  const tokenName = res.alias;

  return tokenName;
}

export const fetchSupply = async (contract, id) => {
  const req = `${TZKT_API}/tokens/?contract=${contract}${id ? `&tokenId=${id}` : ``}`;
  const res = await (await fetch(req)).json();
  
  const supply = Number(res[0].totalSupply);

  return supply;
}

export const fetchAccountsInternal = async () => {
  const req = `${TZKT_API}/contracts/${MATTER}/bigmaps/accounts_internal/keys?limit=1000`;
  const res = await (await fetch(req)).json();

  console.log('Matter Accounts: ', res);

  return res;
}

export const fetchMatterConfigs = async () => {
  const req = `${TZKT_API}/contracts/${MATTER}/storage/`;
  const res = await (await fetch(req)).json();
  
  const configs = res.configs;

  console.log('Configs: ', configs);

  return configs;
}

export const fetchMatterFarms = async () => {
  const req = `${TZKT_API}/contracts/${MATTER}/bigmaps/farms_internal/keys`;
  const res = await (await fetch(req)).json();

  const farms = await Promise.all(
    res.map(async farm => ({
      symbol: await fetchTokenName(farm.key.fa2_address),
      key: farm.key,
      value: farm.value,
      supply: await fetchSupply(farm.key.fa2_address, farm.key.token_id),
    }))
  );

  console.log('Farms: ', farms);

  return farms;
}

const fetchMatterBalances = async () => {
  const req = `&limit=100&select=balance,token.id%20as%20id,token.contract%20as%20contract,token.standard%20as%20standard,token.tokenId%20as%20token_id`
  const res = await (await fetch(`${TZKT_API}/v1/tokens/balances?account=${MATTER}${req}`)).json();

  console.log('Matter balances: ', res);

  return res;
}