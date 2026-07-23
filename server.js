cconst express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

// 📌 สามารถเพิ่มข้อสอบได้ตามต้องการ (เช่น 20 ข้อ)
const questions = [
    {
        id: 1,
        answers: ["หนุมาน"],
        image: "/images/1.jpg",
        hint: "กายาสีขาว หาวเป็นดาวเป็นเดือน"
    },
    {
        id: 2,
        answers: ["ขุนแผน", "พลายแก้ว"],
        image: "/images/2.jpg",
        hint: "ขี่ม้าสีหมอก ถือดาบฟ้าฟื้น"
    },
    {
        id: 3,
        answers: ["สุดสาคร"],
        image: "/images/3.jpg",
        hint: "ที่สุดในทะเล เจ้าของสัตว์มากเลห์นิลมังกร"
    },
    {
        id: 4,
        answers: ["พระราม"],
        image: "/images/4.jpg",
        hint: "นารายณ์อวตาร"
    },
    {
        id: 5,
        answers: ["มัทนา"],
        image: "/images/5.jpg",
        hint: "ตำนานรักดอกกุหลาบ"
    },
    {
        id: 6,
        answers: ["วันทอง"],
        image: "/images/6.jpg",
        hint: "หญิงงามแห่งสุพรรณบุรี ชื่อเก่าคือพิมพิลาไลย"
    },
    {
        id: 7,
        answers: ["ม้านิลมังกร"],
        image: "/images/7.jpg",
        hint: "เขี้ยวเป็นเพชร เกล็ดเป็นนิล ลิ้นเป็นปาน"
    },
    {
        id: 8,
        answers: ["ไกรทอง"],
        image: "/images/8.jpg",
        hint: "ผู้ปราบจระเข้"
    },
    {
        id: 9,
        answers: ["พระอภัยมณี"],
        image: "/images/9.jpg",
        hint: "Sorry Monk"
    },
    {
        id: 10,
        answers: ["ปลาบู่ทอง"],
        image: "/images/10.jpg",
        hint: "ตายไม่จริง สิงร่างปลา โดนฆ่าแกง"
    },
    {
        id: 11,
        answers: ["พระลอ"],
        image: "/images/11.JPG",
        hint: "คนหล่อตามไก่"
    },
    {
        id: 12,
        answers: ["สีดา"],
        image: "/images/12.jpg",
        hint: "ต้นฉบับการลุยไฟ"
    },
    {
        id: 13,
        answers: ["ช้างเอราวัณ"],
        image: "/images/13.jpg",
        hint: "สัตว์สี่ขา แต่ว่ามี 33 หัว"
    },
    {
        id: 14,
        answers: ["บุษบา"],
        image: "/images/14.png",
        hint: "หญิงงามผู้เสี่ยงเทียนเลือกคู่"
    },
    {
        id: 15,
        answers: ["นนทก"],
        image: "/images/15.jpg",
        hint: "นิ้วเพชร"
    },
    {
        id: 16,
        answers: ["อิเหนา"],
        image: "/images/16.jpg",
        hint: "ว่าแต่เขา...เป็นเอง"
    },
    {
        id: 17,
        answers: ["ขุนช้าง"],
        image: "/images/17.jpg",
        hint: "เมียเขาเรารัก"
    },
    {
        id: 18,
        answers: ["พลายงาม", "จมื่นไวย"], 
        image: "/images/18.jpg",
        hint: "เหมือนพ่อ"
    },
    {
        id: 19,
        answers: ["ไมยราพ"], 
        image: "/images/19.jpg",
        hint: "ถอดดวงใจเป็นแมลงภู่"
    },
    {
        id: 20,
        answers: ["พระเพื่อน พระแพง", "พระเพื่อนพระแพง"], 
        image: "/images/20.jpeg",
        hint: "แฝดที่ ลอ เธอคนเดียว"
    }
];

// 📌 2. สถานะของเกม (Game State)
let players = {}; // { socketId: { name, score, rank, prevRank, answered } }
let currentQuestionIndex = -1;
let timer = null;
let tileInterval = null;
let timeLeft = 30;
let revealedTiles = [];
let correctCount = 0;
let prevRankingsSnapshot = [];

// 📌 ฟังก์ชันนับกล่องพยัญชนะไทย (รวบสระบน-ล่าง/วรรณยุกต์ ไม่ให้กล่องเพี้ยน)
function countThaiGraphemes(text) {
    if (!text) return 0;
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
        const segmenter = new Intl.Segmenter('th', { granularity: 'grapheme' });
        return [...segmenter.segment(text)].length;
    }
    return Array.from(text).length;
}

// 📌 ฟังก์ชันจัดอันดับผู้เล่น
function getSortedPlayers() {
    return Object.keys(players)
        .map(id => ({ id, name: players[id].name, score: players[id].score }))
        .sort((a, b) => b.score - a.score);
}

// 📌 ฟังก์ชันส่งตารางคะแนนเรียลไทม์
function broadcastLeaderboard() {
    const sorted = getSortedPlayers();
    io.emit('updateLeaderboard', sorted);
}

// 📌 ฟังก์ชันเริ่มนับถอยหลัง
function startTimer() {
    clearInterval(timer);
    timeLeft = 30;
    io.emit('timerUpdate', timeLeft);

    timer = setInterval(() => {
        timeLeft--;
        io.emit('timerUpdate', timeLeft);

        if (timeLeft <= 0) {
            clearInterval(timer);
            clearInterval(tileInterval);
            revealAnswerAuto();
        }
    }, 1000);
}

// 📌 ฟังก์ชันสุ่มเปิดแผ่นป้ายอัตโนมัติ
function startAutoTileReveal() {
    clearInterval(tileInterval);
    revealedTiles = [];

    tileInterval = setInterval(() => {
        if (revealedTiles.length < 16) {
            let unrevealed = [];
            for (let i = 0; i < 16; i++) {
                if (!revealedTiles.includes(i)) unrevealed.push(i);
            }
            if (unrevealed.length > 0) {
                const randomIndex = unrevealed[Math.floor(Math.random() * unrevealed.length)];
                revealedTiles.push(randomIndex);
                io.emit('tileRevealed', randomIndex);
            }
        } else {
            clearInterval(tileInterval);
        }
    }, 2500);
}

// 📌 เฉลยคำตอบอัตโนมัติเมื่อหมดเวลา
function revealAnswerAuto() {
    if (currentQuestionIndex >= 0 && currentQuestionIndex < questions.length) {
        const qData = questions[currentQuestionIndex];
        const answers = Array.isArray(qData.answers) ? qData.answers : [qData.answers];
        io.emit('answerRevealed', { answerText: answers[0] });
    }
}

// 📌 3. SOCKET.IO EVENTS
io.on('connection', (socket) => {

    // ผู้เล่นเข้าร่วมเกม
    socket.on('joinGame', (data) => {
        players[socket.id] = {
            name: data.playerName,
            score: 0,
            prevRank: 0,
            answered: false
        };

        const sortedNames = Object.values(players).map(p => p.name);
        io.emit('updateLobbyPlayers', sortedNames);
        io.emit('updatePlayerCount', Object.keys(players).length);
        broadcastLeaderboard();
    });

    // โฮสต์สั่งเริ่มเกม (ย้ายจาก Lobby ไป Board)
    socket.on('startGameSession', () => {
        io.emit('gameStarted');
    });

    // โฮสต์กดเริ่มข้อถัดไป
    socket.on('startNextQuestion', () => {
        if (currentQuestionIndex + 1 >= questions.length) {
            // จบเกม
            clearInterval(timer);
            clearInterval(tileInterval);
            const top5 = getSortedPlayers().slice(0, 5);
            io.emit('gameEnded', { top5: top5 });
            return;
        }

        currentQuestionIndex++;
        correctCount = 0;

        // บันทึกอันดับก่อนหน้าไว้คำนวณการแซงคะแนน
        const sorted = getSortedPlayers();
        prevRankingsSnapshot = [...sorted];
        sorted.forEach((p, idx) => {
            if (players[p.id]) players[p.id].prevRank = idx + 1;
        });

        // รีเซ็ตสถานะการตอบของผู้เล่น
        Object.keys(players).forEach(id => players[id].answered = false);

        const qData = questions[currentQuestionIndex];
        const answerList = Array.isArray(qData.answers) ? qData.answers : [qData.answers];
        const primaryAnswer = answerList[0] || "";
        
        // คำนวณจำนวนกล่องด้วย Intl.Segmenter
        const charBoxesCount = countThaiGraphemes(primaryAnswer);

        io.emit('loadQuestionHost', {
            qIndex: currentQuestionIndex + 1,
            totalQ: questions.length,
            image: qData.image,
            hint: qData.hint
        });

        io.emit('loadQuestionPlayer', {
            qIndex: currentQuestionIndex + 1,
            boxesCount: charBoxesCount
        });

        startTimer();
        startAutoTileReveal();
    });

    // โฮสต์เปิดแผ่นป้าย
    socket.on('revealTile', (tileIndex) => {
        if (!revealedTiles.includes(tileIndex)) {
            revealedTiles.push(tileIndex);
            io.emit('tileRevealed', tileIndex);
        }
    });

    // โฮสต์เพิ่มเวลา
    socket.on('addTime', (sec) => {
        timeLeft += sec;
        io.emit('timerUpdate', timeLeft);
    });

    // โฮสต์กดเฉลยคำตอบ
    socket.on('showAnswer', () => {
        clearInterval(timer);
        clearInterval(tileInterval);
        revealAnswerAuto();
    });

    // ผู้เล่นส่งคำตอบ
    socket.on('submitAnswer', (data) => {
        const player = players[socket.id];
        if (!player || player.answered || currentQuestionIndex < 0) return;

        player.answered = true;
        const qData = questions[currentQuestionIndex];
        const validAnswers = Array.isArray(qData.answers) ? qData.answers : [qData.answers];
        
        // ตรวจสอบคำตอบแบบไม่สนช่องว่าง
        const userAnsClean = data.answer.replace(/\s+/g, '').toLowerCase();
        const isCorrect = validAnswers.some(ans => ans.replace(/\s+/g, '').toLowerCase() === userAnsClean);

        let scoreGained = 0;
        let effect = { type: 'normal', text: 'ตอบถูก', color: '#10b981' };

        if (isCorrect) {
            correctCount++;
            let baseScore = 100;
            
            // โบนัสความเร็ว
            let speedBonus = Math.max(0, timeLeft * 2);
            scoreGained = baseScore + speedBonus;

            // คริติคอลสำหรับคนตอบถูกคนแรก
            if (correctCount === 1) {
                scoreGained += 50;
                effect = { type: 'crit', text: '⚡ FASTEST! คนแรก +50 pt', color: '#facc15' };
            } else if (speedBonus > 30) {
                effect = { type: 'bonus', text: '🔥 SPEED BONUS! ตอบไว', color: '#38bdf8' };
            }

            player.score += scoreGained;
        } else {
            scoreGained = 0;
            effect = { type: 'wrong', text: '❌ ตอบผิด', color: '#f87171' };
        }

        // คำนวณอันดับใหม่และการแซง
        const currentSorted = getSortedPlayers();
        const newRank = currentSorted.findIndex(p => p.id === socket.id) + 1;
        const rankUp = player.prevRank > 0 ? player.prevRank - newRank : 0;

        let passedPlayerName = null;
        if (rankUp > 0 && prevRankingsSnapshot.length >= newRank) {
            const passedPlayerObj = prevRankingsSnapshot[newRank - 1];
            if (passedPlayerObj && passedPlayerObj.id !== socket.id) {
                passedPlayerName = passedPlayerObj.name;
            }
        }

        socket.emit('answerResult', {
            correct: isCorrect,
            scoreGained: scoreGained,
            currentScore: player.score,
            rank: newRank,
            rankUp: Math.max(0, rankUp),
            passedPlayer: passedPlayerName,
            effect: effect
        });

        broadcastLeaderboard();
    });

    // ผู้เล่นออกจากระบบ
    socket.on('disconnect', () => {
        delete players[socket.id];
        io.emit('updatePlayerCount', Object.keys(players).length);
        io.emit('updateLobbyPlayers', Object.values(players).map(p => p.name));
        broadcastLeaderboard();
    });
});

// 📌 4. เริ่มต้นเซิร์ฟเวอร์ที่ Port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`=================================`);
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Host Screen: http://localhost:${PORT}/host.html`);
    console.log(`🎮 Player Screen: http://localhost:${PORT}`);
    console.log(`=================================`);
});

