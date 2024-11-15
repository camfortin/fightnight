import React from 'react';
import { VoteStatsData } from '../types';
import { PieChart, Trophy } from 'lucide-react';

interface VoteStatsProps {
  stats: VoteStatsData;
}

export function VoteStats({ stats }: VoteStatsProps) {
  const totalVotes = stats.byFighter.tyson + stats.byFighter.paul;
  
  return (
    <div className="w-full max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-xl p-4 mb-8 border border-pink-300/20">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white/5 rounded-lg p-3">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-pink-100">
            <Trophy className="w-5 h-5 text-yellow-300" /> Fighter Stats
          </h3>
          <div className="mt-2 space-y-2">
            {['tyson', 'paul'].map((fighter) => (
              <div key={fighter} className="relative">
                <div className="flex justify-between text-sm mb-1">
                  <span>{fighter === 'tyson' ? 'Tyson' : 'Paul'}</span>
                  <span>{Math.round((stats.byFighter[fighter as keyof typeof stats.byFighter] / totalVotes) * 100)}%</span>
                </div>
                <div className="w-full bg-pink-900/30 rounded-full h-1.5">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-purple-500 h-1.5 rounded-full"
                    style={{
                      width: `${Math.round((stats.byFighter[fighter as keyof typeof stats.byFighter] / totalVotes) * 100)}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-3">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-pink-100">
            <PieChart className="w-5 h-5 text-pink-300" /> Round Picks
          </h3>
          <div className="grid grid-cols-4 gap-1 mt-2">
            {Object.entries(stats.byRound)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([round, count]) => (
                <div key={round} className="text-center bg-white/5 rounded p-1">
                  <div className="text-xs text-pink-200">R{round}</div>
                  <div className="font-semibold text-sm">{Math.round((count / totalVotes) * 100)}%</div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-3">
          <h3 className="text-lg font-semibold text-pink-100">Top Methods</h3>
          <div className="space-y-2 mt-2">
            {Object.entries(stats.byMethod)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 3)
              .map(([method, count]) => (
                <div key={method} className="relative">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{method}</span>
                    <span>{Math.round((count / totalVotes) * 100)}%</span>
                  </div>
                  <div className="w-full bg-pink-900/30 rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-purple-500 h-1.5 rounded-full"
                      style={{
                        width: `${Math.round((count / totalVotes) * 100)}%`
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}