
import React, { useState, useEffect, useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import type { ProjectIdea, AIAnalysisResult } from '../types';
import { analyzeSubmissions } from '../services/geminiService';
import { CalculatorIcon, InfoCircleIcon, DocumentChartBarIcon, UserGroupIcon } from './icons';
import { MOCK_OFFICIAL_BUDGET } from '../constants';

interface BudgetSimulatorProps {
  projectIdeas: ProjectIdea[];
  budgetSubmissions: Record<string, number>[];
  onBudgetSubmit: (allocation: Record<string, number>) => void;
}

const TOTAL_BUDGET = 500000000; // 500 Million KES
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(value);

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 rounded-md shadow-sm">
        <p className="font-semibold">{`${payload[0].name}`}</p>
        <p className="text-sm text-green-700">{`${formatCurrency(payload[0].value)}`}</p>
      </div>
    );
  }
  return null;
};

export const BudgetSimulator: React.FC<BudgetSimulatorProps> = ({ projectIdeas, budgetSubmissions, onBudgetSubmit }) => {
  const [priorities, setPriorities] = useState<AIAnalysisResult['topPriorities']>([]);
  const [allocations, setAllocations] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    const fetchPriorities = async () => {
      setLoading(true);
      const result = await analyzeSubmissions(projectIdeas);
      const topPriorities = result.topPriorities.slice(0, 5);
      
      const allCategories = new Set([...topPriorities.map(p => p.topic), ...MOCK_OFFICIAL_BUDGET.map(b => b.category)]);
      
      const priorityMap = new Map(topPriorities.map(p => [p.topic, p]));
      
      const combinedPriorities = Array.from(allCategories).map(cat => {
          return priorityMap.get(cat) || { topic: cat, count: 0, description: 'A key area for county development.', cost: 50000000 };
      });
      
      setPriorities(combinedPriorities);

      const initialAllocations = combinedPriorities.reduce((acc, p) => ({ ...acc, [p.topic]: 0 }), {} as Record<string, number>);
      setAllocations(initialAllocations);
      setLoading(false);
    };
    fetchPriorities();
  }, [projectIdeas]);

  // Fix: Explicitly cast Object.values return type to number[] to avoid TS error
  const totalAllocated = useMemo(() => (Object.values(allocations) as number[]).reduce((sum, val) => sum + val, 0), [allocations]);
  const remainingBudget = TOTAL_BUDGET - totalAllocated;

  const peoplesBudget = useMemo(() => {
      if (budgetSubmissions.length === 0) return [];
      
      const totals: Record<string, number> = {};
      const counts: Record<string, number> = {};

      for (const sub of budgetSubmissions) {
          for (const [category, amount] of Object.entries(sub)) {
              // Fix: Explicitly convert `amount` to a number to prevent runtime errors from string concatenation.
              totals[category] = (totals[category] || 0) + Number(amount);
              counts[category] = (counts[category] || 0) + 1;
          }
      }
      
      const averages = Object.keys(totals).map(category => ({
          name: category,
          value: totals[category] / budgetSubmissions.length,
      }));

      return averages;

  }, [budgetSubmissions]);

  const handleAllocationChange = (topic: string, value: string) => {
    const amount = parseInt(value, 10) || 0;
    setAllocations(prev => ({ ...prev, [topic]: amount }));
  };

  const handleSubmit = () => {
    if (remainingBudget < 0) {
        alert("You cannot submit an allocation that exceeds the total budget.");
        return;
    }
    onBudgetSubmit(allocations);
    setHasSubmitted(true);
  };


  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Analyzing citizen priorities to build the simulator...</p>
      </div>
    );
  }

  const officialBudgetData = MOCK_OFFICIAL_BUDGET.map(item => ({ name: item.category, value: item.amount }));

  return (
    <div className="space-y-12">
      <div className="text-center">
        <CalculatorIcon className="h-12 w-12 text-green-700 mx-auto mb-3" />
        <h2 className="text-3xl font-bold text-gray-800">Budget Insights & Simulator</h2>
        <p className="text-gray-600 mt-2 max-w-3xl mx-auto">Compare the official county budget with priorities from citizens like you. Then, use the simulator to submit your own allocation plan and contribute to the People's Budget.</p>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                    <DocumentChartBarIcon className="h-6 w-6 mr-2 text-green-700"/>
                    Official County Budget Allocation
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={officialBudgetData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} labelLine={false} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                            {officialBudgetData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
             <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                    <UserGroupIcon className="h-6 w-6 mr-2 text-green-700"/>
                    The People's Budget Priority
                </h3>
                 {peoplesBudget.length > 0 ? (
                    <>
                    <p className="text-center text-sm text-gray-500 mb-2">Based on {budgetSubmissions.length} citizen submission(s).</p>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={peoplesBudget} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} labelLine={false} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                                {peoplesBudget.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                           <Tooltip content={<CustomTooltip />} />
                           <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                    </>
                 ) : (
                    <div className="h-[300px] flex items-center justify-center text-center text-gray-500">
                        <p>No citizen budget submissions yet. <br/> Be the first to contribute below!</p>
                    </div>
                 )}
            </div>
       </div>

      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h3 className="text-2xl font-bold mb-2 text-center">Your Turn: Allocate the Budget</h3>
        <p className="text-center text-gray-600 mb-6 max-w-2xl mx-auto">Based on AI analysis of citizen ideas, here are the top priorities. Use the sliders to allocate KES 500 Million and submit your plan.</p>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <h4 className="text-lg font-semibold mb-4">Priority Areas</h4>
              <div className="space-y-5">
                {priorities.map(p => (
                  <div key={p.topic}>
                    <label className="block text-sm font-semibold text-gray-700">{p.topic}</label>
                    <p className="text-xs text-gray-500 mb-1">AI suggestion based on {p.count} idea(s). Est. cost/project: {formatCurrency(p.cost)}</p>
                    <input
                      type="range"
                      min="0"
                      max={TOTAL_BUDGET}
                      // Fix: The `step` attribute requires a number. `p.cost` from the API could be a string.
                      step={Number(p.cost) || 100000}
                      value={allocations[p.topic] || 0}
                      onChange={(e) => handleAllocationChange(p.topic, e.target.value)}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      disabled={hasSubmitted}
                    />
                    <div className="text-right text-sm font-medium text-green-700 mt-1">
                      { formatCurrency(allocations[p.topic] || 0) }
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-2 space-y-6 lg:mt-10">
                 <div className="bg-gray-50 p-4 rounded-lg border">
                    <h4 className="text-lg font-semibold mb-2">Your Summary</h4>
                     <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Total Budget:</span>
                            <span className="font-semibold">{formatCurrency(TOTAL_BUDGET)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Total Allocated:</span>
                            <span className="font-semibold">{formatCurrency(totalAllocated)}</span>
                        </div>
                        <div className={`flex justify-between font-bold border-t pt-2 mt-2 ${remainingBudget < 0 ? 'text-red-600' : 'text-green-700'}`}>
                            <span>Remaining:</span>
                            <span>{formatCurrency(remainingBudget)}</span>
                        </div>
                    </div>
                     {remainingBudget < 0 && (
                        <p className="text-red-600 text-xs font-semibold mt-2 text-center">You have exceeded the total budget!</p>
                    )}
                 </div>
                 <button 
                    onClick={handleSubmit}
                    disabled={hasSubmitted || remainingBudget < 0}
                    className="w-full py-3 px-4 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                 >
                    {hasSubmitted ? 'Thank You For Your Submission!' : 'Submit Your Allocation'}
                 </button>
            </div>
        </div>
      </div>
    </div>
  );
};
