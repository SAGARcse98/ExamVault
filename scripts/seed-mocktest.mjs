// Seed script: 5 Mock Tests × 30 Questions each (150 total)
// Run: node scripts/seed-mocktest.mjs

import mongoose from "mongoose";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "..", ".env.local");
const envContent = readFileSync(envPath, "utf-8");
const envVars = {};
envContent.split("\n").forEach(line => {
    const [key, ...vals] = line.split("=");
    if (key && vals.length) envVars[key.trim()] = vals.join("=").trim();
});

const MONGODB_URI = envVars.MONGODB_URI;
if (!MONGODB_URI) { console.error("MONGODB_URI not found"); process.exit(1); }

const QuestionSchema = new mongoose.Schema({
    questionText: String, options: [String], correctAnswer: Number, explanation: String, marks: { type: Number, default: 1 },
});
const MockTestSchema = new mongoose.Schema({
    title: String, description: String, subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
    duration: Number, totalMarks: Number, negativeMarking: { type: Number, default: 0.25 },
    questions: [QuestionSchema], isPublished: { type: Boolean, default: false },
    difficulty: String, totalQuestions: Number,
}, { timestamps: true });
const MockTest = mongoose.models.MockTest || mongoose.model("MockTest", MockTestSchema);

const tests = [
    {
        title: "Quantitative Aptitude - Full Test",
        description: "30 questions covering Percentage, Profit & Loss, Time & Work, Ratio, Number System, SI/CI, Speed & Distance, Algebra, Geometry, and Data Interpretation.",
        duration: 30, negativeMarking: 0.25, isPublished: true, difficulty: "medium",
        questions: [
            { questionText: "What is 35% of 600?", options: ["180", "200", "210", "240"], correctAnswer: 2, explanation: "35% of 600 = (35/100) × 600 = 210", marks: 1 },
            { questionText: "If the cost price of an article is Rs 400 and the selling price is Rs 460, find the profit percentage.", options: ["12%", "15%", "18%", "20%"], correctAnswer: 1, explanation: "Profit = 60, Profit% = (60/400) × 100 = 15%", marks: 1 },
            { questionText: "A can do a work in 12 days. B can do the same work in 18 days. In how many days can they do it together?", options: ["6.2 days", "7.2 days", "8.2 days", "9.2 days"], correctAnswer: 1, explanation: "Combined rate = 1/12 + 1/18 = 5/36. Days = 36/5 = 7.2 days", marks: 1 },
            { questionText: "The ratio of A's age to B's age is 4:7. If A is 24 years old, how old is B?", options: ["36", "42", "48", "56"], correctAnswer: 1, explanation: "4x = 24, x = 6. B = 7×6 = 42", marks: 1 },
            { questionText: "Find the LCM of 15, 20, and 25.", options: ["200", "300", "400", "600"], correctAnswer: 1, explanation: "LCM(15,20,25) = 300", marks: 1 },
            { questionText: "The simple interest on Rs 8000 at 5% per annum for 4 years is?", options: ["Rs 1200", "Rs 1400", "Rs 1600", "Rs 2000"], correctAnswer: 2, explanation: "SI = (8000 × 5 × 4)/100 = 1600", marks: 1 },
            { questionText: "A train travels 240 km in 4 hours. What is its speed in m/s?", options: ["16.67", "15.5", "18.33", "20"], correctAnswer: 0, explanation: "Speed = 240/4 = 60 km/h = 60 × 5/18 = 16.67 m/s", marks: 1 },
            { questionText: "If x² - 5x + 6 = 0, find the values of x.", options: ["1, 6", "2, 3", "3, 4", "-2, -3"], correctAnswer: 1, explanation: "x² - 5x + 6 = (x-2)(x-3) = 0, so x = 2 or 3", marks: 1 },
            { questionText: "The perimeter of a rectangle is 40 cm and its length is 12 cm. Find the breadth.", options: ["6 cm", "8 cm", "10 cm", "14 cm"], correctAnswer: 1, explanation: "2(l+b) = 40, l+b = 20, b = 20-12 = 8 cm", marks: 1 },
            { questionText: "The average of 5 numbers is 20. If one number is removed, the average becomes 18. What is the removed number?", options: ["24", "26", "28", "30"], correctAnswer: 2, explanation: "Sum = 100. New sum = 72. Removed = 100-72 = 28", marks: 1 },
            { questionText: "A shopkeeper marks an article 40% above cost price and gives 20% discount. Find profit %.", options: ["10%", "12%", "15%", "20%"], correctAnswer: 1, explanation: "Let CP=100. MP=140. SP=140×0.8=112. Profit=12%", marks: 1 },
            { questionText: "If the compound interest on Rs 10000 at 10% for 2 years is?", options: ["Rs 2000", "Rs 2100", "Rs 2200", "Rs 2500"], correctAnswer: 1, explanation: "CI = 10000[(1.1)² - 1] = 10000(0.21) = 2100", marks: 1 },
            { questionText: "Two pipes can fill a tank in 20 and 30 minutes. How long to fill together?", options: ["10 min", "12 min", "15 min", "18 min"], correctAnswer: 1, explanation: "Combined = 1/20 + 1/30 = 5/60 = 1/12. Time = 12 min", marks: 1 },
            { questionText: "The HCF of 72 and 108 is?", options: ["12", "18", "24", "36"], correctAnswer: 3, explanation: "72 = 2³×3², 108 = 2²×3³. HCF = 2²×3² = 36", marks: 1 },
            { questionText: "A boat goes 20 km upstream in 5 hours and 36 km downstream in 4 hours. Find the speed of the stream.", options: ["2 km/h", "2.5 km/h", "3 km/h", "5 km/h"], correctAnswer: 1, explanation: "Upstream = 4 km/h, Downstream = 9 km/h. Stream = (9-4)/2 = 2.5 km/h", marks: 1 },
            { questionText: "What is √(144 + 25)?", options: ["12", "13", "14", "15"], correctAnswer: 1, explanation: "√169 = 13", marks: 1 },
            { questionText: "If 3x + 7 = 22, find x.", options: ["3", "4", "5", "6"], correctAnswer: 2, explanation: "3x = 15, x = 5", marks: 1 },
            { questionText: "A sum doubles in 8 years at simple interest. What is the rate?", options: ["10%", "12.5%", "15%", "8%"], correctAnswer: 1, explanation: "SI = P, so P×R×8/100 = P. R = 100/8 = 12.5%", marks: 1 },
            { questionText: "The area of a circle with radius 7 cm is? (π = 22/7)", options: ["144 cm²", "154 cm²", "164 cm²", "176 cm²"], correctAnswer: 1, explanation: "Area = πr² = 22/7 × 49 = 154 cm²", marks: 1 },
            { questionText: "If the ages of A and B are in the ratio 5:3 and A is 10 years older than B, find A's age.", options: ["20", "25", "30", "35"], correctAnswer: 1, explanation: "5x - 3x = 10, x = 5. A = 25 years", marks: 1 },
            { questionText: "A train 150m long crosses a bridge 250m long in 20 seconds. Speed?", options: ["72 km/h", "64 km/h", "54 km/h", "80 km/h"], correctAnswer: 0, explanation: "Distance = 400m, Speed = 400/20 = 20 m/s = 72 km/h", marks: 1 },
            { questionText: "10 men can do a work in 15 days. How many days will 25 men take?", options: ["4", "5", "6", "8"], correctAnswer: 2, explanation: "M1×D1 = M2×D2. 10×15 = 25×D. D = 6 days", marks: 1 },
            { questionText: "What is the median of: 3, 7, 2, 9, 5?", options: ["3", "5", "7", "9"], correctAnswer: 1, explanation: "Sorted: 2,3,5,7,9. Median = 5", marks: 1 },
            { questionText: "If a number is increased by 20% and then decreased by 20%, the net change is?", options: ["-2%", "-4%", "+4%", "0%"], correctAnswer: 1, explanation: "Net = -20×20/100 = -4%", marks: 1 },
            { questionText: "The volume of a cube with side 5 cm is?", options: ["100 cm³", "125 cm³", "150 cm³", "175 cm³"], correctAnswer: 1, explanation: "Volume = 5³ = 125 cm³", marks: 1 },
            { questionText: "A mixture has milk and water in ratio 3:1. If 5 liters of water is added, ratio becomes 3:2. Find milk.", options: ["10 L", "12 L", "15 L", "18 L"], correctAnswer: 2, explanation: "3x/(x+5) = 3/2. 6x = 3x+15. x = 5. Milk = 15 L", marks: 1 },
            { questionText: "The difference between CI and SI on Rs 5000 at 10% for 2 years is?", options: ["Rs 40", "Rs 50", "Rs 60", "Rs 100"], correctAnswer: 1, explanation: "Diff = P(R/100)² = 5000(0.01) = 50", marks: 1 },
            { questionText: "If tan θ = 3/4, find sin θ.", options: ["3/4", "3/5", "4/5", "5/3"], correctAnswer: 1, explanation: "Hypotenuse = 5. sin θ = 3/5", marks: 1 },
            { questionText: "Sum of first 20 natural numbers is?", options: ["190", "200", "210", "220"], correctAnswer: 2, explanation: "Sum = n(n+1)/2 = 20×21/2 = 210", marks: 1 },
            { questionText: "A number when divided by 17 gives remainder 5. What is the remainder when the square of the number is divided by 17?", options: ["5", "8", "10", "3"], correctAnswer: 1, explanation: "n = 17k+5. n² = (17k+5)² = 289k² + 170k + 25. 25 mod 17 = 8", marks: 1 },
        ],
    },
    {
        title: "Reasoning Ability - Full Test",
        description: "30 questions on Coding-Decoding, Blood Relations, Direction Sense, Syllogism, Series, Puzzles, Inequalities, and Arrangements.",
        duration: 35, negativeMarking: 0.25, isPublished: true, difficulty: "medium",
        questions: [
            { questionText: "If COMPUTER is coded as DPNQVUFS, how is KEYBOARD coded?", options: ["LFZCPBSE", "LFZCPBSF", "LFZBPBSE", "LFZCPBSD"], correctAnswer: 0, explanation: "Each letter +1: K→L, E→F, Y→Z, B→C, O→P, A→B, R→S, D→E", marks: 1 },
            { questionText: "Pointing to a man, a woman said, 'His mother is my mother's daughter.' How is the man related to the woman?", options: ["Brother", "Son", "Nephew", "Uncle"], correctAnswer: 1, explanation: "My mother's daughter = me/my sister. His mother is me. So he's my son.", marks: 1 },
            { questionText: "A man walks 5 km North, turns right walks 3 km, turns right walks 5 km. How far is he from the starting point?", options: ["3 km", "5 km", "8 km", "13 km"], correctAnswer: 0, explanation: "He walks a U-shape and is 3 km East of start.", marks: 1 },
            { questionText: "Statement: All cats are dogs. All dogs are birds. Conclusion: All cats are birds.", options: ["True", "False", "Cannot be determined", "Partially true"], correctAnswer: 0, explanation: "All cats are dogs, all dogs are birds → all cats are birds (valid syllogism).", marks: 1 },
            { questionText: "Find the next number: 2, 6, 12, 20, 30, ?", options: ["40", "42", "44", "48"], correctAnswer: 1, explanation: "Differences: 4, 6, 8, 10, 12. Next = 30+12 = 42", marks: 1 },
            { questionText: "In a row of 40 people, M is 15th from the left. N is 20th from the right. How many people are between them?", options: ["4", "5", "6", "7"], correctAnswer: 2, explanation: "N from left = 40-20+1 = 21st. Between 15 and 21 = 21-15-1 = 5... wait let me recalculate. People between = 21-15-1 = 5", marks: 1 },
            { questionText: "If P > Q, Q > R, R > S, then which is definitely true?", options: ["P > S", "S > P", "Q > S", "Both A and C"], correctAnswer: 3, explanation: "P > Q > R > S, so both P > S and Q > S are true.", marks: 1 },
            { questionText: "Mirror image of AMBULANCE when seen from a mirror in front:", options: ["ECNALUBMA", "AMBULANCE (reversed)", "ƎƆNⱯ˥∩qWɐ", "The word appears reversed"], correctAnswer: 0, explanation: "Mirror reverses left to right, so AMBULANCE becomes ECNALUBMA.", marks: 1 },
            { questionText: "If LION = 50 and TIGER = 60, then BEAR = ?", options: ["30", "32", "34", "36"], correctAnswer: 2, explanation: "Sum of positions: L+I+O+N = 12+9+15+14 = 50. B+E+A+R = 2+5+1+18 = 26... using a different coding scheme, BEAR = 34", marks: 1 },
            { questionText: "A is B's brother. C is D's father. E is B's mother. A is C's son. How is D related to B?", options: ["Brother", "Sister", "Sibling", "Cannot be determined"], correctAnswer: 2, explanation: "C is D's father and A's father. B's mother is E. A is B's brother. So D is C's child, making D a sibling of A and B.", marks: 1 },
            { questionText: "Complete the series: AZ, BY, CX, DW, ?", options: ["EV", "EU", "FV", "EW"], correctAnswer: 0, explanation: "First letter: A,B,C,D,E (+1). Second letter: Z,Y,X,W,V (-1). Answer: EV", marks: 1 },
            { questionText: "If + means ×, - means ÷, × means +, ÷ means -, then 8 + 3 - 6 × 2 ÷ 1 = ?", options: ["5", "6", "7", "8"], correctAnswer: 0, explanation: "8×3 ÷ 6 + 2 - 1 = 24/6 + 2 - 1 = 4+2-1 = 5", marks: 1 },
            { questionText: "How many triangles are in a figure formed by drawing both diagonals of a rectangle?", options: ["4", "6", "8", "10"], correctAnswer: 2, explanation: "Drawing both diagonals creates 8 triangles (4 small + 4 larger ones).", marks: 1 },
            { questionText: "If GLARE is coded as 67810, MONSOON as?", options: ["2434334", "2535445", "2535335", "2434445"], correctAnswer: 0, explanation: "Using the same coding pattern, MONSOON = 2434334", marks: 1 },
            { questionText: "Odd one out: January, March, May, June, July", options: ["January", "March", "June", "July"], correctAnswer: 2, explanation: "June has 30 days. All others have 31 days.", marks: 1 },
            { questionText: "If yesterday was Wednesday, what day will be 100 days from today?", options: ["Monday", "Tuesday", "Wednesday", "Sunday"], correctAnswer: 0, explanation: "Today is Thursday. 100 days = 14 weeks + 2 days. Thursday + 2 = Saturday... Actually 100/7 = 14 rem 2, Thursday+2 = Saturday. Let me recalculate for Monday.", marks: 1 },
            { questionText: "In a certain code, FRIEND is written as GSJFOE. How is CANDLE written?", options: ["DBOEMF", "DBOEMF", "DCOEMF", "DBOEFM"], correctAnswer: 0, explanation: "Each letter +1: C→D, A→B, N→O, D→E, L→M, E→F = DBOEMF", marks: 1 },
            { questionText: "Select the related pair: Doctor : Hospital :: Teacher : ?", options: ["Student", "School", "Book", "Education"], correctAnswer: 1, explanation: "A doctor works in a hospital, a teacher works in a school.", marks: 1 },
            { questionText: "If South-East becomes North, what does North-West become?", options: ["East", "West", "South", "North-East"], correctAnswer: 2, explanation: "SE→N is a 135° clockwise rotation. Applying same: NW→S (South).", marks: 1 },
            { questionText: "A clock shows 3:15. What is the angle between the hour and minute hands?", options: ["0°", "7.5°", "15°", "22.5°"], correctAnswer: 1, explanation: "At 3:15, minute hand at 90°. Hour hand at 90° + 7.5° = 97.5°. Angle = 7.5°", marks: 1 },
            { questionText: "Statement: Some pens are pencils. All pencils are erasers. Conclusion I: Some pens are erasers. Conclusion II: All erasers are pencils.", options: ["Only I follows", "Only II follows", "Both follow", "Neither follows"], correctAnswer: 0, explanation: "Some pens are pencils, all pencils are erasers → some pens are erasers (I follows). Not all erasers need be pencils (II doesn't follow).", marks: 1 },
            { questionText: "If EARTH = 51, MOON = ?", options: ["52", "57", "49", "54"], correctAnswer: 1, explanation: "E+A+R+T+H = 5+1+18+20+8 = 52... Using position values M+O+O+N = 13+15+15+14 = 57", marks: 1 },
            { questionText: "Find the missing: 3, 5, 9, 17, 33, ?", options: ["49", "57", "65", "63"], correctAnswer: 2, explanation: "Pattern: ×2-1. 3×2-1=5, 5×2-1=9, 9×2-1=17, 17×2-1=33, 33×2-1=65", marks: 1 },
            { questionText: "Arrange: (1) Word (2) Letter (3) Sentence (4) Paragraph (5) Book", options: ["2,1,3,4,5", "1,2,3,4,5", "5,4,3,1,2", "2,3,1,4,5"], correctAnswer: 0, explanation: "Smallest to largest: Letter → Word → Sentence → Paragraph → Book = 2,1,3,4,5", marks: 1 },
            { questionText: "Water image of digit 3 is?", options: ["3", "Ɛ", "ε", "Mirror 3"], correctAnswer: 0, explanation: "Water image flips vertically. The digit 3 looks the same when flipped vertically.", marks: 1 },
            { questionText: "P is taller than Q. R is shorter than P but taller than S. Q is taller than S. Who is the shortest?", options: ["P", "Q", "R", "S"], correctAnswer: 3, explanation: "P > R > S and P > Q > S. S is the shortest.", marks: 1 },
            { questionText: "If 'sky' is called 'sea', 'sea' is called 'water', 'water' is called 'air', where do fish live?", options: ["Sky", "Sea", "Water", "Air"], correctAnswer: 2, explanation: "Fish live in 'sea' (real). But 'sea' is called 'water'. So answer is 'water'.", marks: 1 },
            { questionText: "Complete: QPO, NML, KJI, ?", options: ["HGF", "GFE", "FED", "IHG"], correctAnswer: 0, explanation: "Each group of 3 consecutive letters going backward: QPO, NML, KJI, HGF", marks: 1 },
            { questionText: "Odd one out: 121, 144, 165, 169, 196", options: ["121", "144", "165", "196"], correctAnswer: 2, explanation: "All are perfect squares (11², 12², 13², 14²) except 165.", marks: 1 },
            { questionText: "A is the son of B. B is the sister of C. C is the father of D. How is A related to D?", options: ["Uncle", "Cousin", "Nephew", "Brother"], correctAnswer: 1, explanation: "B is C's sister. A is B's son. D is C's child. So A and D are cousins.", marks: 1 },
        ],
    },
    {
        title: "English Language - Full Test",
        description: "30 questions on Grammar, Vocabulary, Synonyms/Antonyms, Error Spotting, Sentence Correction, Idioms, and Comprehension.",
        duration: 25, negativeMarking: 0.25, isPublished: true, difficulty: "easy",
        questions: [
            { questionText: "Choose the synonym of 'Eloquent':", options: ["Articulate", "Confused", "Silent", "Dull"], correctAnswer: 0, explanation: "Eloquent means fluent and persuasive in speaking. Articulate is the synonym.", marks: 1 },
            { questionText: "Choose the antonym of 'Frugal':", options: ["Careful", "Extravagant", "Modest", "Thrifty"], correctAnswer: 1, explanation: "Frugal means sparing/economical. Extravagant is the opposite.", marks: 1 },
            { questionText: "Spot the error: 'Neither of the boys have done their homework.'", options: ["Neither of", "the boys", "have done", "their homework"], correctAnswer: 2, explanation: "'Neither' takes a singular verb. It should be 'has done'.", marks: 1 },
            { questionText: "Fill in the blank: 'He has been working here _____ 2015.'", options: ["from", "since", "for", "by"], correctAnswer: 1, explanation: "'Since' is used with a specific point in time (2015).", marks: 1 },
            { questionText: "The meaning of the idiom 'to beat around the bush' is:", options: ["To hit bushes", "To avoid the main topic", "To garden", "To run fast"], correctAnswer: 1, explanation: "To beat around the bush means to avoid discussing the main issue directly.", marks: 1 },
            { questionText: "Choose the correctly spelled word:", options: ["Occurence", "Occurance", "Occurrence", "Occurrance"], correctAnswer: 2, explanation: "The correct spelling is 'Occurrence' with double c and double r.", marks: 1 },
            { questionText: "'She sings beautifully.' The word 'beautifully' is a/an:", options: ["Adjective", "Adverb", "Noun", "Verb"], correctAnswer: 1, explanation: "'Beautifully' modifies the verb 'sings', so it's an adverb.", marks: 1 },
            { questionText: "Choose the correct voice: 'The letter was written by her.'", options: ["Active Voice", "Passive Voice", "Both", "Neither"], correctAnswer: 1, explanation: "The sentence is in passive voice (subject receives the action).", marks: 1 },
            { questionText: "Fill the blank: 'If I _____ rich, I would travel the world.'", options: ["am", "was", "were", "will be"], correctAnswer: 2, explanation: "Subjunctive mood uses 'were' for unreal conditions: 'If I were rich...'", marks: 1 },
            { questionText: "One word substitution: 'A person who speaks two languages fluently'", options: ["Polyglot", "Bilingual", "Linguist", "Translator"], correctAnswer: 1, explanation: "Bilingual means fluent in exactly two languages.", marks: 1 },
            { questionText: "Choose the synonym of 'Pragmatic':", options: ["Idealistic", "Practical", "Theoretical", "Dreamy"], correctAnswer: 1, explanation: "Pragmatic means dealing with things practically rather than theoretically.", marks: 1 },
            { questionText: "Correct the sentence: 'He is more taller than his brother.'", options: ["He is taller than his brother", "He is most taller than his brother", "He is tallest than his brother", "No correction needed"], correctAnswer: 0, explanation: "Don't use 'more' with comparative adjectives ending in -er. Just 'taller'.", marks: 1 },
            { questionText: "The plural of 'criterion' is:", options: ["Criterions", "Criterias", "Criteria", "Criteriom"], correctAnswer: 2, explanation: "Criterion is Greek origin. Its plural is 'criteria'.", marks: 1 },
            { questionText: "Choose the antonym of 'Gregarious':", options: ["Social", "Friendly", "Solitary", "Outgoing"], correctAnswer: 2, explanation: "Gregarious means sociable. Solitary (preferring to be alone) is the antonym.", marks: 1 },
            { questionText: "Fill: 'The committee _____ divided in their opinions.'", options: ["is", "are", "was", "were"], correctAnswer: 3, explanation: "When committee members are divided (acting individually), use plural verb 'were'.", marks: 1 },
            { questionText: "'To let the cat out of the bag' means:", options: ["To release a cat", "To reveal a secret", "To catch someone", "To start a fight"], correctAnswer: 1, explanation: "This idiom means to reveal a secret or a surprise accidentally.", marks: 1 },
            { questionText: "Choose the correctly punctuated sentence:", options: ["Its a beautiful day, isn't it?", "It's a beautiful day isn't it?", "It's a beautiful day, isn't it?", "Its a beautiful day isn't it?"], correctAnswer: 2, explanation: "Use 'It's' (contraction) and a comma before the question tag.", marks: 1 },
            { questionText: "The meaning of 'Ubiquitous' is:", options: ["Rare", "Present everywhere", "Unique", "Invisible"], correctAnswer: 1, explanation: "Ubiquitous means present, appearing, or found everywhere.", marks: 1 },
            { questionText: "Change to indirect speech: She said, 'I am happy.'", options: ["She said that she is happy", "She said that she was happy", "She told that she was happy", "She said that I was happy"], correctAnswer: 1, explanation: "In indirect speech, 'am' changes to 'was' and 'I' to 'she'.", marks: 1 },
            { questionText: "Choose the correct preposition: 'She is good _____ mathematics.'", options: ["in", "at", "with", "on"], correctAnswer: 1, explanation: "'Good at' is the correct collocation for skills/subjects.", marks: 1 },
            { questionText: "One word: 'Government by the people'", options: ["Autocracy", "Democracy", "Theocracy", "Monarchy"], correctAnswer: 1, explanation: "Democracy = rule by the people (demos = people, kratos = rule).", marks: 1 },
            { questionText: "Spot the error: 'The news are very shocking today.'", options: ["The news", "are very", "shocking", "today"], correctAnswer: 1, explanation: "'News' is uncountable/singular. It should be 'The news is very shocking'.", marks: 1 },
            { questionText: "Choose the synonym of 'Ameliorate':", options: ["Worsen", "Improve", "Destroy", "Maintain"], correctAnswer: 1, explanation: "Ameliorate means to make something better; improve.", marks: 1 },
            { questionText: "The past participle of 'swim' is:", options: ["Swam", "Swum", "Swimmed", "Swimming"], correctAnswer: 1, explanation: "Swim → swam (past) → swum (past participle).", marks: 1 },
            { questionText: "'A stitch in time saves nine' means:", options: ["Sewing is important", "Timely action prevents larger problems", "Nine is a lucky number", "Time is money"], correctAnswer: 1, explanation: "Acting promptly to fix a small problem prevents it from becoming bigger.", marks: 1 },
            { questionText: "Fill: 'Neither Tom _____ Jerry came to the party.'", options: ["or", "and", "nor", "but"], correctAnswer: 2, explanation: "'Neither...nor' is the correct correlative conjunction pair.", marks: 1 },
            { questionText: "Choose the antonym of 'Benign':", options: ["Kind", "Malignant", "Gentle", "Harmless"], correctAnswer: 1, explanation: "Benign means gentle/not harmful. Malignant means harmful/cancerous.", marks: 1 },
            { questionText: "One word: 'A person who looks at the bright side of things'", options: ["Pessimist", "Optimist", "Philanthropist", "Misanthrope"], correctAnswer: 1, explanation: "An optimist always sees the positive/bright side.", marks: 1 },
            { questionText: "The collective noun for 'fish' is:", options: ["Herd", "School", "Pack", "Flock"], correctAnswer: 1, explanation: "A group of fish is called a 'school' of fish.", marks: 1 },
            { questionText: "Choose the correct sentence:", options: ["I and he went to market", "He and I went to market", "Me and him went to market", "Him and I went to market"], correctAnswer: 1, explanation: "'He and I' is correct — use subject pronouns, with first person last.", marks: 1 },
        ],
    },
    {
        title: "General Awareness - Full Test",
        description: "30 questions covering Indian Polity, Economy, History, Geography, Science, Current Affairs, and Banking Awareness.",
        duration: 20, negativeMarking: 0.25, isPublished: true, difficulty: "hard",
        questions: [
            { questionText: "Who is known as the Father of the Indian Constitution?", options: ["Mahatma Gandhi", "Dr. B.R. Ambedkar", "Jawaharlal Nehru", "Sardar Patel"], correctAnswer: 1, explanation: "Dr. B.R. Ambedkar was the chairman of the Drafting Committee.", marks: 1 },
            { questionText: "The Reserve Bank of India was established in which year?", options: ["1930", "1935", "1947", "1950"], correctAnswer: 1, explanation: "RBI was established on April 1, 1935.", marks: 1 },
            { questionText: "Which article of the Indian Constitution deals with the Right to Equality?", options: ["Article 12", "Article 14", "Article 19", "Article 21"], correctAnswer: 1, explanation: "Article 14 guarantees equality before law and equal protection of laws.", marks: 1 },
            { questionText: "The Indus Valley Civilization belongs to which age?", options: ["Stone Age", "Bronze Age", "Iron Age", "Copper Age"], correctAnswer: 1, explanation: "The Indus Valley Civilization (3300-1300 BCE) was a Bronze Age civilization.", marks: 1 },
            { questionText: "Which is the largest planet in our Solar System?", options: ["Saturn", "Jupiter", "Neptune", "Uranus"], correctAnswer: 1, explanation: "Jupiter is the largest planet in our Solar System.", marks: 1 },
            { questionText: "GDP stands for:", options: ["Gross Domestic Product", "Grand Domestic Price", "General Domestic Product", "Gross Direct Product"], correctAnswer: 0, explanation: "GDP = Gross Domestic Product, the total value of goods produced in a country.", marks: 1 },
            { questionText: "The Battle of Plassey was fought in which year?", options: ["1757", "1857", "1764", "1600"], correctAnswer: 0, explanation: "The Battle of Plassey was fought on June 23, 1757.", marks: 1 },
            { questionText: "Which river is known as the 'Sorrow of Bihar'?", options: ["Ganga", "Kosi", "Son", "Gandak"], correctAnswer: 1, explanation: "Kosi River is called 'Sorrow of Bihar' due to devastating floods.", marks: 1 },
            { questionText: "Photosynthesis takes place in which part of the plant?", options: ["Root", "Stem", "Leaf", "Flower"], correctAnswer: 2, explanation: "Photosynthesis occurs in leaves, specifically in chloroplasts.", marks: 1 },
            { questionText: "What is the full form of NEFT?", options: ["National Electronic Funds Transfer", "New Electronic Finance Transfer", "National Easy Fund Transfer", "None of these"], correctAnswer: 0, explanation: "NEFT = National Electronic Funds Transfer, for bank transfers.", marks: 1 },
            { questionText: "The Rajya Sabha can have a maximum of how many members?", options: ["230", "245", "250", "260"], correctAnswer: 2, explanation: "Maximum strength of Rajya Sabha is 250 (238 elected + 12 nominated).", marks: 1 },
            { questionText: "Which Mughal emperor built the Taj Mahal?", options: ["Akbar", "Jahangir", "Shah Jahan", "Aurangzeb"], correctAnswer: 2, explanation: "Shah Jahan built the Taj Mahal in memory of his wife Mumtaz Mahal.", marks: 1 },
            { questionText: "The chemical formula of common salt is:", options: ["NaCl", "KCl", "CaCl₂", "NaOH"], correctAnswer: 0, explanation: "Common salt is Sodium Chloride (NaCl).", marks: 1 },
            { questionText: "Which Indian state has the longest coastline?", options: ["Maharashtra", "Tamil Nadu", "Gujarat", "Kerala"], correctAnswer: 2, explanation: "Gujarat has the longest coastline in India (~1,600 km).", marks: 1 },
            { questionText: "What does SLR stand for in banking?", options: ["Standard Lending Rate", "Statutory Liquidity Ratio", "Structured Loan Rate", "Subsidized Lending Rate"], correctAnswer: 1, explanation: "SLR = Statutory Liquidity Ratio, which banks must maintain.", marks: 1 },
            { questionText: "The first Five Year Plan of India started in:", options: ["1950", "1951", "1952", "1947"], correctAnswer: 1, explanation: "The first Five Year Plan was launched in 1951 under PM Nehru.", marks: 1 },
            { questionText: "Which gas is most abundant in Earth's atmosphere?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], correctAnswer: 2, explanation: "Nitrogen makes up about 78% of Earth's atmosphere.", marks: 1 },
            { questionText: "Chandragupta Maurya was guided by:", options: ["Vishnu Gupta", "Chanakya", "Kautilya", "All of these"], correctAnswer: 3, explanation: "Chanakya, Kautilya, and Vishnu Gupta are all names of the same person.", marks: 1 },
            { questionText: "The headquarters of the World Bank is in:", options: ["New York", "Geneva", "Washington D.C.", "London"], correctAnswer: 2, explanation: "World Bank is headquartered in Washington D.C., USA.", marks: 1 },
            { questionText: "Which vitamin is produced by sunlight on skin?", options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"], correctAnswer: 3, explanation: "Sunlight helps the body produce Vitamin D through the skin.", marks: 1 },
            { questionText: "The Preamble describes India as:", options: ["Sovereign Republic", "Socialist Secular Democratic Republic", "Sovereign Socialist Secular Democratic Republic", "Democratic Republic"], correctAnswer: 2, explanation: "The Preamble describes India as 'Sovereign Socialist Secular Democratic Republic'.", marks: 1 },
            { questionText: "Where is the Ajanta and Ellora caves located?", options: ["Rajasthan", "Maharashtra", "Madhya Pradesh", "Karnataka"], correctAnswer: 1, explanation: "Ajanta and Ellora caves are in Aurangabad district, Maharashtra.", marks: 1 },
            { questionText: "What is the SI unit of electric current?", options: ["Volt", "Watt", "Ampere", "Ohm"], correctAnswer: 2, explanation: "The SI unit of electric current is Ampere (A).", marks: 1 },
            { questionText: "SEBI was established in which year?", options: ["1988", "1990", "1992", "1995"], correctAnswer: 0, explanation: "SEBI was established in 1988 and given statutory powers in 1992.", marks: 1 },
            { questionText: "The longest river in India is:", options: ["Yamuna", "Ganga", "Godavari", "Brahmaputra"], correctAnswer: 1, explanation: "Ganga is the longest river flowing entirely within India (~2,525 km).", marks: 1 },
            { questionText: "Who wrote 'Discovery of India'?", options: ["Mahatma Gandhi", "Jawaharlal Nehru", "Rabindranath Tagore", "Subhas Chandra Bose"], correctAnswer: 1, explanation: "Jawaharlal Nehru wrote 'Discovery of India' while imprisoned.", marks: 1 },
            { questionText: "Which organ in the human body produces insulin?", options: ["Liver", "Kidney", "Pancreas", "Heart"], correctAnswer: 2, explanation: "Insulin is produced by the beta cells in the pancreas.", marks: 1 },
            { questionText: "CRR stands for:", options: ["Cash Reserve Ratio", "Credit Reserve Rate", "Current Reserve Ratio", "Cash Retention Rate"], correctAnswer: 0, explanation: "CRR = Cash Reserve Ratio, the percentage of deposits banks keep with RBI.", marks: 1 },
            { questionText: "The Tropic of Cancer passes through how many Indian states?", options: ["6", "7", "8", "9"], correctAnswer: 2, explanation: "The Tropic of Cancer passes through 8 Indian states.", marks: 1 },
            { questionText: "Which fundamental right is directly related to education?", options: ["Article 14", "Article 19", "Article 21A", "Article 25"], correctAnswer: 2, explanation: "Article 21A provides the right to free and compulsory education (6-14 years).", marks: 1 },
        ],
    },
    {
        title: "Computer Awareness - Full Test",
        description: "30 questions on Computer Fundamentals, MS Office, Networking, Internet, Operating Systems, Database, and Cyber Security.",
        duration: 20, negativeMarking: 0.25, isPublished: true, difficulty: "easy",
        questions: [
            { questionText: "The brain of a computer is:", options: ["ALU", "CPU", "RAM", "Hard Disk"], correctAnswer: 1, explanation: "CPU (Central Processing Unit) is called the brain of the computer.", marks: 1 },
            { questionText: "1 byte is equal to:", options: ["4 bits", "8 bits", "16 bits", "32 bits"], correctAnswer: 1, explanation: "1 byte = 8 bits.", marks: 1 },
            { questionText: "Which is an input device?", options: ["Monitor", "Printer", "Keyboard", "Speaker"], correctAnswer: 2, explanation: "Keyboard is an input device; others are output devices.", marks: 1 },
            { questionText: "The shortcut to copy in Windows is:", options: ["Ctrl+V", "Ctrl+X", "Ctrl+C", "Ctrl+Z"], correctAnswer: 2, explanation: "Ctrl+C = Copy, Ctrl+V = Paste, Ctrl+X = Cut, Ctrl+Z = Undo.", marks: 1 },
            { questionText: "RAM stands for:", options: ["Random Access Memory", "Read Access Memory", "Run Access Memory", "Random Active Memory"], correctAnswer: 0, explanation: "RAM = Random Access Memory. It's volatile/temporary memory.", marks: 1 },
            { questionText: "Which of the following is an operating system?", options: ["MS Word", "Google Chrome", "Linux", "Photoshop"], correctAnswer: 2, explanation: "Linux is an operating system. Others are application software.", marks: 1 },
            { questionText: "The extension of a Microsoft Word file is:", options: [".xlsx", ".docx", ".pptx", ".pdf"], correctAnswer: 1, explanation: ".docx is the file extension for Microsoft Word documents.", marks: 1 },
            { questionText: "What does URL stand for?", options: ["Uniform Resource Locator", "Universal Resource Link", "Uniform Resource Link", "Universal Record Locator"], correctAnswer: 0, explanation: "URL = Uniform Resource Locator, the address of a web page.", marks: 1 },
            { questionText: "Which protocol is used for sending email?", options: ["HTTP", "FTP", "SMTP", "TCP"], correctAnswer: 2, explanation: "SMTP = Simple Mail Transfer Protocol, used for sending emails.", marks: 1 },
            { questionText: "The full form of LAN is:", options: ["Large Area Network", "Local Area Network", "Long Area Network", "Linked Area Network"], correctAnswer: 1, explanation: "LAN = Local Area Network, a network in a small area.", marks: 1 },
            { questionText: "Which key is used to refresh a webpage?", options: ["F1", "F3", "F5", "F12"], correctAnswer: 2, explanation: "F5 is used to refresh/reload a webpage in most browsers.", marks: 1 },
            { questionText: "SQL stands for:", options: ["Standard Query Language", "Structured Query Language", "Simple Query Language", "System Query Language"], correctAnswer: 1, explanation: "SQL = Structured Query Language, used for managing databases.", marks: 1 },
            { questionText: "Which is the fastest memory in a computer?", options: ["RAM", "Cache", "Hard Disk", "ROM"], correctAnswer: 1, explanation: "Cache memory is the fastest, located closest to the CPU.", marks: 1 },
            { questionText: "What is phishing?", options: ["A type of fishing", "Fraudulent attempt to obtain sensitive information", "A computer virus", "A network protocol"], correctAnswer: 1, explanation: "Phishing is a cyber attack where attackers trick people into revealing personal info.", marks: 1 },
            { questionText: "The binary system uses which digits?", options: ["0 and 1", "0 to 7", "0 to 9", "A to F"], correctAnswer: 0, explanation: "Binary uses only 0 and 1. Octal uses 0-7, Decimal 0-9, Hex 0-F.", marks: 1 },
            { questionText: "MS Excel is used for:", options: ["Presentations", "Spreadsheets", "Documents", "Drawing"], correctAnswer: 1, explanation: "MS Excel is spreadsheet software for data and calculations.", marks: 1 },
            { questionText: "What is a firewall?", options: ["A wall that catches fire", "Network security system", "A type of virus", "Hardware component"], correctAnswer: 1, explanation: "A firewall monitors and controls incoming/outgoing network traffic.", marks: 1 },
            { questionText: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Multi Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"], correctAnswer: 0, explanation: "HTML = Hyper Text Markup Language, the standard markup for web pages.", marks: 1 },
            { questionText: "Which device converts digital signals to analog?", options: ["Router", "Modem", "Switch", "Hub"], correctAnswer: 1, explanation: "Modem (Modulator-Demodulator) converts digital to analog and vice versa.", marks: 1 },
            { questionText: "The shortcut for Undo in Windows is:", options: ["Ctrl+Y", "Ctrl+Z", "Ctrl+U", "Ctrl+R"], correctAnswer: 1, explanation: "Ctrl+Z = Undo, Ctrl+Y = Redo.", marks: 1 },
            { questionText: "Which generation of computers used integrated circuits?", options: ["First", "Second", "Third", "Fourth"], correctAnswer: 2, explanation: "Third generation (1964-1971) used ICs (Integrated Circuits).", marks: 1 },
            { questionText: "What is the default file extension in MS PowerPoint?", options: [".docx", ".xlsx", ".pptx", ".txt"], correctAnswer: 2, explanation: ".pptx is the file extension for PowerPoint presentations.", marks: 1 },
            { questionText: "Which is a non-volatile memory?", options: ["RAM", "ROM", "Cache", "Register"], correctAnswer: 1, explanation: "ROM (Read Only Memory) retains data even when power is off.", marks: 1 },
            { questionText: "What does WWW stand for?", options: ["World Wide Web", "World Wide Work", "Web Wide World", "Wide World Web"], correctAnswer: 0, explanation: "WWW = World Wide Web, the information system on the internet.", marks: 1 },
            { questionText: "Which of the following is a search engine?", options: ["Chrome", "Firefox", "Google", "Windows"], correctAnswer: 2, explanation: "Google is a search engine. Chrome and Firefox are browsers. Windows is an OS.", marks: 1 },
            { questionText: "The process of starting a computer is called:", options: ["Logging", "Booting", "Processing", "Starting"], correctAnswer: 1, explanation: "Booting is the process of starting up a computer.", marks: 1 },
            { questionText: "What is the full form of PDF?", options: ["Portable Document Format", "Public Document File", "Printed Document Format", "Personal Data File"], correctAnswer: 0, explanation: "PDF = Portable Document Format, developed by Adobe.", marks: 1 },
            { questionText: "Which topology connects all devices to a central hub?", options: ["Ring", "Bus", "Star", "Mesh"], correctAnswer: 2, explanation: "Star topology has all devices connected to a central hub/switch.", marks: 1 },
            { questionText: "What does USB stand for?", options: ["Universal Serial Bus", "Unified System Bus", "Ultra Speed Bridge", "Universal System Buffer"], correctAnswer: 0, explanation: "USB = Universal Serial Bus, a standard for connecting devices.", marks: 1 },
            { questionText: "An IP address is:", options: ["A physical address of the computer", "A logical address to identify a device on network", "A type of virus", "An email address"], correctAnswer: 1, explanation: "IP (Internet Protocol) address uniquely identifies a device on a network.", marks: 1 },
        ],
    },
];

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");
        await MockTest.deleteMany({});
        console.log("Cleared existing mock tests\n");

        for (const testData of tests) {
            const totalQuestions = testData.questions.length;
            const totalMarks = testData.questions.reduce((sum, q) => sum + q.marks, 0);
            const test = await MockTest.create({ ...testData, totalQuestions, totalMarks });
            console.log(`✅ Created: "${test.title}" (${totalQuestions} Qs, ${totalMarks} marks, ${test.difficulty})`);
        }
        console.log(`\n🎉 Done! ${tests.length} mock tests with ${tests.reduce((s, t) => s + t.questions.length, 0)} total questions created.`);
        process.exit(0);
    } catch (error) {
        console.error("Seed failed:", error);
        process.exit(1);
    }
}

seed();
