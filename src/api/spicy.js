import { 
  SPICY_API,
  SPICY_STABLE_API,
  MATTER 
} from './api.js';

const calculateDayAgg = () => {
  const agg_start = new Date();
  agg_start.setDate(agg_start.getDate() - 7);

  return Math.floor(agg_start.getTime() / 1000);
}

export const fetchMatterPrice = async (agg = calculateDayAgg()) => {
  const req = `${SPICY_API}/TokenList?_ilike=${MATTER}:0&day_agg_start=${agg}`;
  const res = await (await fetch(req)).json();

  const price = res.tokens[0].derivedxtz;

  console.log('Matter price:', price);

  return price;
}

export const fetchSpicyTokens = async (agg = calculateDayAgg()) => {
  const req = `${SPICY_API}/TokenList?day_agg_start=${agg}`;
  const res = await (await fetch(req)).json();

  const tokens = res.tokens;

  const spicyTokens = tokens.map(token => ({
    symbol: token.symbol, 
    derivedXtz: token.derivedxtz, 
    tag: token.tag,
    decimals: token.decimals
  }));

  console.log('SpicySwap tokens:', spicyTokens);

  return spicyTokens;
}

export const fetchSpicyPools = async () => {
  const res = await (await fetch(`${SPICY_API}/PoolListAll/`)).json();
  const pools = res.pair_info;
  
  const spicyPools = pools.map(pool => ({
    contract: pool.contract, 
    reserve: pool.reservextz, 
    token0: pool.token0, 
    token1: pool.token1
  }));

  console.log('SpicySwap pools:', spicyPools);

  return spicyPools;
}

export const fetchSpicyStablePools = async () => {
  const res = await (await fetch(`${SPICY_STABLE_API}/PoolListAll/`)).json();
  const pools = res.pair_info;
  
  const spicyStablePools = pools.map(pool => ({
    contract: pool.contract, 
    reserve: pool.reservextz, 
    token0: pool.token0, 
    token1: pool.token1
  }));

  console.log('SpicySwap stable pools:', spicyStablePools);

  return spicyStablePools;
}

export const fetchSpicyToken = async (tag, agg = calculateDayAgg()) => {
  const req = `${SPICY_API}/TokenList?_ilike=${tag}&day_agg_start=${agg}`;
  const res = await (await fetch(req)).json();

  const token = res.tokens[0]

  console.log('Token:', token);

  return {
    decimals: token.decimals,
    metadata: {
      name: token.name,
      symbol: token.symbol,
      img: token.img,
    },
  }
}

export const fetchTokenPrice = async (tag, agg = calculateDayAgg()) => {
  const req = `${SPICY_API}/TokenList?_ilike=${tag}&day_agg_start=${agg}`;
  const res = await (await fetch(req)).json();

  const { derivedxtz, derivedusd } = res.tokens[0];

  console.log('Token price:', { derivedxtz, derivedusd });

  return { derivedxtz, derivedusd };
}