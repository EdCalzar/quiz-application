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
    quizStatus: 'studentId, hasCompleted'
});

// Function to check if student already took the quiz
export const hasStudentTakenQuiz = async (studentId) => {
    const status = await db.quizStatus
        .where('studentId')
        .equals(studentId)
        .first()
    
    return status?.hasCompleted || false
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


