import React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"; 

const PerformanceChart = ({ data }) => {
    const chartData = data.map(item => ({
        name: item.name,
        achieved: item.rating, 
      potential: item.rating > 0 ? 5 : null,       
        count: item.count,   
    }));

    const chartConfig = {
        achieved: {
            label: "Avg. Rating",
            color: "hsl(var(--primary))",
        },
        potential: {
            label: "Max Rating",
            color: "hsl(var(--muted))",
        },
    };

    return (
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
            <BarChart
                accessibilityLayer
                data={chartData}
                margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
            >
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="name"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 5]}
                    ticks={[1, 2, 3, 4, 5]}
                />
                <ChartTooltip
                    cursor={false}
                    content={
                        <ChartTooltipContent
                            formatter={(value, name, props) => {
                                if (name === 'potential') return null; 
                                return (
                                    <>
                                        <div className="font-bold">{`${props.payload.name}`}</div>
                                        <div>{`Avg. Rating: ${props.payload.achieved}`}</div>
                                        <div className="text-xs text-muted-foreground">{`Based on ${props.payload.count} task(s)`}</div>
                                    </>
                                );
                            }}
                            labelFormatter={() => ''} 
                        />
                    }
                />
                
                <Bar
                    dataKey="potential"
                    fill="var(--chart-2)"
                    radius={4}
                    barSize={25}
                />
                <Bar
                    dataKey="achieved"
                    fill="var(--primary)"
                    radius={4}
                    barSize={30}
                />
            </BarChart>
        </ChartContainer>
    );
};

export default PerformanceChart;
