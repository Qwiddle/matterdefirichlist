import { 
  TZKT_API, 
  MATTER, 
  TZKT_AVATAR_API
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

export const fetchTokenContract = async (contract, id) => {
  const req = `${TZKT_API}/tokens/?contract=${contract}${id ? `&tokenId=${id}` : ``}`;
  const res = await (await fetch(req)).json();

  const { totalSupply } = res[0];
  const { alias } = res[0].contract;

  return {
    supply: totalSupply,
    alias,
  };
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
    res.map(async farm => {
      const { supply, alias } = await fetchTokenContract(farm.key.fa2_address, farm.key.token_id);
      
      return {
        symbol: alias,
        key: farm.key,
        value: farm.value,
        supply: supply,
      }
    })
  );

  console.log('Farms: ', farms);

  return farms;
}

export const fetchMatterBalances = async () => {
  const req = `&limit=100&select=balance,token.id%20as%20id,token.contract%20as%20contract,token.standard%20as%20standard,token.tokenId%20as%20token_id`
  const res = await (await fetch(`${TZKT_API}/tokens/balances?account=${MATTER}${req}`)).json();

  console.log('Matter balances: ', res);

  return res;
}

export const fetchUserAvatar = async (userAddress) => {
  const req = `${TZKT_AVATAR_API}/${userAddress}`;
  const res = await fetch(req);
  const imageBlob = await res.blob();

  return URL.createObjectURL(imageBlob);
}