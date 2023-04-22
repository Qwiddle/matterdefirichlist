import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { areaColorsTickersMap, casinoBankrollTagTickers, /*casinoBankrollTokenDecimals*/ } from '../const';
import { formattedTimestamp, sortBetsByGame } from '../util/util';
import { useMemo } from 'react';

export function reduceAndAddAmountsLegacy(profitData) {
  const resultArray = [];

// create object with unique "tag" as key and sum of "amount" as value
  let sumByTag = {};

  sortBetsByGame(profitData).forEach((data) => {
    const symbol = casinoBankrollTagTickers.get(data.tag);

    if (data.winner) {
      sumByTag[symbol] = (sumByTag[symbol] || 0) + data.payout;
    } else {
      sumByTag[symbol] = (sumByTag[symbol] || 0) - data.amount;
    }
    
    let newObj = Object.assign({}, {
      timestamp: formattedTimestamp(data.timestamp) 
    }, sumByTag);
    
    resultArray.push(newObj);
  });

  return resultArray;
}

// function reduceAndAddAmounts(dayData) {
//   const resultArray = [];

// // create object with unique "tag" as key and sum of "amount" as value
//   let sumByTag = {};

//   dayData.forEach((data) => {
//     const symbol = casinoBankrollTagTickers.get(data.tag);

//     sumByTag[symbol] = (sumByTag[symbol] || 0) +
//       (Number(data.sum) / Math.pow(10, casinoBankrollTokenDecimals.get(data.tag)));
    
//     let newObj = Object.assign({}, {
//       timestamp: formattedTimestamp(data.timestamp) 
//     }, sumByTag);
    
//     resultArray.push(newObj);
//   });

//   return resultArray;
// }

export const Chart = ({profitData, betData}) => {
  const chartData = useMemo(() => reduceAndAddAmountsLegacy(betData), [betData]);

  // const chartData3 = reduceAndAddAmounts(profitData);
  // const chartData2 = betData;

  return profitData ? (
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
          {Array.from(areaColorsTickersMap.entries()).map((area, index) => (
            <linearGradient 
              key={`gradient-${area[0]}`} 
              id={`color${area[0]}`} 
              x1="0" 
              y1="0" 
              x2="0" 
              y2="1"
            >
              <stop key={`gradient-top-${index}`} offset="5%" stopColor={area[1]} stopOpacity={0.8}/>
              <stop key={`gradient-bottom-${index}`} offset="80%" stopColor={area[1]} stopOpacity={0.1}/>
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis key="x-timestamp" dataKey="timestamp" tickMargin={10} />
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
            isAnimationActive={false}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  ) : null
}