import { useTimer } from '../../hooks/useTimer';

export default function Timer({ duration, onTimeout }) {
  const { timeLeft, formatTime, isTimeUp } = useTimer(duration, onTimeout);
  
  // Calculate percentage for progress bar
  const percentage = (timeLeft / duration) * 100;
  
  // Determine color based on time left
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
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-1000 ${getColorClass()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* Warning when time is low */}
      {percentage < 20 && percentage > 0 && (
        <p className="text-red-600 text-xs mt-2 animate-pulse">
          ⚠️ Hurry up! Time is running out!
        </p>
      )}
      
      {isTimeUp && (
        <p className="text-red-600 text-sm mt-2 font-semibold">
          ⏰ Time's up! Submitting quiz...
        </p>
      )}
    </div>
  );
}