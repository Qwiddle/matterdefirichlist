import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { tokenMapToArray } from '../util/bets';
import { areaColorsTickersMap, casinoBankrollTagTickers } from '../const';

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
          top: 20,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <defs>
          {Array.from(areaColorsTickersMap.entries()).map((area) => (
            <linearGradient 
              key={`gradient-${area[0]}`} 
              id={`color${area[0]}`} 
              x1="0" 
              y1="0" 
              x2="0" 
              y2="1"
            >
              <stop offset="5%" stopColor={area[1]} stopOpacity={0.8}/>
              <stop offset="80%" stopColor={area[1]} stopOpacity={0.1}/>
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="gameId" />
        <YAxis />
        <Tooltip wrapperStyle={{ outline: "none" }} />
        {Array.from(areaColorsTickersMap.entries()).map((area) => (
          <Area 
            key={`area-${area[0]}`} 
            type="monotone" 
            dataKey={area[0]} 
            stroke={area[1]} 
            fillOpacity={1} 
            fill={`url(#color${area[0]})`} 
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}