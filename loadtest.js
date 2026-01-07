// loadtest.js
// 1. IMPORT SUPABASE (Works in Node.js)
const { createClient } = require('@supabase/supabase-js');

// ⚠️ CONFIGURATION: PASTE YOUR KEY HERE
const SUPABASE_URL = "https://ndkwlfyqbbkohhccsijm.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ka3dsZnlxYmJrb2hoY2NzaWptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MDc1OTcsImV4cCI6MjA4MzI4MzU5N30.r5vOKPTc65gyoesWuiiT_slt2ldlEX6K0D2bbdS1nZI"; 

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const TOTAL_BOTS = 100; // 100 Concurrent Users

async function runTest() {
    console.log(`🚀 Spawning ${TOTAL_BOTS} Bots...`);

    // 1. Create 100 Bot Users
    const bots = [];
    for (let i = 0; i < TOTAL_BOTS; i++) {
        bots.push({ name: `Bot_${i+1}`, id: null });
    }

    // 2. Register them in the Database (Simulate Joining)
    console.log("📝 Bots are joining the game...");
    // We do this in batches to simulate realistic joining
    const joinPromises = bots.map(async (bot) => {
        const { data, error } = await supabase.from('players').insert([{ name: bot.name }]).select();
        if (data) bot.id = data[0].id;
        if (error) console.error("Join Error:", error.message);
    });
    
    await Promise.all(joinPromises);
    console.log("✅ All 100 Bots are IN and waiting!");

    // 3. Listen for "New Question" signal
    supabase.channel('public:game_state')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'game_state' }, 
            async (payload) => {
                const state = payload.new;
                
                // Only react if status changes to 'active'
                if (state.status === 'active') {
                    console.log(`\n🔔 Question ${state.current_question_id} is LIVE! Bots answering...`);
                    
                    // Fetch Question Details (to know the answer)
                    const { data: q } = await supabase.from('questions').select('*').eq('id', state.current_question_id).single();

                    // 4. Simulate 100 people clicking "Answer"
                    const answerPromises = bots.map(async (bot) => {
                        if (!bot.id) return;

                        // Add small random "Human Reaction Time" (0-2 seconds)
                        const reactionTime = Math.floor(Math.random() * 2000); 
                        await new Promise(r => setTimeout(r, reactionTime));

                        // 80% chance they get it right
                        const isCorrect = Math.random() > 0.2; 
                        
                        if (isCorrect) {
                            // Try to claim Fastest Finger
                            await supabase.from('questions')
                                .update({ fastest_player_id: bot.id })
                                .eq('id', q.id)
                                .is('fastest_player_id', null);

                            // Update Score
                            await supabase.from('players').update({ 
                                score: 10, 
                                last_answer_time: new Date().toISOString(),
                                last_answered_q_id: q.id 
                            }).eq('id', bot.id);
                        }
                    });

                    await Promise.all(answerPromises);
                    console.log("⚡ Answers Submitted!");
                }
            }
        ).subscribe();

    console.log("👀 Listening... GO TO YOUR ADMIN PANEL AND CLICK 'NEXT QUESTION'");
}

runTest();