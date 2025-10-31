import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell } from 'recharts';
import type { ProjectIdea, AIAnalysisResult } from '../types';
import { analyzeSubmissions } from '../services/geminiService';
import { CalculatorIcon, InfoCircleIcon } from './icons';

interface BudgetSimulatorProps {
  projectIdeas: ProjectIdea[];
}

const TOTAL_BUDGET = 500000000; // 500 Million KES
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const BudgetSimulator: React.FC<BudgetSimulatorProps> = ({ projectIdeas }) => {
  const [priorities, setPriorities] = useState<AIAnalysisResult['topPriorities']>([]);
  const [allocations, setAllocations] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPriorities = async () => {
      setLoading(true);
      const result = await analyzeSubmissions(projectIdeas);
      const top5 = result.topPriorities.slice(0, 5);
      setPriorities(top5);
      // Initialize allocations
      const initialAllocations = top5.reduce((acc, p) => ({ ...acc, [p.topic]: 0 }), {});
      setAllocations(initialAllocations);
      setLoading(false);
    };
    fetchPriorities();
  }, [projectIdeas]);

  const totalAllocated = Object.values(allocations).reduce((sum, val) => sum + val, 0);
  const remainingBudget = TOTAL_BUDGET - totalAllocated;

  const handleAllocationChange = (topic: string, value: string) => {
    const amount = parseInt(value, 10) || 0;
    setAllocations(prev => ({ ...prev, [topic]: amount }));
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Analyzing citizen priorities to build the simulator...</p>
      </div>
    );
  }

  const chartData = priorities.map(p => ({
    name: p.topic,
    "Allocated Budget": allocations[p.topic],
  }));

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <CalculatorIcon className="h-12 w-12 text-green-700 mx-auto mb-3" />
        <h2 className="text-3xl font-bold text-gray-800">Interactive Budget Simulator</h2>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">You have KES 500 Million to invest in Homa Bay County's development. Allocate the funds across the top 5 priorities identified by your fellow citizens.</p>
      </div>
      
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg mb-8 flex items-start">
        <InfoCircleIcon className="h-6 w-6 text-yellow-600 mr-3 flex-shrink-0"/>
        <p className="text-sm text-yellow-800">This is an educational tool. The estimated costs are for typical projects in each category. Your choices help the county understand community priorities when faced with real-world financial trade-offs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4">Allocate Your Budget</h3>
          <div className="space-y-5">
            {priorities.map(p => (
              <div key={p.topic}>
                <label className="block text-sm font-semibold text-gray-700">{p.topic}</label>
                <p className="text-xs text-gray-500 mb-1">Est. Cost/Project: {p.cost.toLocaleString('en-US', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 })}</p>
                <input
                  type="range"
                  min="0"
                  max={TOTAL_BUDGET}
                  step={p.cost || 100000}
                  value={allocations[p.topic] || 0}
                  onChange={(e) => handleAllocationChange(p.topic, e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-right text-sm font-medium text-green-700 mt-1">
                  { (allocations[p.topic] || 0).toLocaleString('en-US', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }) }
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-2">Budget Summary</h3>
             <div className="space-y-2 text-lg">
                <div className="flex justify-between">
                    <span className="text-gray-600">Total Budget:</span>
                    <span className="font-semibold">{TOTAL_BUDGET.toLocaleString('en-US', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Total Allocated:</span>
                    <span className="font-semibold">{totalAllocated.toLocaleString('en-US', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 })}</span>
                </div>
                <div className={`flex justify-between border-t pt-2 ${remainingBudget < 0 ? 'text-red-600' : 'text-green-700'}`}>
                    <span className="font-bold">Remaining:</span>
                    <span className="font-bold">{remainingBudget.toLocaleString('en-US', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 })}</span>
                </div>
            </div>
             {remainingBudget < 0 && (
                <p className="text-red-600 text-sm font-semibold mt-3 text-center">You have exceeded the total budget!</p>
            )}
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-4">Your Allocation Visualized</h3>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" width={120} tick={{fontSize: 12}}/>
                    <Tooltip formatter={(value: number) => value.toLocaleString('en-US', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 })}/>
                    <Bar dataKey="Allocated Budget" barSize={20}>
                      {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
