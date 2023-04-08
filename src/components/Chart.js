import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { areaColorsTickersMap, casinoBankrollTagTickers, casinoBankrollTokenDecimals } from '../const';
import { formattedTimestamp } from '../util/util';

function reduceAndAddAmounts(dayData) {
  const resultArray = [];

// create object with unique "tag" as key and sum of "amount" as value
  let sumByTag = {};

  dayData.forEach((data) => {
    const symbol = casinoBankrollTagTickers.get(data.tag);

    sumByTag[symbol] = (sumByTag[symbol] || 0) +
      (Number(data.sum) / Math.pow(10, casinoBankrollTokenDecimals.get(data.tag)));
    
    let newObj = Object.assign({}, {
      timestamp: formattedTimestamp(data.timestamp) 
    }, sumByTag);
    
    resultArray.push(newObj);
  });

  return resultArray;
}

export const Chart = ({profitData}) => {
  const chartData = reduceAndAddAmounts(profitData);

  return profitData.length && (
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
        <XAxis dataKey="timestamp" tickMargin={10} />
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