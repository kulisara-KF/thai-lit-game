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
        answer: "หนุมาน",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Hanuman_at_Wat_Phra_Kaew.jpg/400px-Hanuman_at_Wat_Phra_Kaew.jpg",
        hint: "กายาสีขาว หาวเป็นดาวเป็นเดือน"
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
        hint: "ที่สุดในทะเล เจ้าของสัตว์มากเลห์นิลมังกร"
    },
    {
        id: 4,
        answer: "พระราม",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Hanuman_at_Wat_Phra_Kaew.jpg/400px-Hanuman_at_Wat_Phra_Kaew.jpg",
        hint: "นารายณ์อวตาร"
    },
    {
        id: 5,
        answer: "มัทนา",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Hanuman_at_Wat_Phra_Kaew.jpg/400px-Hanuman_at_Wat_Phra_Kaew.jpg",
        hint: "ตำนานรักดอกกุหลาบ"
    },
    {
        id: 6,
        answer: "วันทอง",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Hanuman_at_Wat_Phra_Kaew.jpg/400px-Hanuman_at_Wat_Phra_Kaew.jpg",
        hint: "หญิงงามแห่งสุพรรณบุรี ชื่อเก่าคือพิมพิลาไลย"
    },
    {
        id: 7,
        answer: "ม้านิลมังกร",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Hanuman_at_Wat_Phra_Kaew.jpg/400px-Hanuman_at_Wat_Phra_Kaew.jpg",
        hint: "เขี้ยวเป็นเพชร เกล็ดเป็นนิล ลิ้นเป็นปาน"
    },
    {
        id: 8,
        answer: "ไกรทอง",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Hanuman_at_Wat_Phra_Kaew.jpg/400px-Hanuman_at_Wat_Phra_Kaew.jpg",
        hint: "ผู้ปราบจระเข้"
    },
    {
        id: 9,
        answer: "พระอภัยมณี",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Hanuman_at_Wat_Phra_Kaew.jpg/400px-Hanuman_at_Wat_Phra_Kaew.jpg",
        hint: "Sorry Monk"
    },
    {
        id: 10,
        answer: "ปลาบู่ทอง",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Hanuman_at_Wat_Phra_Kaew.jpg/400px-Hanuman_at_Wat_Phra_Kaew.jpg",
        hint: "ตายไม่จริง สิงร่างปลา โดนฆ่าแกง"
    },
    {
        id: 11,
        answer: "พระลอ",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Hanuman_at_Wat_Phra_Kaew.jpg/400px-Hanuman_at_Wat_Phra_Kaew.jpg",
        hint: "คนหล่อตามไก่"
    },
    {
        id: 12,
        answer: "สีดา",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Hanuman_at_Wat_Phra_Kaew.jpg/400px-Hanuman_at_Wat_Phra_Kaew.jpg",
        hint: "ต้นฉบับการลุยไฟ"
    },
    {
        id: 13,
        answer: "ช้างเอราวัณ",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Hanuman_at_Wat_Phra_Kaew.jpg/400px-Hanuman_at_Wat_Phra_Kaew.jpg",
        hint: "สัตว์สี่ขา แต่ว่ามี 33 หัว"
    },
    {
        id: 14,
        answer: "บุษบา",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Hanuman_at_Wat_Phra_Kaew.jpg/400px-Hanuman_at_Wat_Phra_Kaew.jpg",
        hint: "หญิงงามผู้เสี่ยงเทียนเลือกคู่"
    },
    {
        id: 15,
        answer: "นนทก",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Hanuman_at_Wat_Phra_Kaew.jpg/400px-Hanuman_at_Wat_Phra_Kaew.jpg",
        hint: "นิ้วเพชร"
    },
    {
        id: 16,
        answer: "อิเหนา",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Hanuman_at_Wat_Phra_Kaew.jpg/400px-Hanuman_at_Wat_Phra_Kaew.jpg",
        hint: "ว่าแต่เขา...เป็นเอง"
    },
    {
        id: 17,
        answer: "ขุนช้าง",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Hanuman_at_Wat_Phra_Kaew.jpg/400px-Hanuman_at_Wat_Phra_Kaew.jpg",
        hint: "เมียเขาเรารัก"
    },
    {
        id: 18,
        answer: "พลายงาม", "จมื่นไวย", 
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Hanuman_at_Wat_Phra_Kaew.jpg/400px-Hanuman_at_Wat_Phra_Kaew.jpg",
        hint: "เหมือนพ่อ"
    },
    {
        id: 19,
        answer: "ไมยราพ", 
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Hanuman_at_Wat_Phra_Kaew.jpg/400px-Hanuman_at_Wat_Phra_Kaew.jpg",
        hint: "ถอดดวงใจเป็นแมลงภู่"
    },
    {
        id: 20,
        answer: "พระเพื่อน พระแพง", "พระเพื่อนพระแพง", 
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Hanuman_at_Wat_Phra_Kaew.jpg/400px-Hanuman_at_Wat_Phra_Kaew.jpg",
        hint: "เหมือนพ่อ"
    }
];

let currentQuestionIndex = 0;
let players = {};
let correctCount = 0;

io.on('connection', (socket) => {
    socket.on('joinGame', (data) => {
        players[socket.id] = { name: data.playerName, score: 0, answered: false };
        io.emit('updatePlayerCount', Object.keys(players).length);
        broadcastLeaderboard();
    });

    socket.on('startNextQuestion', () => {
        correctCount = 0;
        Object.keys(players).forEach(id => players[id].answered = false);

        const qData = questions[currentQuestionIndex];
        
        // 📌 นับจำนวนกล่องแยกตาม พยัญชนะ สระ วรรณยุกต์ แบบรายตัว
        const charBoxesCount = Array.from(qData.answer).length;
        
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
    });

    socket.on('revealTile', (tileIndex) => {
        io.emit('tileRevealed', tileIndex);
    });

    socket.on('showAnswer', () => {
        const qData = questions[currentQuestionIndex];
        io.emit('answerRevealed', qData.answer);
        currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
    });

    socket.on('submitAnswer', (data) => {
        const player = players[socket.id];
        if (!player || player.answered) return;

        player.answered = true;
        const currentQ = questions[currentQuestionIndex];

        if (data.answer.trim() === currentQ.answer) {
            correctCount++;
            const scoreGained = Math.max(100, 1000 - (data.timeUsed * 20));
            player.score += scoreGained;

            socket.emit('answerResult', { correct: true, scoreGained, currentScore: player.score });
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
    const topPlayers = Object.values(players).sort((a, b) => b.score - a.score).slice(0, 10);
    io.emit('updateLeaderboard', topPlayers);
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
