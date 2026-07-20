const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.static(path.join(__dirname, 'public')));

app.get('/host', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'host.html'));
});

const questions = [
    {
        id: 1,
        answers: ["หนุมาน"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Hanuman_at_Wat_Phra_Kaew.jpg/400px-Hanuman_at_Wat_Phra_Kaew.jpg",
        hint: "กายาสีขาว หาวเป็นดาวเป็นเดือน"
    },
    {
        id: 2,
        answers: ["ขุนแผน", "พลายแก้ว"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Khun_Phaen_Mural.jpg/400px-Khun_Phaen_Mural.jpg",
        hint: "ขี่ม้าสีหมอก ถือดาบฟ้าฟื้น"
    },
    {
        id: 3,
        answers: "สุดสาคร",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Sudsakorn_painting.jpg/400px-Sudsakorn_painting.jpg",
        hint: "ที่สุดในทะเล เจ้าของสัตว์มากเลห์นิลมังกร"
    },
    {
        id: 4,
        answers: "พระราม",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Hanuman_at_Wat_Phra_Kaew.jpg/400px-Hanuman_at_Wat_Phra_Kaew.jpg",
        hint: "นารายณ์อวตาร"
    },
    {
        id: 5,
        answers: "มัทนา",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Hanuman_at_Wat_Phra_Kaew.jpg/400px-Hanuman_at_Wat_Phra_Kaew.jpg",
        hint: "ตำนานรักดอกกุหลาบ"
    },
    {
        id: 6,
        answers: "วันทอง",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Hanuman_at_Wat_Phra_Kaew.jpg/400px-Hanuman_at_Wat_Phra_Kaew.jpg",
        hint: "หญิงงามแห่งสุพรรณบุรี ชื่อเก่าคือพิมพิลาไลย"
    },
    {
        id: 7,
        answers: "ม้านิลมังกร",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Hanuman_at_Wat_Phra_Kaew.jpg/400px-Hanuman_at_Wat_Phra_Kaew.jpg",
        hint: "เขี้ยวเป็นเพชร เกล็ดเป็นนิล ลิ้นเป็นปาน"
    },
    {
        id: 8,
        answers: "ไกรทอง",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Hanuman_at_Wat_Phra_Kaew.jpg/400px-Hanuman_at_Wat_Phra_Kaew.jpg",
        hint: "ผู้ปราบจระเข้"
    },
    {
        id: 9,
        answers: "พระอภัยมณี",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Hanuman_at_Wat_Phra_Kaew.jpg/400px-Hanuman_at_Wat_Phra_Kaew.jpg",
        hint: "Sorry Monk"
    },
    {
        id: 10,
        answers: "ปลาบู่ทอง",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Hanuman_at_Wat_Phra_Kaew.jpg/400px-Hanuman_at_Wat_Phra_Kaew.jpg",
        hint: "ตายไม่จริง สิงร่างปลา โดนฆ่าแกง"
    },
    {
        id: 11,
        answers: "พระลอ",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Hanuman_at_Wat_Phra_Kaew.jpg/400px-Hanuman_at_Wat_Phra_Kaew.jpg",
        hint: "คนหล่อตามไก่"
    },
    {
        id: 12,
        answers: "สีดา",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Hanuman_at_Wat_Phra_Kaew.jpg/400px-Hanuman_at_Wat_Phra_Kaew.jpg",
        hint: "ต้นฉบับการลุยไฟ"
    },
    {
        id: 13,
        answers: "ช้างเอราวัณ",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Hanuman_at_Wat_Phra_Kaew.jpg/400px-Hanuman_at_Wat_Phra_Kaew.jpg",
        hint: "สัตว์สี่ขา แต่ว่ามี 33 หัว"
    },
    {
        id: 14,
        answers: "บุษบา",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Hanuman_at_Wat_Phra_Kaew.jpg/400px-Hanuman_at_Wat_Phra_Kaew.jpg",
        hint: "หญิงงามผู้เสี่ยงเทียนเลือกคู่"
    },
    {
        id: 15,
        answers: "นนทก",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Hanuman_at_Wat_Phra_Kaew.jpg/400px-Hanuman_at_Wat_Phra_Kaew.jpg",
        hint: "นิ้วเพชร"
    },
    {
        id: 16,
        answers: "อิเหนา",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Hanuman_at_Wat_Phra_Kaew.jpg/400px-Hanuman_at_Wat_Phra_Kaew.jpg",
        hint: "ว่าแต่เขา...เป็นเอง"
    },
    {
        id: 17,
        answers: "ขุนช้าง",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Hanuman_at_Wat_Phra_Kaew.jpg/400px-Hanuman_at_Wat_Phra_Kaew.jpg",
        hint: "เมียเขาเรารัก"
    },
    {
        id: 18,
        answers: ["พลายงาม", "จมื่นไวย"], 
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Hanuman_at_Wat_Phra_Kaew.jpg/400px-Hanuman_at_Wat_Phra_Kaew.jpg",
        hint: "เหมือนพ่อ"
    },
    {
        id: 19,
        answers: "ไมยราพ", 
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Hanuman_at_Wat_Phra_Kaew.jpg/400px-Hanuman_at_Wat_Phra_Kaew.jpg",
        hint: "ถอดดวงใจเป็นแมลงภู่"
    },
    {
        id: 20,
        answers: ["พระเพื่อน พระแพง", "พระเพื่อนพระแพง"], 
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Hanuman_at_Wat_Phra_Kaew.jpg/400px-Hanuman_at_Wat_Phra_Kaew.jpg",
        hint: "เหมือนพ่อ"
    }
];

let currentQuestionIndex = 0;
let players = {};
let correctCount = 0;
let prevRankingsSnapshot = [];

// ⏱️ ตัวแปรระบบเวลา
let timeLeft = 30;
let timerInterval = null;

function getSortedPlayers() {
    return Object.entries(players)
        .map(([id, p]) => ({ id, name: p.name, score: p.score, prevRank: p.prevRank || 999 }))
        .sort((a, b) => b.score - a.score);
}

function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 30; // รีเซ็ตเวลาเริ่มต้นที่ 30 วินาที
    io.emit('timerUpdate', timeLeft);

    timerInterval = setInterval(() => {
        timeLeft--;
        io.emit('timerUpdate', timeLeft);

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            revealAnswerLogic(); // หมดเวลาเฉลยให้อัตโนมัติ
        }
    }, 1000);
}

function revealAnswerLogic() {
    clearInterval(timerInterval);
    const qData = questions[currentQuestionIndex];
    const revealedText = qData.answers.join(" หรือ ");
    io.emit('answerRevealed', revealedText);
    currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
}

io.on('connection', (socket) => {
    socket.on('joinGame', (data) => {
        players[socket.id] = { name: data.playerName, score: 0, answered: false, prevRank: 999 };
        io.emit('updatePlayerCount', Object.keys(players).length);
        broadcastLeaderboard();
    });

    socket.on('startNextQuestion', () => {
        correctCount = 0;
        
        const sorted = getSortedPlayers();
        prevRankingsSnapshot = [...sorted];
        sorted.forEach((p, idx) => {
            if (players[p.id]) players[p.id].prevRank = idx + 1;
        });

        Object.keys(players).forEach(id => players[id].answered = false);

        const qData = questions[currentQuestionIndex];
        const charBoxesCount = Array.from(qData.answers[0]).length;
        
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

        startTimer(); // เริ่มนับถอยหลังทันทีเมื่อเริ่มข้อใหม่
    });

    // ➕ ปุ่มโฮสต์กดเพิ่มเวลา
    socket.on('addTime', (seconds) => {
        timeLeft += seconds;
        io.emit('timerUpdate', timeLeft);
    });

    socket.on('revealTile', (tileIndex) => {
        io.emit('tileRevealed', tileIndex);
    });

    socket.on('showAnswer', () => {
        revealAnswerLogic();
    });

    socket.on('submitAnswer', (data) => {
        const player = players[socket.id];
        if (!player || player.answered) return;

        player.answered = true;
        const currentQ = questions[currentQuestionIndex];
        const isCorrect = currentQ.answers.includes(data.answer.trim());

        let scoreGained = 0;
        let effect = { text: "🎯 คะแนนปกติ", color: "#38bdf8", type: "normal" };

        if (isCorrect) {
            correctCount++;
            const baseScore = Math.max(100, 1000 - (data.timeUsed * 20));
            
            const rand = Math.random() * 100;
            if (rand < 15) {
                effect = { text: "🔥 Critical x2!", color: "#f87171", type: "crit" };
                scoreGained = baseScore * 2;
            } else if (rand < 35) {
                effect = { text: "⚡ Super Speed x1.5!", color: "#fbbf24", type: "speed" };
                scoreGained = Math.floor(baseScore * 1.5);
            } else if (rand < 50) {
                effect = { text: "🎁 Lucky Bonus +300!", color: "#c084fc", type: "bonus" };
                scoreGained = baseScore + 300;
            } else {
                scoreGained = baseScore;
            }

            player.score += scoreGained;
            io.emit('updateCorrectCount', correctCount);
        } else {
            const rand = Math.random() * 100;
            if (rand < 25) {
                effect = { text: "💣 เจอระเบิด -100!", color: "#ef4444", type: "trap" };
                scoreGained = -100;
                player.score = Math.max(0, player.score + scoreGained);
            }
        }

        const updatedSorted = getSortedPlayers();
        const newRankIndex = updatedSorted.findIndex(p => p.id === socket.id);
        const newRank = newRankIndex + 1;
        const oldRank = player.prevRank || updatedSorted.length;

        let passedPlayerName = null;
        if (newRank < oldRank) {
            const surpassedPlayer = prevRankingsSnapshot[newRankIndex];
            if (surpassedPlayer && surpassedPlayer.id !== socket.id) {
                passedPlayerName = surpassedPlayer.name;
            }
        }

        socket.emit('answerResult', {
            correct: isCorrect,
            scoreGained: scoreGained,
            currentScore: player.score,
            rank: newRank,
            oldRank: oldRank,
            rankUp: oldRank - newRank,
            passedPlayer: passedPlayerName,
            effect: effect
        });

        broadcastLeaderboard();
    });

    socket.on('disconnect', () => {
        delete players[socket.id];
        io.emit('updatePlayerCount', Object.keys(players).length);
        broadcastLeaderboard();
    });
});

function broadcastLeaderboard() {
    const topPlayers = Object.values(players).sort((a, b) => b.score - a.score).slice(0, 10);
    io.emit('updateLeaderboard', topPlayers);
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
