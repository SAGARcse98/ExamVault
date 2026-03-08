// Database seed script — creates admin user and sample data
// Run: node src/scripts/seed.mjs

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = 'mongodb://sagucdac_db_user:ExamVault@ac-ttble8c-shard-00-00.jx1mwrh.mongodb.net:27017,ac-ttble8c-shard-00-01.jx1mwrh.mongodb.net:27017,ac-ttble8c-shard-00-02.jx1mwrh.mongodb.net:27017/ExamVault?ssl=true&replicaSet=atlas-j4ze51-shard-0&authSource=admin&appName=Cluster0';

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const db = mongoose.connection.db;

        // 1. Create Admin User
        const hashedPassword = await bcrypt.hash('admin123', 12);
        const existingAdmin = await db.collection('users').findOne({ email: 'admin@examvault.com' });

        if (!existingAdmin) {
            await db.collection('users').insertOne({
                name: 'Admin',
                email: 'admin@examvault.com',
                password: hashedPassword,
                role: 'admin',
                favorites: [],
                watchedVideos: [],
                createdAt: new Date(),
            });
            console.log('✅ Admin user created: admin@examvault.com / admin123');
        } else {
            console.log('ℹ️  Admin user already exists');
        }

        // 2. Create Sample Subjects
        const subjects = [
            { name: 'Quantitative Aptitude', slug: 'quantitative-aptitude', icon: '📐', description: 'Numbers, algebra, geometry, and data interpretation', order: 1 },
            { name: 'Reasoning Ability', slug: 'reasoning-ability', icon: '🧩', description: 'Logical, verbal, and analytical reasoning', order: 2 },
            { name: 'English Language', slug: 'english-language', icon: '📝', description: 'Grammar, vocabulary, comprehension, and writing', order: 3 },
            { name: 'General Awareness', slug: 'general-awareness', icon: '🌍', description: 'Current affairs, banking awareness, and static GK', order: 4 },
            { name: 'Computer Knowledge', slug: 'computer-knowledge', icon: '💻', description: 'Basic computing, MS Office, networking, and security', order: 5 },
        ];

        for (const subject of subjects) {
            const existing = await db.collection('subjects').findOne({ slug: subject.slug });
            if (!existing) {
                await db.collection('subjects').insertOne({ ...subject, createdAt: new Date() });
                console.log(`✅ Subject created: ${subject.name}`);
            }
        }

        // 3. Create Sample Topics
        const subjectDocs = await db.collection('subjects').find().toArray();
        const subjectMap = Object.fromEntries(subjectDocs.map(s => [s.slug, s._id]));

        const topicsBySubject = {
            'quantitative-aptitude': [
                { name: 'Number System', slug: 'number-system' },
                { name: 'Percentage', slug: 'percentage' },
                { name: 'Profit & Loss', slug: 'profit-loss' },
                { name: 'Simple & Compound Interest', slug: 'simple-compound-interest' },
                { name: 'Ratio & Proportion', slug: 'ratio-proportion' },
                { name: 'Time & Work', slug: 'time-work' },
                { name: 'Speed, Time & Distance', slug: 'speed-time-distance' },
            ],
            'reasoning-ability': [
                { name: 'Syllogism', slug: 'syllogism' },
                { name: 'Coding-Decoding', slug: 'coding-decoding' },
                { name: 'Blood Relations', slug: 'blood-relations' },
                { name: 'Seating Arrangement', slug: 'seating-arrangement' },
                { name: 'Puzzles', slug: 'puzzles' },
            ],
            'english-language': [
                { name: 'Reading Comprehension', slug: 'reading-comprehension' },
                { name: 'Error Spotting', slug: 'error-spotting' },
                { name: 'Fill in the Blanks', slug: 'fill-in-the-blanks' },
                { name: 'Cloze Test', slug: 'cloze-test' },
            ],
            'general-awareness': [
                { name: 'Current Affairs', slug: 'current-affairs' },
                { name: 'Banking Awareness', slug: 'banking-awareness' },
                { name: 'Static GK', slug: 'static-gk' },
            ],
            'computer-knowledge': [
                { name: 'Computer Basics', slug: 'computer-basics' },
                { name: 'MS Office', slug: 'ms-office' },
                { name: 'Networking', slug: 'networking' },
            ],
        };

        for (const [subjectSlug, topics] of Object.entries(topicsBySubject)) {
            const subjectId = subjectMap[subjectSlug];
            if (!subjectId) continue;
            for (const topic of topics) {
                const existing = await db.collection('topics').findOne({ subjectId, slug: topic.slug });
                if (!existing) {
                    await db.collection('topics').insertOne({ ...topic, subjectId, createdAt: new Date() });
                }
            }
            console.log(`✅ Topics created for: ${subjectSlug}`);
        }

        // 4. Create Sample Formulas
        const quantId = subjectMap['quantitative-aptitude'];
        const quantTopics = await db.collection('topics').find({ subjectId: quantId }).toArray();
        const percentageTopic = quantTopics.find(t => t.slug === 'percentage');
        const profitLossTopic = quantTopics.find(t => t.slug === 'profit-loss');
        const siCiTopic = quantTopics.find(t => t.slug === 'simple-compound-interest');

        if (percentageTopic) {
            const existing = await db.collection('formulas').findOne({ title: 'Percentage Basics' });
            if (!existing) {
                await db.collection('formulas').insertMany([
                    {
                        title: 'Percentage Basics',
                        content: `x% of y = (x × y) / 100\n\nPercentage Change = [(New - Old) / Old] × 100\n\nIf A is x% more than B:\nA = B × (1 + x/100)\n\nIf A is x% less than B:\nA = B × (1 - x/100)\n\n⚡ Trick: x% of y = y% of x\nExample: 25% of 40 = 40% of 25 = 10`,
                        subjectId: quantId,
                        topicId: percentageTopic._id,
                        tags: ['percentage', 'basics', 'shortcut'],
                        createdAt: new Date(),
                    },
                    {
                        title: 'Successive Percentage Change',
                        content: `If two successive changes of a% and b%:\nNet change = a + b + (ab/100) %\n\n⚡ Quick trick:\nFor 10% + 10% → Net = 21%\nFor 20% + 20% → Net = 44%\nFor -10% + -10% → Net = -19%`,
                        subjectId: quantId,
                        topicId: percentageTopic._id,
                        tags: ['percentage', 'successive', 'trick'],
                        createdAt: new Date(),
                    },
                ]);
                console.log('✅ Sample formulas created');
            }
        }

        if (profitLossTopic) {
            const existing = await db.collection('formulas').findOne({ title: 'Profit & Loss Formulas' });
            if (!existing) {
                await db.collection('formulas').insertOne({
                    title: 'Profit & Loss Formulas',
                    content: `Profit = SP - CP\nLoss = CP - SP\nProfit% = (Profit/CP) × 100\nLoss% = (Loss/CP) × 100\n\nSP = CP × (100 + P%) / 100\nSP = CP × (100 - L%) / 100\n\n⚡ Discount:\nDiscount = MP - SP\nDiscount% = (Discount/MP) × 100`,
                    subjectId: quantId,
                    topicId: profitLossTopic._id,
                    tags: ['profit', 'loss', 'discount'],
                    createdAt: new Date(),
                });
            }
        }

        if (siCiTopic) {
            const existing = await db.collection('formulas').findOne({ title: 'Simple & Compound Interest' });
            if (!existing) {
                await db.collection('formulas').insertOne({
                    title: 'Simple & Compound Interest',
                    content: `SI = (P × R × T) / 100\nAmount = P + SI\n\nCI = P × [(1 + R/100)^T - 1]\nAmount = P × (1 + R/100)^T\n\n⚡ Diff between CI and SI for 2 years:\nCI - SI = P × (R/100)²`,
                    subjectId: quantId,
                    topicId: siCiTopic._id,
                    tags: ['interest', 'SI', 'CI', 'formula'],
                    createdAt: new Date(),
                });
            }
        }

        console.log('\n🎉 Seed complete! You can now login with:');
        console.log('   Email: admin@examvault.com');
        console.log('   Password: admin123');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
}

seed();
