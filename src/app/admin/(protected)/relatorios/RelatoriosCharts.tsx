"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export function FaturamentoChart({ data }: { data: any[] }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#6B7280' }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#6B7280' }}
            tickFormatter={(value) => `R$ ${value}`}
          />
          <RechartsTooltip 
            cursor={{ fill: '#f9fafb' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: any) => [`R$ ${Number(value).toFixed(2)}`, 'Valor']}
          />
          <Bar dataKey="faturamento" fill="#8ECADF" radius={[4, 4, 0, 0]} barSize={40} />
          <Bar dataKey="receita" fill="#A8D5BA" radius={[4, 4, 0, 0]} barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PlantoesChart({ data }: { data: any[] }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#6B7280' }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#6B7280' }}
          />
          <RechartsTooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Line 
            type="monotone" 
            dataKey="plantoes" 
            name="Plantões"
            stroke="#8B5CF6" 
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
