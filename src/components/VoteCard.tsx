import React from 'react';
import { Trophy, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

interface VoteCardProps {
  fighter: 'tyson' | 'paul';
  name: string;
  votes: number;
  totalVotes: number;
  onVote: () => void;
  onResetVote: () => void;
  hasVoted: boolean;
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

export function VoteCard({ fighter, name, votes, totalVotes, onVote, onResetVote, hasVoted }: VoteCardProps) {
  const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
  
  const handleSmackTalk = () => {
    const quotes = FIGHTER_QUOTES[fighter];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    toast(randomQuote, {
      duration: 4000,
      icon: '🥊',
      style: {
        background: '#333',
        color: '#fff',
        padding: '16px',
        borderRadius: '10px',
        fontSize: '1.1em',
        maxWidth: '500px'
      }
    });
  };

  const imageUrl = fighter === 'tyson' 
    ? 'https://i.postimg.cc/0rYdQ8Bw/tyson.webp'
    : 'https://i.postimg.cc/xN3KFRzR/paul.webp';
  
  return (
    <div className="relative w-full max-w-sm mx-auto bg-white/10 backdrop-blur-md rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 border border-pink-300/20">
      <div className="relative h-96">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100/90 to-purple-100/90" />
        <img 
          src={imageUrl}
          alt={name}
          className="absolute inset-0 w-full h-full object-contain p-4"
          loading="eager"
          crossOrigin="anonymous"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h2 className="text-3xl font-bold mb-2">{name}</h2>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-300" />
            <span className="text-lg">{percentage}% votes</span>
          </div>
        </div>
      </div>
      
      <div className="p-6 bg-white/10 backdrop-blur-md space-y-4">
        <div className="w-full bg-pink-900/30 rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-pink-500 to-purple-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        <button
          onClick={hasVoted ? onResetVote : onVote}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition
            ${hasVoted 
              ? 'bg-pink-600 hover:bg-pink-700' 
              : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600'}`}
        >
          {hasVoted ? 'Vote Again!' : 'Vote'}
        </button>
        
        <button
          onClick={handleSmackTalk}
          className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition flex items-center justify-center gap-2 animate-pulse-ring"
        >
          <MessageSquare className="w-5 h-5" />
          Talk Smack
        </button>
      </div>
    </div>
  );
}