import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { tokenMapToArray } from '../util/bets';
import { casinoBankrollTagTickers } from '../const';

const sortBetsByGame = (bets) => {
  return bets.sort((a, b) => {
    if (a.gameId < b.gameId) return -1;

    if (a.gameId > b.gameId) return 1;
  
    return 0;
  })
}

function reduceAndAddAmounts(profitData) {
  const resultArray = [];

// create object with unique "tag" as key and sum of "amount" as value
  let sumByTag = {};

  sortBetsByGame(profitData).forEach((data) => {
    const symbol = casinoBankrollTagTickers.get(data.tag);

    if (data.winner) {
      sumByTag[symbol] = (sumByTag[symbol] || 0) + data.amount;
    } else {
      sumByTag[symbol] = (sumByTag[symbol] || 0) - data.amount;
    }
    
    let newObj = Object.assign({}, { gameId: data.gameId }, sumByTag);
    resultArray.push(newObj);
  });

  return resultArray;
}

export const Chart = ({ profitData }) => {

  const array = tokenMapToArray(profitData);
  const chartData = reduceAndAddAmounts(array);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        width={500}
        height={400}
        data={chartData}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="gameId" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="WTZ" stackId="1" stroke="#8884d8" fill="#8884d8" />
        <Area type="monotone" dataKey="uUSD" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
        <Area type="monotone" dataKey="USDtz" stackId="1" stroke="#ffc658" fill="#ffc658" />
      </AreaChart>
    </ResponsiveContainer>
  )
}