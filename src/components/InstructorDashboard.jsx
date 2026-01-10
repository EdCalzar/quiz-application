// src/components/InstructorDashboard.jsx
import { useState, useEffect } from 'react';
import { getAllSubmissions, releaseAllScores, areScoresReleased } from '../db/database.js';
import InstructorHeader from './instructor/InstructorHeader.jsx';
import ResultsTable from './instructor/ResultsTable.jsx';

export default function InstructorDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [releasing, setReleasing] = useState(false);
  const [scoresReleased, setScoresReleased] = useState(false);
  const [sortBy, setSortBy] = useState({ column: 'timestamp', direction: 'desc' });
   const [showReleaseModal, setShowReleaseModal] = useState(false);
  
  // Fetch submissions on mount
  useEffect(() => {
    fetchSubmissions();
    checkReleaseStatus();
  }, []);
  
  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const data = await getAllSubmissions();
      setSubmissions(data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const checkReleaseStatus = async () => {
    try {
      const released = await areScoresReleased();
      setScoresReleased(released);
    } catch (error) {
      console.error('Error checking release status:', error);
    }
  };
  
  const handleReleaseScores = async () => {
    setReleasing(true);
    try {
      await releaseAllScores();
      setScoresReleased(true);
      
      // Refresh submissions to show updated status
      await fetchSubmissions();

      // Close modal
      setShowReleaseModal(false);
    } catch (error) {
      console.error('Error releasing scores:', error);
      alert('Failed to release scores. Please try again.');
    } finally {
      setReleasing(false);
    }
  };
  
  const handleSort = (column) => {
    const direction = 
      sortBy.column === column && sortBy.direction === 'asc' 
        ? 'desc' 
        : 'asc';
    
    setSortBy({ column, direction });
    
    const sorted = [...submissions].sort((a, b) => {
      let aVal = a[column];
      let bVal = b[column];
      
      // Handle different data types
      if (column === 'timestamp') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      } else if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (direction === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    
    setSubmissions(sorted);
  };
  
  // Calculate statistics
  const totalSubmissions = submissions.length;
  const averageScore = totalSubmissions > 0
    ? Math.round(submissions.reduce((sum, sub) => sum + sub.score, 0) / totalSubmissions)
    : 0;
  const passedCount = submissions.filter(sub => sub.score >= 70).length;
  const passRate = totalSubmissions > 0
    ? Math.round((passedCount / totalSubmissions) * 100)
    : 0;
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <InstructorHeader />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-xl text-gray-600">Loading submissions...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <InstructorHeader />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm font-medium text-gray-500 mb-1">Total Submissions</div>
            <div className="text-3xl font-bold">{totalSubmissions}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm font-medium text-gray-500 mb-1">Average Score</div>
            <div className="text-3xl font-bold">{averageScore}%</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm font-medium text-gray-500 mb-1">Students Passed</div>
            <div className="text-3xl font-bold">{passedCount}/{totalSubmissions}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm font-medium text-gray-500 mb-1">Pass Rate</div>
            <div className="text-3xl font-bold">{passRate}%</div>
          </div>
        </div>
        
        {/* Release Scores Button */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Student Results</h2>
            <p className="text-sm text-gray-600">
              {scoresReleased 
                ? 'Scores have been released to students' 
                : 'Scores are pending release'}
            </p>
          </div>
          
          {!scoresReleased && totalSubmissions > 0 && (
            <button
              onClick={() => setShowReleaseModal(true)}
              disabled={releasing}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
            >
              Release All Scores
            </button>
          )}
          
          {scoresReleased && (
            <div className="bg-green-50 border border-green-200 px-4 py-2 rounded-lg">
              <span className="text-green-700 font-semibold">Scores Released</span>
            </div>
          )}
        </div>
        
        {/* Results Table */}
        <ResultsTable 
          submissions={submissions}
          sortBy={sortBy}
          onSort={handleSort}
        />
        
      </div>

      {showReleaseModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
            
            {/* Icon */}
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Release Scores?</h2>
            </div>
            
            {/* Message */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-gray-700 text-sm mb-2">
                Are you sure you want to release all scores?
              </p>
              <p className="text-gray-600 text-sm">
                Students will be able to see their results immediately. This action affects <strong>{totalSubmissions}</strong> submission{totalSubmissions !== 1 ? 's' : ''}.
              </p>
            </div>
            
            {/* Warning */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
              <p className="text-red-700 text-xs">
                <strong>Note:</strong> Once released, students can view their scores. Make sure all grading is finalized.
              </p>
            </div>
            
            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => setShowReleaseModal(false)}
                disabled={releasing}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleReleaseScores}
                disabled={releasing}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
              >
                {releasing ? 'Releasing...' : 'Yes, Release Scores'}
              </button>
            </div>
          </div>
        </div>
      )}    

    </div>
  );
}