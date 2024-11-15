import React, { useEffect, useState } from 'react';
import { Swords, ChevronDown, ChevronUp } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { VoteCard } from './components/VoteCard';
import { VotingSteps } from './components/VotingSteps';
import { VoteStats } from './components/VoteStats';
import { supabase } from './lib/supabase';
import { Fighter, VoteData, VoteStatsData, WinMethod } from './types';

export default function App() {
  const [stats, setStats] = useState<VoteStatsData>({
    byFighter: { tyson: 0, paul: 0 },
    byRound: {},
    byMethod: {} as Record<WinMethod, number>
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  const [voteData, setVoteData] = useState<VoteData>({} as VoteData);
  const [hasVoted, setHasVoted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    const voted = localStorage.getItem('voteData');
    if (voted) {
      setHasVoted(true);
      setShowStats(true);
      setVoteData(JSON.parse(voted));
    }

    fetchVotes();

    const subscription = supabase
      .channel('votes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'votes' }, 
        () => {
          fetchVotes();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchVotes = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('votes')
        .select('fighter, round, how');

      if (error) throw error;

      const newStats: VoteStatsData = {
        byFighter: { tyson: 0, paul: 0 },
        byRound: {},
        byMethod: {} as Record<WinMethod, number>
      };

      if (data) {
        data.forEach(({ fighter, round, how }) => {
          if (fighter) newStats.byFighter[fighter] = (newStats.byFighter[fighter] || 0) + 1;
          if (round) newStats.byRound[round] = (newStats.byRound[round] || 0) + 1;
          if (how) newStats.byMethod[how] = (newStats.byMethod[how] || 0) + 1;
        });
      }

      setStats(newStats);
    } catch (error) {
      console.error('Error fetching votes:', error);
      toast.error('Failed to fetch votes. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (fighter: Fighter) => {
    setVoteData({ ...voteData, fighter });
    setCurrentStep(2);
  };

  const handleSelectRound = (round: number) => {
    setVoteData({ ...voteData, round });
    setCurrentStep(3);
  };

  const handleSelectMethod = async (method: WinMethod) => {
    const finalVoteData = { ...voteData, how: method };
    
    try {
      const { error } = await supabase
        .from('votes')
        .insert([finalVoteData]);

      if (error) throw error;

      localStorage.setItem('voteData', JSON.stringify(finalVoteData));
      setHasVoted(true);
      setShowStats(true);
      setCurrentStep(1);
      setVoteData(finalVoteData);
      
      const messages = finalVoteData.fighter === 'tyson' ? FIGHTER_QUOTES.tyson : FIGHTER_QUOTES.paul;
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      toast.success(randomMessage, {
        duration: 5000,
        icon: '🥊'
      });

      await fetchVotes();
    } catch (error) {
      console.error('Error casting vote:', error);
      toast.error('Failed to cast vote. Please try again.');
    }
  };

  const handleResetVote = () => {
    localStorage.removeItem('voteData');
    setHasVoted(false);
    setVoteData({} as VoteData);
    setCurrentStep(1);
  };

  const totalVotes = stats.byFighter.tyson + stats.byFighter.paul;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-pink-600 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading fight stats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-pink-600 text-white flex flex-col">
      <div className="container mx-auto px-4 py-12 flex-grow">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-200 to-yellow-300 animate-gradient">
            Tyson vs. Paul
          </h1>
          <div className="flex items-center justify-center gap-2 text-2xl text-pink-100">
            <Swords className="w-7 h-7" />
            <span>Who's Taking The W?</span>
          </div>
          <button 
            onClick={() => setShowStats(!showStats)}
            className="mt-2 text-pink-100 text-lg flex items-center gap-2 mx-auto hover:text-pink-200 transition-colors"
          >
            {totalVotes} Fight Fans Have Spoken!
            {showStats ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        <div className={`transform transition-all duration-300 ease-in-out ${showStats ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 h-0 overflow-hidden'}`}>
          <VoteStats stats={stats} />
        </div>

        <VotingSteps
          currentStep={currentStep}
          selectedFighter={voteData.fighter}
          selectedRound={voteData.round}
          selectedMethod={voteData.how}
          onSelectRound={handleSelectRound}
          onSelectMethod={handleSelectMethod}
        />

        {currentStep === 1 && (
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <VoteCard
              fighter="tyson"
              name="Mike Tyson"
              votes={stats.byFighter.tyson}
              totalVotes={totalVotes}
              onVote={() => handleVote('tyson')}
              onResetVote={handleResetVote}
              hasVoted={hasVoted}
            />
            <VoteCard
              fighter="paul"
              name="Jake Paul"
              votes={stats.byFighter.paul}
              totalVotes={totalVotes}
              onVote={() => handleVote('paul')}
              onResetVote={handleResetVote}
              hasVoted={hasVoted}
            />
          </div>
        )}
      </div>

      <footer className="w-full py-4 text-center text-pink-200 bg-black/10 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <p>
            Made by <a href="https://www.linkedin.com/in/camfortin/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-pink-100 underline">Cam Fortin</a> | 
            <a href="https://www.producthacker.ai/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-pink-100 underline ml-1">Product Hacker AI</a>
          </p>
        </div>
      </footer>

      <Toaster position="bottom-center" />
    </div>
  );
}

const FIGHTER_QUOTES = {
  tyson: [
    "Iron Mike never needed permission to bite into his competition!",
    "You really think Jake can handle the baddest man on the planet?",
    "Mike's fists speak louder than Jake's tweets—good choice!",
    "This vote might just be the knockout Tyson was waiting for!",
    "Mike Tyson: delivering punches and wisdom, one match at a time.",
    "Did someone say power punch? Mike's already in the ring waiting.",
    "You're backing the legend—let's hope Jake packed a mouthguard!",
    "Mike Tyson doesn't throw shade, just uppercuts."
  ],
  paul: [
    "Jake Paul's biggest fight yet—and his vlog camera's ready for the highlights!",
    "From YouTube to knockouts, Jake's ready to take the W!",
    "You really think Mike can keep up with Jake's TikTok footwork?",
    "Jake says, 'It's not a phase, mom. I'm a real boxer now.'",
    "A vote for Jake is a vote for memes—let's get this content trending!",
    "Jake's about to go from influencer to fist-fluencer.",
    "This vote might just be Jake's next big headline!",
    "From Disney to dynamite punches—Jake's in it to win it!"
  ]
};