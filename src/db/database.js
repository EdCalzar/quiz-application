import Dexie from 'dexie';

// "QuizAppDatabase" the db name in browser
export const db = new Dexie('QuizAppDatabase');

// Database Schema
db.version(1).stores({
    // Stores students "++id = auto-increment primary key"
    students: '++id, studentId, name, email',

    // Stores quiz result
    submissions: '++id, studentId, score, violations, timestamp, released',

    //Track if student completed quiz
    quizStatus: 'studentId, hasCompleted',

    // Stores answers during quiz
    quizProgress: 'studentId, currentQuestion, answers, violations',
});

// Function to check if student already took the quiz
export const hasStudentTakenQuiz = async (studentId) => {
    try {
        // Check if student has completed the quiz
        const status = await db.quizStatus
            .where('studentId')
            .equals(studentId)
            .first()
        
        console.log('Quiz status check for', studentId, ':', status)
        return status?.hasCompleted === true
    } catch(error) {
        console.error('Error checking quiz status:', error)
        return false;
    }    

}

// Function to register new student
export const registerStudent = async (studentData) => {
    // Check if student already exists
    const exists = await db.students
        .where('studentId')
        .equals(studentData.studentId)
        .first()
    
    if (exists) {
        return exists;
    }

    // Add new student
    const id = await db.students.add({
        studentId: studentData.studentId,
        name: studentData.name,
        email: studentData.email,
        registeredAt: new Date().toISOString()
    });

    return {id, ...studentData}
}

// Save quiz progress
export const saveQuizProgress = async (studentId, data) => {
  try {
    await db.quizProgress.put({
      studentId,
      currentQuestion: data.currentQuestion,
      answers: data.answers,
      violations: data.violations,
      timeRemaining: data.timeRemaining,
      lastUpdated: new Date().toISOString()
    });
    console.log('Progress saved');
  } catch (error) {
    console.error('Error saving progress:', error);
  }
};

// Get saved progress
export const getQuizProgress = async (studentId) => {
  try {
    return await db.quizProgress.get(studentId);
  } catch (error) {
    console.error('Error getting progress:', error);
    return null;
  }
};

// Submit quiz
export const submitQuiz = async (studentId, answers, violations, questions) => {
  try {
    // Calculate score
    let correctCount = 0;
    answers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) {
        correctCount++;
      }
    });
    
    const score = Math.round((correctCount / questions.length) * 100);
    
    // Store submission
    await db.submissions.add({
      studentId,
      score,
      violations,
      correctAnswers: correctCount,
      totalQuestions: questions.length,
      timestamp: new Date().toISOString(),
      released: false // Instructor hasn't released yet
    });
    
    // Mark as completed
    await db.quizStatus.put({
      studentId,
      hasCompleted: true
    });
    
    // Clean up progress
    await db.quizProgress.delete(studentId);
    
    return { score, correctCount };
  } catch (error) {
    console.error('Error submitting quiz:', error);
    throw error;
  }
};

