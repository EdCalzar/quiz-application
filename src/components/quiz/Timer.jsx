// src/components/quiz/Timer.jsx
import { useTimer } from '../../hooks/useTimer';

export default function Timer({ duration, onTimeout }) { // REMOVED onTimeUpdate
  const { timeLeft, formatTime, isTimeUp } = useTimer(duration, onTimeout); // REMOVED onTimeUpdate
  
  const percentage = (timeLeft / duration) * 100;
  
  const getColorClass = () => {
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const getTextColorClass = () => {
    if (percentage > 50) return 'text-green-600';
    if (percentage > 20) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">Time Remaining</span>
        <span className={`text-2xl font-bold ${getTextColorClass()}`}>
          {formatTime(timeLeft)}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-1000 ${getColorClass()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {percentage < 20 && percentage > 0 && (
        <p className="text-red-600 text-xs mt-2 animate-pulse">
          Hurry up! Time is running out!
        </p>
      )}
      
      {isTimeUp && (
        <p className="text-red-600 text-sm mt-2 font-semibold">
          Time's up! Submitting quiz...
        </p>
      )}
    </div>
  );
}