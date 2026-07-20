const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

// ให้บริการไฟล์ Static จากโฟลเดอร์ public
app.use(express.static(path.join(__dirname, 'public')));

// เส้นทางสำหรับเปิดหน้าจอครู (Host)
app.get('/host', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'host.html'));
});

// --- คลังโจทย์คำถาม ---
const questions = [
    {
        id: 1,
        answer: "หนุมาน",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Hanuman_at_Wat_Phra_Kaew.jpg/400px-Hanuman_at_Wat_Phra_Kaew.jpg",
        hint: "มีพาหนะเป็นม้าสีขาว (เผือก) หาวเป็นดาวเป็นเดือน"
    },
    {
        id: 2,
        answer: "ขุนแผน",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Khun_Phaen_Mural.jpg/400px-Khun_Phaen_Mural.jpg",
        hint: "ขี่ม้าสีหมอก ถือดาบฟ้าฟื้น"
    },
    {
        id: 3,
        answer: "สุดสาคร",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Sudsakorn_painting.jpg/400px-Sudsakorn_painting.jpg",
        hint: "ลูกนางเงือก ขี่ม้านิลมังกร"
    }
];

let currentQuestionIndex = 0;
let players = {};
let correctCount = 0;

// --- ระบบ Real-time Socket.io ---
io.on('connection', (socket) => {
    // นักเรียนลงชื่อเข้าร่วม
    socket.on('joinGame', (data) => {
        players[socket.id] = {
            name: data.playerName,
            score: 0,
            answered: false
        };
        io.emit('updatePlayerCount', Object.keys(players).length);
        broadcastLeaderboard();
    });

    // ครูสั่งเริ่มข้อสอบ/ข้อถัดไป
    socket.on('startNextQuestion', () => {
        correctCount = 0;
        Object.keys(players).forEach(id => {
            players[id].answered = false;
        });

        const qData = questions[currentQuestionIndex];
        
        io.emit('loadQuestionHost', {
            qIndex: currentQuestionIndex + 1,
            totalQ: questions.length,
            image: qData.image,
            hint: qData.hint,
            answer: qData.answer
        });

        io.emit('loadQuestionPlayer', {
            qIndex: currentQuestionIndex + 1
        });

        currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
    });

    // ครูสั่งเปิดแผ่นป้าย
    socket.on('revealTile', (tileIndex) => {
        io.emit('tileRevealed', tileIndex);
    });

    // นักเรียนส่งคำตอบ
    socket.on('submitAnswer', (data) => {
        const player = players[socket.id];
        if (!player || player.answered) return;

        player.answered = true;
        const currentQ = questions[(currentQuestionIndex - 1 + questions.length) % questions.length];

        if (data.answer.trim() === currentQ.answer) {
            correctCount++;
            const scoreGained = Math.max(100, 1000 - (data.timeUsed * 20));
            player.score += scoreGained;

            socket.emit('answerResult', { correct: true, scoreGained: scoreGained, currentScore: player.score });
            io.emit('updateCorrectCount', correctCount);
            broadcastLeaderboard();
        } else {
            socket.emit('answerResult', { correct: false, currentScore: player.score });
        }
    });

    socket.on('disconnect', () => {
        delete players[socket.id];
        io.emit('updatePlayerCount', Object.keys(players).length);
        broadcastLeaderboard();
    });
});

function broadcastLeaderboard() {
    const topPlayers = Object.values(players)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
    io.emit('updateLeaderboard', topPlayers);
}

// รองรับ PORT จาก Environment ของ Render.com
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});