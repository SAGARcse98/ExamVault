// Seed script for mock tests
// Run: npx ts-node --compiler-options '{"module":"commonjs"}' scripts/seed-mocktest.ts
// Or: npx tsx scripts/seed-mocktest.ts

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI!;

const QuestionSchema = new mongoose.Schema({
    questionText: String,
    options: [String],
    correctAnswer: Number,
    explanation: String,
    marks: { type: Number, default: 1 },
});

const MockTestSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
        topicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
        duration: Number,
        totalMarks: Number,
        negativeMarking: { type: Number, default: 0.25 },
        questions: [QuestionSchema],
        isPublished: { type: Boolean, default: false },
        difficulty: String,
        totalQuestions: Number,
    },
    { timestamps: true }
);

const MockTest = mongoose.models.MockTest || mongoose.model("MockTest", MockTestSchema);

const sampleTests = [
    {
        title: "Quantitative Aptitude - Basic",
        description: "Test your fundamental math skills with percentage, ratio, and number system questions. Perfect for Banking & SSC prep.",
        duration: 15,
        negativeMarking: 0.25,
        isPublished: true,
        difficulty: "easy",
        questions: [
            {
                questionText: "What is 25% of 400?",
                options: ["80", "100", "120", "150"],
                correctAnswer: 1,
                explanation: "25% of 400 = (25/100) × 400 = 100",
                marks: 1,
            },
            {
                questionText: "If A:B = 3:4 and B:C = 2:5, then A:B:C is?",
                options: ["3:4:10", "6:8:20", "3:4:5", "6:4:10"],
                correctAnswer: 0,
                explanation: "A:B = 3:4, B:C = 2:5. Make B common: A:B = 3:4, B:C = 4:10. So A:B:C = 3:4:10",
                marks: 1,
            },
            {
                questionText: "A train 120m long passes a pole in 12 seconds. What is its speed in km/h?",
                options: ["36 km/h", "40 km/h", "32 km/h", "28 km/h"],
                correctAnswer: 0,
                explanation: "Speed = 120/12 = 10 m/s = 10 × 18/5 = 36 km/h",
                marks: 1,
            },
            {
                questionText: "The simple interest on Rs 5000 at 8% per annum for 3 years is?",
                options: ["Rs 1000", "Rs 1200", "Rs 1400", "Rs 800"],
                correctAnswer: 1,
                explanation: "SI = (P × R × T)/100 = (5000 × 8 × 3)/100 = Rs 1200",
                marks: 1,
            },
            {
                questionText: "The average of first 10 natural numbers is?",
                options: ["5", "5.5", "6", "6.5"],
                correctAnswer: 1,
                explanation: "Sum = 10 × 11/2 = 55. Average = 55/10 = 5.5",
                marks: 1,
            },
            {
                questionText: "If the cost price is Rs 800 and selling price is Rs 920, what is the profit percentage?",
                options: ["12%", "15%", "18%", "20%"],
                correctAnswer: 1,
                explanation: "Profit = 920 - 800 = 120. Profit% = (120/800) × 100 = 15%",
                marks: 1,
            },
            {
                questionText: "The LCM of 12, 18, and 24 is?",
                options: ["48", "72", "96", "36"],
                correctAnswer: 1,
                explanation: "12 = 2² × 3, 18 = 2 × 3², 24 = 2³ × 3. LCM = 2³ × 3² = 72",
                marks: 1,
            },
            {
                questionText: "A man walks 4 km in 40 minutes. His speed in m/s is?",
                options: ["1.67 m/s", "2 m/s", "1.5 m/s", "2.5 m/s"],
                correctAnswer: 0,
                explanation: "Speed = 4000m / 2400s = 1.67 m/s",
                marks: 1,
            },
            {
                questionText: "If x + 1/x = 5, then x² + 1/x² = ?",
                options: ["23", "25", "27", "21"],
                correctAnswer: 0,
                explanation: "(x + 1/x)² = x² + 2 + 1/x² = 25. So x² + 1/x² = 23",
                marks: 1,
            },
            {
                questionText: "A shopkeeper offers 10% discount and still makes 8% profit. The ratio of marked price to cost price is?",
                options: ["5:4", "6:5", "7:6", "8:7"],
                correctAnswer: 1,
                explanation: "Let CP = 100. SP = 108. MP × 0.9 = 108. MP = 120. Ratio = 120:100 = 6:5",
                marks: 1,
            },
        ],
    },
    {
        title: "English Language - Grammar & Comprehension",
        description: "Assess your English grammar, vocabulary, and reading comprehension skills for competitive exams.",
        duration: 20,
        negativeMarking: 0.25,
        isPublished: true,
        difficulty: "medium",
        questions: [
            {
                questionText: "Choose the correct synonym of 'Benevolent':",
                options: ["Hostile", "Kind", "Indifferent", "Cruel"],
                correctAnswer: 1,
                explanation: "Benevolent means well-meaning and kindly. The correct synonym is 'Kind'.",
                marks: 1,
            },
            {
                questionText: "Identify the error: 'Each of the students have completed their assignment.'",
                options: ["Each of", "the students", "have completed", "their assignment"],
                correctAnswer: 2,
                explanation: "'Each' takes a singular verb. It should be 'has completed'.",
                marks: 1,
            },
            {
                questionText: "The antonym of 'Verbose' is:",
                options: ["Lengthy", "Concise", "Wordy", "Elaborate"],
                correctAnswer: 1,
                explanation: "Verbose means using too many words. The antonym is 'Concise'.",
                marks: 1,
            },
            {
                questionText: "Choose the correct form: 'He _____ to the gym every morning.'",
                options: ["go", "goes", "going", "gone"],
                correctAnswer: 1,
                explanation: "With third person singular (He), use 'goes' in simple present tense.",
                marks: 1,
            },
            {
                questionText: "The idiom 'To burn the midnight oil' means:",
                options: ["To waste resources", "To work late at night", "To cause a fire", "To be lazy"],
                correctAnswer: 1,
                explanation: "The idiom means to study or work hard, especially late at night.",
                marks: 1,
            },
            {
                questionText: "'Ephemeral' means something that is:",
                options: ["Permanent", "Short-lived", "Ancient", "Significant"],
                correctAnswer: 1,
                explanation: "Ephemeral means lasting for a very short time.",
                marks: 1,
            },
            {
                questionText: "Choose the correct spelling:",
                options: ["Accomodation", "Accommodation", "Acommodation", "Acomodation"],
                correctAnswer: 1,
                explanation: "The correct spelling is 'Accommodation' with double 'c' and double 'm'.",
                marks: 1,
            },
            {
                questionText: "The passive voice of 'She writes a letter' is:",
                options: ["A letter is written by her", "A letter was written by her", "A letter has been written by her", "A letter is being written by her"],
                correctAnswer: 0,
                explanation: "Simple present active → Simple present passive: 'A letter is written by her'.",
                marks: 1,
            },
        ],
    },
    {
        title: "Reasoning Ability - Advanced",
        description: "Challenge your logical reasoning with puzzles, coding-decoding, and analytical questions at advanced level.",
        duration: 25,
        negativeMarking: 0.5,
        isPublished: true,
        difficulty: "hard",
        questions: [
            {
                questionText: "If APPLE is coded as ELPPA, how is MANGO coded?",
                options: ["OGNAM", "ONAGM", "OGNMA", "OGANM"],
                correctAnswer: 0,
                explanation: "The pattern reverses the word. MANGO reversed = OGNAM",
                marks: 2,
            },
            {
                questionText: "In a row of 30 students, Ravi is 12th from the left. What is his position from the right?",
                options: ["18th", "19th", "20th", "17th"],
                correctAnswer: 1,
                explanation: "Position from right = Total - Position from left + 1 = 30 - 12 + 1 = 19th",
                marks: 2,
            },
            {
                questionText: "Find the odd one out: 2, 5, 10, 17, 28, 37",
                options: ["5", "10", "28", "37"],
                correctAnswer: 2,
                explanation: "Pattern: +3, +5, +7, +9, +11. After 17, it should be 26 (not 28). So 28 is incorrect.",
                marks: 2,
            },
            {
                questionText: "If Monday falls on 1st January, what day is 100th day of the year?",
                options: ["Sunday", "Monday", "Tuesday", "Wednesday"],
                correctAnswer: 2,
                explanation: "100 days from Monday: 100/7 = 14 weeks + 2 days. Monday + 2 = Tuesday (since day 1 is Monday, day 100 is 99 days later = 14 weeks + 1 day = Tuesday)",
                marks: 2,
            },
            {
                questionText: "A is the father of B. C is the daughter of A. D is the brother of B. How is C related to D?",
                options: ["Mother", "Sister", "Aunt", "Cousin"],
                correctAnswer: 1,
                explanation: "A is father of B and C. D is brother of B, so D is also A's child. C is D's sister.",
                marks: 2,
            },
        ],
    },
];

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        // Clear existing mock tests
        await MockTest.deleteMany({});
        console.log("Cleared existing mock tests");

        for (const testData of sampleTests) {
            const totalQuestions = testData.questions.length;
            const totalMarks = testData.questions.reduce((sum, q) => sum + q.marks, 0);
            const test = await MockTest.create({
                ...testData,
                totalQuestions,
                totalMarks,
            });
            console.log(`Created: "${test.title}" (${totalQuestions} questions, ${totalMarks} marks)`);
        }

        console.log("\n✅ Seed complete! 3 sample mock tests created.");
        process.exit(0);
    } catch (error) {
        console.error("Seed failed:", error);
        process.exit(1);
    }
}

seed();
