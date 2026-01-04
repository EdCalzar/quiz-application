// src/components/quiz/QuestionCard.jsx
export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Question Header */}
      <div className="mb-4">
        <span className="text-sm text-gray-500">
          Question {questionNumber} of {totalQuestions}
        </span>
        <h2 className="text-xl font-semibold text-gray-800 mt-2">
          {question.question}
        </h2>
      </div>
      
      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelectAnswer(index)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all cursor-pointer ${
              selectedAnswer === index
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Radio Button */}
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedAnswer === index
                  ? 'border-blue-600 bg-blue-600'
                  : 'border-gray-300'
              }`}>
                {selectedAnswer === index && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              
              {/* Option Text */}
              <span className={`flex-1 ${
                selectedAnswer === index
                  ? 'text-blue-900 font-medium'
                  : 'text-gray-700'
              }`}>
                {option}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}