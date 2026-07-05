let player = {
    gender: "",
    village: "-",
    clan: "-",
    rank: "Academy Student",
    stats: {
        natureCount: "",
        natures: "-",
        chakraAmount: "",
        chakraControl: "",
        ninjutsu: "",
        taijutsu: "",
        genjutsu: "",
        extraSkill: ""
    },
    awakening: "None",
    missionsCompleted: 0,
    akatsukiEncounterRate: 1,
    ryo: 0,
    inventory: {
        "Soldier Pill": 0,
        "Explosive Tag": 0,
        "Smoke Bomb": 0,
        "Chakra Blade": 0,
        "Bingo Book": 0,
        "Gunbai": 0,
        "Sealing Scroll": 0
    },
    combat: {
        hp: 100,
        maxHp: 100,
        isDefending: false
    },
    examPity: 5,
    bonusSkillWon: false
};

let allies = {
    naruto: { hp: 1000, maxHp: 1000 },
    sasuke: { hp: 750, maxHp: 750 }
};

let activeBoss = null;
let smokeBombActive = false;
let tagActive = false;
let globalWheelRotation = 0;
let isWorldSaver = false;
let currentWorldBossIdx = 0;
let currentScreenId = 'screen-gender';

const statLevels = ["Very Bad", "Bad", "Average", "Good", "Very Good", "Expert", "BEST IN THE WORLD"];
const chakraLevels = ["Low", "Average", "High", "Very High", "Almost Infinity", "BEST IN THE WORLD"];
const allNatures = ["Fire (Katon)", "Water (Suiton)", "Wind (Futon)", "Earth (Doton)", "Lightning (Raiton)", "Yin (Inton)", "Yang (Yoton)"];
const extraSkillPool = ["Kenjutsu", "Senjutsu", "Medical Jutsu", "Fuinjutsu (Sealing)", "Space-Time Jutsu"];

const formatStat = {
    natureCount: "Nature Count", natures: "Natures", chakraAmount: "Chakra Amount",
    chakraControl: "Chakra Control", ninjutsu: "Ninjutsu", taijutsu: "Taijutsu",
    genjutsu: "Genjutsu", extraSkill: "Extra Skill"
};

const villages = [
    { name: "Konohagakure (Leaf)", weight: 18 }, { name: "Kumogakure (Cloud)", weight: 18 },
    { name: "Iwagakure (Stone)", weight: 18 }, { name: "Sunagakure (Sand)", weight: 18 },
    { name: "Kirigakure (Mist)", weight: 18 }, { name: "Otogakure (Sound)", weight: 5 },
    { name: "Amegakure (Rain)", weight: 5 }
];

const clansByVillage = {
    "Konohagakure (Leaf)": [
        { name: "Civilian", weight: 100 }, { name: "Aburame", weight: 10 }, { name: "Akimichi", weight: 10 }, 
        { name: "Hatake", weight: 5 }, { name: "Hyuga", weight: 5 }, { name: "Inuzuka", weight: 10 }, 
        { name: "Kurama", weight: 5 }, { name: "Nara", weight: 10 }, { name: "Sarutobi", weight: 10 }, 
        { name: "Senju", weight: 5 }, { name: "Shimura", weight: 10 }, { name: "Uchiha", weight: 5 }, 
        { name: "Uzumaki", weight: 5 }, { name: "Yamanaka", weight: 10 }
    ],
    "Kumogakure (Cloud)": [ { name: "Civilian", weight: 160 }, { name: "Yotsuki", weight: 20 }, { name: "Chinoike", weight: 20 } ],
    "Iwagakure (Stone)": [ { name: "Civilian", weight: 180 }, { name: "Kamizuru", weight: 20 } ],
    "Sunagakure (Sand)": [ { name: "Civilian", weight: 140 }, { name: "Hōki", weight: 20 }, { name: "Shirogane", weight: 20 }, { name: "Kazekage Clan", weight: 20 } ],
    "Kirigakure (Mist)": [ { name: "Civilian", weight: 100 }, { name: "Hōzuki", weight: 20 }, { name: "Karatachi", weight: 20 }, { name: "Hoshigaki", weight: 20 }, { name: "Yuki", weight: 20 }, { name: "Kaguya", weight: 20 } ],
    "Otogakure (Sound)": [ { name: "Civilian", weight: 160 }, { name: "Fūma (Sound Branch)", weight: 20 }, { name: "Jūgo's Clan", weight: 20 } ],
    "Amegakure (Rain)": [ { name: "Civilian", weight: 180 }, { name: "Fūma", weight: 20 } ]
};

const bosses = {
    "Hidan": { name: "Hidan", hp: 300, maxHp: 300, minDmg: 10, maxDmg: 30 },
    "Kakuzu": { name: "Kakuzu", hp: 500, maxHp: 500, minDmg: 20, maxDmg: 45 },
    "Deidara": { name: "Deidara", hp: 400, maxHp: 400, minDmg: 25, maxDmg: 50 },
    "Pain": { name: "Pain", hp: 800, maxHp: 800, minDmg: 35, maxDmg: 70 },
    "Obito": { name: "Obito", hp: 1200, maxHp: 1200, minDmg: 150, maxDmg: 200 },
    "Madara": { name: "Madara Uchiha", hp: 2000, maxHp: 2000, minDmg: 200, maxDmg: 250 },
    "Kaguya": { name: "Kaguya Otsutsuki", hp: 3000, maxHp: 3000, minDmg: 250, maxDmg: 300 }
};

const worldBossesSequence = ["Obito", "Madara", "Kaguya"];

const statPools = {
    natureCount: { base: [ { name: "1", weight: 40 }, { name: "2", weight: 55 }, { name: "3", weight: 40 }, { name: "4", weight: 30 }, { name: "5", weight: 20 }, { name: "6", weight: 10 }, { name: "7", weight: 5 } ] },
    chakraAmount: { base: [ { name: "Low", weight: 20 }, { name: "Average", weight: 40 }, { name: "High", weight: 30 }, { name: "Very High", weight: 9 }, { name: "Almost Infinity", weight: 1 } ], monster: [ { name: "Low", weight: 1 }, { name: "Average", weight: 9 }, { name: "High", weight: 30 }, { name: "Very High", weight: 40 }, { name: "Almost Infinity", weight: 20 } ] },
    chakraControl: { base: [ { name: "Very Bad", weight: 15 }, { name: "Bad", weight: 25 }, { name: "Average", weight: 40 }, { name: "Good", weight: 15 }, { name: "Very Good", weight: 4 }, { name: "Expert", weight: 1 } ], talent: [ { name: "Very Bad", weight: 1 }, { name: "Bad", weight: 4 }, { name: "Average", weight: 15 }, { name: "Good", weight: 40 }, { name: "Very Good", weight: 25 }, { name: "Expert", weight: 15 } ] },
    ninjutsu: { base: [ { name: "Very Bad", weight: 15 }, { name: "Bad", weight: 25 }, { name: "Average", weight: 40 }, { name: "Good", weight: 15 }, { name: "Very Good", weight: 4 }, { name: "Expert", weight: 1 } ], talent: [ { name: "Very Bad", weight: 1 }, { name: "Bad", weight: 4 }, { name: "Average", weight: 15 }, { name: "Good", weight: 40 }, { name: "Very Good", weight: 25 }, { name: "Expert", weight: 15 } ] },
    taijutsu: { base: [ { name: "Very Bad", weight: 15 }, { name: "Bad", weight: 25 }, { name: "Average", weight: 40 }, { name: "Good", weight: 15 }, { name: "Very Good", weight: 4 }, { name: "Expert", weight: 1 } ], talent: [ { name: "Very Bad", weight: 1 }, { name: "Bad", weight: 4 }, { name: "Average", weight: 15 }, { name: "Good", weight: 40 }, { name: "Very Good", weight: 25 }, { name: "Expert", weight: 15 } ] },
    genjutsu: { base: [ { name: "Very Bad", weight: 30 }, { name: "Bad", weight: 35 }, { name: "Average", weight: 25 }, { name: "Good", weight: 7 }, { name: "Very Good", weight: 2 }, { name: "Expert", weight: 1 } ], talent: [ { name: "Very Bad", weight: 1 }, { name: "Bad", weight: 4 }, { name: "Average", weight: 15 }, { name: "Good", weight: 40 }, { name: "Very Good", weight: 25 }, { name: "Expert", weight: 15 } ] },
    extraSkill: { base: [ { name: "None", weight: 150 }, { name: "Kenjutsu", weight: 30 }, { name: "Senjutsu", weight: 5 }, { name: "Medical Jutsu", weight: 5 }, { name: "Fuinjutsu (Sealing)", weight: 5 }, { name: "Space-Time Jutsu", weight: 5 } ], uzumakiBuff: [ { name: "None", weight: 40 }, { name: "Kenjutsu", weight: 5 }, { name: "Senjutsu", weight: 50 }, { name: "Medical", weight: 25 }, { name: "Fuinjutsu (Sealing)", weight: 75 }, { name: "Space-Time Jutsu", weight: 5 } ], medicalBuff: [ { name: "None", weight: 80 }, { name: "Kenjutsu", weight: 5 }, { name: "Senjutsu", weight: 5 }, { name: "Medical Jutsu", weight: 100 }, { name: "Fuinjutsu", weight: 5 }, { name: "Space-Time Jutsu", weight: 5 } ], swordBuff: [ { name: "None", weight: 80 }, { name: "Kenjutsu", weight: 100 }, { name: "Senjutsu", weight: 5 }, { name: "Medical Jutsu", weight: 5 }, { name: "Fuinjutsu", weight: 5 }, { name: "Space-Time Jutsu", weight: 5 } ], senjuBuff: [ { name: "None", weight: 70 }, { name: "Kenjutsu", weight: 5 }, { name: "Senjutsu", weight: 100 }, { name: "Medical Jutsu", weight: 15 }, { name: "Fuinjutsu", weight: 5 }, { name: "Space-Time Jutsu", weight: 5 } ] }
};

const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playTickSound() {
    if (!audioCtx || audioCtx.state === 'suspended') return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    if (screenId !== 'screen-credits') {
        currentScreenId = screenId;
    }
}

function openCredits() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-credits').classList.add('active');
}

function closeCredits() {
    showScreen(currentScreenId);
}

function saveGame() {
    localStorage.setItem("ninjaPathSave", JSON.stringify({ player, allies }));
    alert("Game Saved Successfully!");
}

function loadGame() {
    let saved = localStorage.getItem("ninjaPathSave");
    if(saved) {
        let parsed = JSON.parse(saved);
        if(parsed.player) {
            player = {...player, ...parsed.player};
            if(parsed.allies) allies = {...allies, ...parsed.allies};
        } else {
            player = {...player, ...parsed}; 
        }
        if(!player.examPity) player.examPity = 5;
        if(player.bonusSkillWon === undefined) player.bonusSkillWon = false;
        updateRightPanel();
        goToHub();
    } else {
        alert("No save file found!");
    }
}

window.onload = () => {
    updateRightPanel();
    document.getElementById('wheel-title').innerText = "Awaiting Destiny...";
    if(localStorage.getItem("ninjaPathSave")) {
        document.getElementById("start-load-btn").classList.remove("hidden");
    }
};

function getWeightedRandom(array) {
    let sum = 0;
    for (let item of array) sum += item.weight;
    let rand = Math.random() * sum;
    for (let item of array) {
        if (rand < item.weight) return item;
        rand -= item.weight;
    }
}

function statToNum(statVal) {
    const map = { "Very Bad":1, "Bad":2, "Average":3, "Good":5, "Very Good":8, "Expert":12, "BEST IN THE WORLD":20, "Low":1, "High":5, "Very High":8, "Almost Infinity": 15 };
    return map[statVal] || 3;
}

function checkAllStatsRolled() {
    if (player.stats.natureCount && player.stats.natures !== "-" && player.stats.chakraAmount && player.stats.chakraControl && player.stats.ninjutsu && player.stats.taijutsu && player.stats.genjutsu && player.stats.extraSkill) {
        document.getElementById('next-to-story-btn').classList.remove('hidden');
    }
}

function updateRightPanel() {
    document.getElementById('profile-rank').innerText = player.rank;
    document.getElementById('profile-clan').innerText = player.clan;
    document.getElementById('profile-village').innerText = player.village;
    document.getElementById('profile-ryo').innerText = player.ryo;
    document.getElementById('profile-hp').innerText = `${player.combat.hp}/${player.combat.maxHp}`;
    document.getElementById('profile-awakening').innerText = player.awakening;
    document.getElementById('profile-natures').innerText = player.stats.natures;

    document.getElementById('profile-chakraAmount').innerText = player.stats.chakraAmount || "-";
    document.getElementById('profile-chakraControl').innerText = player.stats.chakraControl || "-";
    document.getElementById('profile-ninjutsu').innerText = player.stats.ninjutsu || "-";
    document.getElementById('profile-taijutsu').innerText = player.stats.taijutsu || "-";
    document.getElementById('profile-genjutsu').innerText = player.stats.genjutsu || "-";
    document.getElementById('profile-extraSkill').innerText = player.stats.extraSkill || "-";

    const grid = document.getElementById('items-grid');
    grid.innerHTML = "";
    let totalSlots = 12;
    let currentSlot = 0;
    
    for (let [item, count] of Object.entries(player.inventory)) {
        if (count > 0) {
            grid.innerHTML += `<div class="inventory-slot"><span style="color:#ffcc00; font-weight:bold;">${item}</span><span>x${count}</span></div>`;
            currentSlot++;
        }
    }
    
    while (currentSlot < totalSlots) {
        grid.innerHTML += `<div class="inventory-slot" style="opacity:0.3;">Empty</div>`;
        currentSlot++;
    }
}

function spinWheelVisual(options, title, callback) {
    document.getElementById('wheel-title').innerText = title;
    initAudio();
    
    const canvas = document.getElementById('wheel-canvas');
    const ctx = canvas.getContext('2d');
    const cw = canvas.width;
    const ch = canvas.height;
    ctx.clearRect(0, 0, cw, ch);

    let totalWeight = options.reduce((sum, o) => sum + o.weight, 0);
    let startAngle = 0;
    let slices = [];

    for(let i=0; i<options.length; i++) {
        let opt = options[i];
        let sliceAngle = (opt.weight / totalWeight) * 360;

        slices.push({
            name: opt.name,
            start: startAngle,
            end: startAngle + sliceAngle
        });

        ctx.beginPath();
        ctx.moveTo(cw/2, ch/2);
        ctx.arc(cw/2, ch/2, cw/2, startAngle * Math.PI / 180, (startAngle + sliceAngle) * Math.PI / 180);
        ctx.fillStyle = `hsl(${(i * 360) / options.length}, 70%, 40%)`;
        ctx.fill();
        ctx.strokeStyle = '#1e1e1e';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.save();
        ctx.translate(cw/2, ch/2);
        ctx.rotate((startAngle + sliceAngle / 2) * Math.PI / 180);
        ctx.textAlign = "right";
        ctx.fillStyle = "#fff";
        ctx.font = "bold 16px Arial";
        let text = opt.name.length > 20 ? opt.name.substring(0, 18) + ".." : opt.name;
        ctx.fillText(text, cw/2 - 20, 6);
        ctx.restore();

        startAngle += sliceAngle;
    }

    let winner = getWeightedRandom(options);
    
    let winnerCenterAngle = 0;
    for(let i=0; i<slices.length; i++) {
        if(slices[i].name === winner.name) {
            winnerCenterAngle = slices[i].start + ((slices[i].end - slices[i].start) / 2);
            break;
        }
    }

    let currentMod = globalWheelRotation % 360;
    let targetDegrees = 360 - winnerCenterAngle;
    if(targetDegrees < 0) targetDegrees += 360;
    
    let spinAmount = (360 * 6) + (targetDegrees - currentMod);
    let startRotation = globalWheelRotation;
    globalWheelRotation += spinAmount;

    let duration = 5000;
    let startTime = null;
    let lastSliceIdx = -1;

    canvas.style.transition = "none";

    function easeOutQuart(x) {
        return 1 - Math.pow(1 - x, 4);
    }

    function animateWheel(timestamp) {
        if (!startTime) startTime = timestamp;
        let progress = timestamp - startTime;
        let pct = Math.min(progress / duration, 1);
        let easedPct = easeOutQuart(pct);
        
        let currentRotation = startRotation + (spinAmount * easedPct);
        canvas.style.transform = `rotate(${currentRotation}deg)`;

        let currentDeg = (360 - (currentRotation % 360)) % 360;
        let currentSliceIdx = slices.findIndex(s => currentDeg >= s.start && currentDeg < s.end);
        
        if (lastSliceIdx === -1) {
            lastSliceIdx = currentSliceIdx;
        } else if (currentSliceIdx !== lastSliceIdx) {
            playTickSound();
            lastSliceIdx = currentSliceIdx;
        }

        if (progress < duration) {
            requestAnimationFrame(animateWheel);
        } else {
            setTimeout(() => {
                callback(winner);
            }, 200);
        }
    }

    requestAnimationFrame(animateWheel);
}

function rollNatureSequence(count, pool, selectedNatures, resultSpan) {
    if(count === 0) {
        player.stats.natures = selectedNatures.join(", ");
        resultSpan.innerText = player.stats.natures;
        checkAllStatsRolled();
        updateRightPanel();
        return;
    }
    
    let options = pool.map(n => ({name: n, weight: 10}));
    spinWheelVisual(options, "Rolling Element...", (winner) => {
        selectedNatures.push(winner.name);
        let index = pool.indexOf(winner.name);
        pool.splice(index, 1); 
        resultSpan.innerText = selectedNatures.join(", ") + "...";
        updateRightPanel();
        rollNatureSequence(count - 1, pool, selectedNatures, resultSpan);
    });
}

function selectGender(selected) { 
    initAudio(); 
    player.gender = selected; 
    showScreen('screen-village'); 
}

function spinVillage() {
    let btn = document.getElementById('spin-village-btn');
    btn.disabled = true;
    spinWheelVisual(villages, "Select Village", (winner) => {
        player.village = winner.name;
        document.getElementById('village-result').innerText = `Your Village: ${player.village}`;
        document.getElementById('next-to-clan-btn').classList.remove('hidden');
        updateRightPanel();
    });
}

function goToClan() { showScreen('screen-clan'); document.getElementById('clan-info-text').innerText = `Village: ${player.village}`; }

function spinClan() {
    let btn = document.getElementById('spin-clan-btn');
    btn.disabled = true;
    let availableClans = clansByVillage[player.village] || [{name: "Civilian", weight: 100}];
    spinWheelVisual(availableClans, "Select Clan", (winner) => {
        player.clan = winner.name;
        document.getElementById('clan-result').innerText = `Your Bloodline: ${player.clan}`;
        document.getElementById('next-to-stats-btn').classList.remove('hidden');
        updateRightPanel();
    });
}

function goToStats() { showScreen('screen-stats'); }

function spinStat(statName) {
    let btn = document.getElementById('spin-' + statName + '-btn');
    let resultSpan = document.getElementById('stat-' + statName + '-result');
    
    if (statName === 'natureCount') {
        btn.disabled = true; 
        spinWheelVisual(statPools.natureCount.base, "Nature Count", (winner) => {
            player.stats.natureCount = winner.name;
            resultSpan.innerText = player.stats.natureCount;
            checkAllStatsRolled();
            updateRightPanel();
        });
        return;
    }
    
    if (statName === 'natures') {
        if (!player.stats.natureCount) { alert("Roll Nature Count first!"); return; }
        btn.disabled = true; 
        let count = parseInt(player.stats.natureCount);
        let pool = [...allNatures];
        rollNatureSequence(count, pool, [], resultSpan);
        return;
    }

    btn.disabled = true; 
    let weightsToUse = statPools[statName].base; 
    if (statName === 'chakraAmount' && ["Uzumaki", "Senju", "Hoshigaki", "Yotsuki", "Kazekage Clan"].includes(player.clan)) { weightsToUse = statPools.chakraAmount.monster; } 
    else if (statName === 'chakraControl' && ["Hyuga", "Uchiha", "Hōki", "Yamanaka", "Nara"].includes(player.clan)) { weightsToUse = statPools.chakraControl.talent; }
    else if (statName === 'ninjutsu' && ["Uchiha", "Sarutobi", "Kamizuru", "Kazekage Clan"].includes(player.clan)) { weightsToUse = statPools.ninjutsu.talent; }
    else if (statName === 'taijutsu' && ["Hyuga", "Kaguya", "Yotsuki", "Inuzuka"].includes(player.clan)) { weightsToUse = statPools.taijutsu.talent; }
    else if (statName === 'genjutsu' && ["Uchiha", "Kurama", "Chinoike"].includes(player.clan)) { weightsToUse = statPools.genjutsu.talent; }
    else if (statName === 'extraSkill') {
        if (player.clan === "Uzumaki") weightsToUse = statPools.extraSkill.uzumakiBuff;
        else if (player.clan === "Hōki") weightsToUse = statPools.extraSkill.medicalBuff;
        else if (player.clan === "Senju") weightsToUse = statPools.extraSkill.senjuBuff;
        else if (["Hōzuki", "Karatachi"].includes(player.clan)) weightsToUse = statPools.extraSkill.swordBuff;
    }
    
    spinWheelVisual(weightsToUse, formatStat[statName], (winner) => {
        player.stats[statName] = winner.name;
        resultSpan.innerText = player.stats[statName];
        checkAllStatsRolled();
        updateRightPanel();
    });
}

function goToStory() { showScreen('screen-academy'); }

function spinAcademy() {
    let btn = document.getElementById('spin-academy-btn');
    btn.disabled = true;
    let academyWheel = [{name: "Graduated Genin", weight: 100}];
    spinWheelVisual(academyWheel, "Academy Exam", (winner) => {
        player.rank = "Genin";
        document.getElementById('academy-result').innerText = "You passed the exam! You are now a Genin.";
        document.getElementById('next-to-hub-btn').classList.remove('hidden');
        updateRightPanel();
    });
}

function goToHub() {
    showScreen('screen-hub');
    updateRightPanel();
    document.getElementById('wheel-title').innerText = "Awaiting Action...";
    
    if(player.rank === "Kage") {
        document.getElementById('spin-action-btn').classList.add('hidden');
        document.getElementById('save-world-btn').classList.remove('hidden');
    } else {
        document.getElementById('spin-action-btn').classList.remove('hidden');
        document.getElementById('save-world-btn').classList.add('hidden');
    }
}

function tryAwakening() {
    if(Math.random() > 0.3) return null; 
    let msg = "";
    if(player.clan === "Uchiha") {
        if(player.awakening === "None") { player.awakening = "1-Tomoe Sharingan"; msg = "You awakened the 1-Tomoe Sharingan!"; }
        else if(player.awakening === "1-Tomoe Sharingan") { player.awakening = "2-Tomoe Sharingan"; msg = "You unlocked the 2-Tomoe Sharingan!"; }
        else if(player.awakening === "2-Tomoe Sharingan") { player.awakening = "3-Tomoe Sharingan"; msg = "3-Tomoe Sharingan unlocked!"; }
        else if(player.awakening === "3-Tomoe Sharingan") { player.awakening = "Mangekyo Sharingan"; msg = "The Mangekyo Sharingan is yours!"; }
    }
    else if(player.clan === "Hyuga" && player.awakening === "None") { player.awakening = "Byakugan"; msg = "You awakened the Byakugan!"; }
    else if(player.clan === "Kaguya" && player.awakening === "None") { player.awakening = "Shikotsumyaku"; msg = "Shikotsumyaku awakened!"; }
    else if(player.clan === "Yuki" && player.awakening === "None") { player.awakening = "Ice Release"; msg = "You unlocked Ice Release!"; }
    else if(player.clan === "Senju" && player.awakening === "None") { player.awakening = "Wood Release"; msg = "You awakened Wood Release!"; }
    else if(player.clan === "Chinoike" && player.awakening === "None") { player.awakening = "Ketsuryugan"; msg = "Ketsuryugan awakened!"; }
    return msg !== "" ? msg : null;
}

function downgradeRandomStat() {
    const upgradableStats = ["chakraControl", "ninjutsu", "taijutsu", "genjutsu"];
    let randomStat = upgradableStats[Math.floor(Math.random() * upgradableStats.length)];
    let currentLevel = player.stats[randomStat];
    let idx = statLevels.indexOf(currentLevel);
    if(idx > 0) {
        player.stats[randomStat] = statLevels[idx - 1];
        return `Lost 1 level in ${formatStat[randomStat]}.`;
    }
    return `Stats could not drop any further.`;
}

function spinAction() {
    let btn = document.getElementById('spin-action-btn');
    btn.disabled = true;
    let actions = [];
    
    if (player.rank === "Genin") {
        actions.push({ name: "D-Rank Mission", type: "mission", diff: "easy", ryo: 50, weight: 40 });
        actions.push({ name: "C-Rank Mission", type: "mission", diff: "medium", ryo: 100, weight: 30 });
        actions.push({ name: "Intense Training", type: "train", weight: 30 });
        if (player.missionsCompleted >= 5) actions.push({ name: "Chunin Exams", type: "exam", nextRank: "Chunin", weight: player.examPity });
    } 
    else if (player.rank === "Chunin") {
        actions.push({ name: "C-Rank Mission", type: "mission", diff: "medium", ryo: 100, weight: 30 });
        actions.push({ name: "B-Rank Mission", type: "mission", diff: "hard", ryo: 250, weight: 30 });
        actions.push({ name: "Intense Training", type: "train", weight: 25 });
        if (player.missionsCompleted >= 15) actions.push({ name: "Jounin Exams", type: "exam", nextRank: "Jounin", weight: player.examPity });
    }
    else if (player.rank === "Jounin") {
        actions.push({ name: "B-Rank Mission", type: "mission", diff: "hard", ryo: 250, weight: 30 });
        actions.push({ name: "A-Rank Mission", type: "mission", diff: "very_hard", ryo: 500, weight: 40 });
        actions.push({ name: "Intense Training", type: "train", weight: 10 });
        if (player.missionsCompleted >= 30) actions.push({ name: "Elite Jounin Exams", type: "exam", nextRank: "Elite Jounin", weight: player.examPity });
    }
    else if (player.rank === "Elite Jounin") {
        actions.push({ name: "A-Rank Mission", type: "mission", diff: "very_hard", ryo: 500, weight: 40 });
        actions.push({ name: "S-Rank Mission", type: "mission", diff: "extreme", ryo: 1000, weight: 40 });
        actions.push({ name: "Intense Training", type: "train", weight: 10 });
        if (player.missionsCompleted >= 50) actions.push({ name: "Kage Nomination", type: "exam", nextRank: "Kage", weight: player.examPity });
    }

    spinWheelVisual(actions, "Next Action", (action) => {
        if (action.type === "exam") {
            player.examPity = 5;
        } else {
            player.examPity *= 2;
        }

        showScreen('screen-event');
        document.getElementById('event-title').innerText = action.name;
        let desc = document.getElementById('event-description');
        let res = document.getElementById('event-result');
        let returnBtn = document.getElementById('return-hub-btn');
        let escapeBtn = document.getElementById('escape-ambush-btn');
        let fightBtn = document.getElementById('fight-ambush-btn');
        let rewardBtn = document.getElementById('spin-reward-btn');
        let missionBtn = document.getElementById('spin-mission-btn');
        
        if (!missionBtn) {
            missionBtn = document.createElement('button');
            missionBtn.id = 'spin-mission-btn';
            missionBtn.style.backgroundColor = '#8e44ad';
            missionBtn.innerText = 'Spin Mission Outcome';
            document.querySelector('#screen-event .button-group').prepend(missionBtn);
        }
        
        res.innerText = "";
        returnBtn.classList.add('hidden');
        escapeBtn.classList.add('hidden');
        fightBtn.classList.add('hidden');
        rewardBtn.classList.add('hidden');
        missionBtn.classList.add('hidden');
        btn.disabled = false;

        let deathRoll = Math.random() * 100; 
        if (deathRoll < player.akatsukiEncounterRate && action.diff !== "easy" && action.type !== "train") {
            desc.innerText = "AMBUSH! An Akatsuki member intercepted your mission!";
            fightBtn.classList.remove('hidden');
            if (player.inventory["Explosive Tag"] > 0) escapeBtn.classList.remove('hidden');
            return;
        }

        if (action.type === "mission") {
            if (action.diff !== "easy") {
                desc.innerText = `You encountered enemies on your ${action.diff} mission! Spin to determine outcome.`;
                missionBtn.classList.remove('hidden');
                missionBtn.onclick = () => {
                    missionBtn.classList.add('hidden');
                    let mWheel = [ {name:"Win", weight:60}, {name:"Lose", weight:20}, {name:"Flee", weight:20} ];
                    spinWheelVisual(mWheel, "Mission Combat", (outcome) => {
                        if(outcome.name === "Win") {
                            player.missionsCompleted++;
                            player.akatsukiEncounterRate += 2;
                            let earnedRyo = action.ryo;
                            if(player.inventory["Bingo Book"] > 0) earnedRyo = Math.floor(earnedRyo * 1.5);
                            player.ryo += earnedRyo;
                            res.innerHTML = `<span style='color:#4CAF50;'>Mission Won! <br>+${earnedRyo} Ryo</span>`;
                            
                            let awakeningResult = tryAwakening();
                            if(awakeningResult) res.innerHTML += `<br><span style='color:#ffcc00; font-weight:bold;'>${awakeningResult}</span>`;

                            let isEligible = false;
                            if(player.rank === "Genin" && action.diff !== "easy") isEligible = true;
                            if(player.rank === "Chunin" && (action.diff === "hard" || action.diff === "very_hard" || action.diff === "extreme")) isEligible = true;
                            if(player.rank === "Jounin" && (action.diff === "very_hard" || action.diff === "extreme")) isEligible = true;
                            if(player.rank === "Elite Jounin" && action.diff === "extreme") isEligible = true;

                            if (isEligible) {
                                rewardBtn.classList.remove('hidden');
                            } else {
                                returnBtn.classList.remove('hidden');
                            }
                        } else if (outcome.name === "Lose") {
                            let dropMsg = downgradeRandomStat();
                            res.innerHTML = `<span style='color:red;'>Mission Failed! Enemies overpowered you. <br>${dropMsg}</span>`;
                            returnBtn.classList.remove('hidden');
                        } else {
                            res.innerHTML = `<span style='color:gray;'>You fled the mission to survive.</span>`;
                            returnBtn.classList.remove('hidden');
                        }
                        updateRightPanel();
                    });
                };
            } else {
                player.missionsCompleted++;
                player.akatsukiEncounterRate += 0.5;
                let earnedRyo = action.ryo;
                if(player.inventory["Bingo Book"] > 0) earnedRyo = Math.floor(earnedRyo * 1.5);
                player.ryo += earnedRyo;
                desc.innerText = `You completed chores around the village.`;
                res.innerHTML = `<span style='color:gold;'>+${earnedRyo} Ryo</span>`;
                returnBtn.classList.remove('hidden');
            }
        } 
        else if (action.type === "train") {
            desc.innerText = "You spent weeks training.";
            let upgradableStats = ["chakraControl", "ninjutsu", "taijutsu", "genjutsu"];
            let randomStat = upgradableStats[Math.floor(Math.random() * upgradableStats.length)];
            let currentLevel = player.stats[randomStat];
            let idx = statLevels.indexOf(currentLevel);
            if(idx !== -1 && idx < statLevels.length - 1) {
                player.stats[randomStat] = statLevels[idx + 1];
                res.innerText = `Your ${formatStat[randomStat]} improved to ${statLevels[idx + 1]}!`;
            } else {
                res.innerText = "You trained hard, but this stat is already peaked!";
            }
            if(player.akatsukiEncounterRate > 1) player.akatsukiEncounterRate -= 1; 
            returnBtn.classList.remove('hidden');
        }
        else if (action.type === "exam") {
            player.rank = action.nextRank;
            desc.innerText = "You proved your worth in the exams!";
            res.innerHTML = `<span style='color:#4CAF50;'>Promoted to ${player.rank}!</span>`;
            returnBtn.classList.remove('hidden');
        }
        updateRightPanel();
    });
}

function spinBonusReward() {
    let btn = document.getElementById('spin-reward-btn');
    btn.disabled = true;
    
    let noneWeight = 56;
    let rewardOptions = [];
    
    let statsToCheck = ["ninjutsu", "taijutsu", "genjutsu", "chakraControl", "chakraAmount"];
    statsToCheck.forEach(st => {
        if(player.stats[st] === "Expert" || player.stats[st] === "BEST IN THE WORLD") {
            noneWeight += 8;
        } else {
            rewardOptions.push({name: st, weight: 8});
        }
    });
    
    if (player.bonusSkillWon) {
        noneWeight += 4;
    } else {
        rewardOptions.push({name: "Extra Skill", weight: 4});
    }
    
    rewardOptions.push({name: "None", weight: noneWeight});

    spinWheelVisual(rewardOptions, "Bonus Reward", (winner) => {
        let res = document.getElementById('event-result');
        if(winner.name === "Extra Skill") {
            player.bonusSkillWon = true;
            let currentSkills = player.stats.extraSkill;
            let available = extraSkillPool.filter(s => !currentSkills.includes(s));
            if(available.length > 0) {
                let newSkill = available[Math.floor(Math.random() * available.length)];
                if(currentSkills === "None" || currentSkills === "") player.stats.extraSkill = newSkill;
                else player.stats.extraSkill += ", " + newSkill;
                res.innerHTML += `<br><span style='color:#4CAF50; font-weight:bold;'>Bonus: Unlocked ${newSkill}!</span>`;
            } else {
                res.innerHTML += `<br><span style='color:gray; font-weight:bold;'>Bonus: No more extra skills to learn.</span>`;
            }
        }
        else if(winner.name !== "None") {
            let lvls = winner.name === "chakraAmount" ? chakraLevels : statLevels;
            let idx = lvls.indexOf(player.stats[winner.name]);
            if(idx !== -1 && idx < lvls.length - 1) {
                player.stats[winner.name] = lvls[idx + 1];
                res.innerHTML += `<br><span style='color:#4CAF50; font-weight:bold;'>Bonus: ${formatStat[winner.name]} improved!</span>`;
            }
        } else {
            res.innerHTML += `<br><span style='color:gray; font-weight:bold;'>Bonus: Nothing extra this time.</span>`;
        }
        updateRightPanel();
        btn.classList.add('hidden');
        btn.disabled = false;
        document.getElementById('return-hub-btn').classList.remove('hidden');
    });
}

function escapeAmbush() {
    player.inventory["Explosive Tag"]--;
    document.getElementById('escape-ambush-btn').classList.add('hidden');
    document.getElementById('fight-ambush-btn').classList.add('hidden');
    document.getElementById('event-result').innerHTML = "You used an Explosive Tag to blind the enemy and escaped safely!";
    document.getElementById('return-hub-btn').classList.remove('hidden');
    player.akatsukiEncounterRate = 1;
    updateRightPanel();
}

function triggerAmbushCombat() {
    isWorldSaver = false;
    let bossKeys = ["Hidan", "Kakuzu", "Deidara", "Pain"];
    let randomBoss = bossKeys[Math.floor(Math.random() * bossKeys.length)];
    startCombat(randomBoss);
}

function startWorldSaver() {
    isWorldSaver = true;
    currentWorldBossIdx = 0;
    allies.naruto.hp = allies.naruto.maxHp;
    allies.sasuke.hp = allies.sasuke.maxHp;
    startCombat(worldBossesSequence[currentWorldBossIdx]);
}

function goToShop() {
    showScreen('screen-shop');
    let uchihaItem = document.getElementById('shop-uchiha');
    let uzumakiItem = document.getElementById('shop-uzumaki');
    uchihaItem.style.display = (player.clan === "Uchiha" && player.inventory["Gunbai"] === 0) ? "block" : "none";
    uzumakiItem.style.display = (player.clan === "Uzumaki" && player.inventory["Sealing Scroll"] === 0) ? "block" : "none";
    document.getElementById('shop-blade').style.display = player.inventory["Chakra Blade"] > 0 ? "none" : "block";
    document.getElementById('shop-bingo').style.display = player.inventory["Bingo Book"] > 0 ? "none" : "block";
    document.getElementById('shop-result').innerText = "";
    document.getElementById('wheel-title').innerText = "Ninja Tools Shop";
    updateRightPanel();
}

function buyItem(itemName, cost) {
    let resultDiv = document.getElementById('shop-result');
    if(player.ryo >= cost) {
        player.ryo -= cost;
        player.inventory[itemName]++;
        resultDiv.innerHTML = `Bought 1x ${itemName}!`;
        resultDiv.style.color = "#4CAF50";
        updateRightPanel();
        goToShop();
    } else {
        resultDiv.innerHTML = "Not enough Ryo!";
        resultDiv.style.color = "red";
    }
}

function returnToHub() { goToHub(); }

function startCombat(bossName) {
    showScreen('screen-combat');
    activeBoss = JSON.parse(JSON.stringify(bosses[bossName]));
    
    player.combat.maxHp = (statToNum(player.stats.chakraAmount) * 30) + 100;
    player.combat.hp = player.combat.maxHp;
    
    smokeBombActive = false;
    tagActive = false;
    
    document.getElementById('combat-boss-name').innerText = activeBoss.name;
    document.getElementById('combat-log').innerHTML = "<div>Battle begins!</div>";
    
    if (isWorldSaver) {
        document.getElementById('combat-naruto-box').classList.remove('hidden');
        document.getElementById('combat-sasuke-box').classList.remove('hidden');
        document.getElementById('combat-item-pill-naruto').classList.remove('hidden');
        document.getElementById('combat-item-pill-sasuke').classList.remove('hidden');
    } else {
        document.getElementById('combat-naruto-box').classList.add('hidden');
        document.getElementById('combat-sasuke-box').classList.add('hidden');
        document.getElementById('combat-item-pill-naruto').classList.add('hidden');
        document.getElementById('combat-item-pill-sasuke').classList.add('hidden');
    }
    
    updateCombatUI();
    renderCombatItems();
    document.getElementById('combat-actions').classList.remove('hidden');
}

function updateCombatUI() {
    document.getElementById('combat-player-hp').innerText = `${player.combat.hp} / ${player.combat.maxHp}`;
    document.getElementById('combat-naruto-hp').innerText = `${allies.naruto.hp} / ${allies.naruto.maxHp}`;
    document.getElementById('combat-sasuke-hp').innerText = `${allies.sasuke.hp} / ${allies.sasuke.maxHp}`;
    document.getElementById('combat-boss-hp').innerText = `${activeBoss.hp} / ${activeBoss.maxHp}`;
    updateRightPanel();
    
    let actionsDiv = document.getElementById('combat-actions');
    let endBtn = document.getElementById('combat-end-btn');
    let winBtn = document.getElementById('combat-win-btn');
    let rewardBtn = document.getElementById('combat-reward-btn');
    
    if (player.combat.hp <= 0 && (!isWorldSaver || (allies.naruto.hp <= 0 && allies.sasuke.hp <= 0))) {
        logCombat("<span style='color:red;'>You have fallen...</span>");
        actionsDiv.classList.add('hidden');
        endBtn.classList.remove('hidden');
        winBtn.classList.add('hidden');
        rewardBtn.classList.add('hidden');
    } else if (activeBoss.hp <= 0) {
        logCombat(`<span style='color:gold; font-size:1.2rem;'>YOU DEFEATED ${activeBoss.name}!</span>`);
        actionsDiv.classList.add('hidden');
        endBtn.classList.add('hidden');
        
        if (isWorldSaver) {
            currentWorldBossIdx++;
            if (currentWorldBossIdx < worldBossesSequence.length) {
                winBtn.innerText = "Next Battle";
                winBtn.onclick = () => { startCombat(worldBossesSequence[currentWorldBossIdx]); };
            } else {
                winBtn.innerText = "Claim Ultimate Victory";
                winBtn.onclick = () => location.reload();
            }
            winBtn.classList.remove('hidden');
        } else {
            winBtn.innerText = "Return to Hub";
            player.akatsukiEncounterRate = 1;
            winBtn.onclick = () => returnToHub();
            
            let isEligible = false;
            if(player.rank === "Genin" || player.rank === "Chunin" || player.rank === "Jounin" || player.rank === "Elite Jounin") isEligible = true;
            if (isEligible) {
                rewardBtn.classList.remove('hidden');
                winBtn.classList.add('hidden');
            } else {
                winBtn.classList.remove('hidden');
            }
        }
    }
}

function spinCombatReward() {
    document.getElementById('combat-reward-btn').classList.add('hidden');
    let rewardOptions = [
        { name: "None", weight: 56 },
        { name: "ninjutsu", weight: 8 },
        { name: "taijutsu", weight: 8 },
        { name: "genjutsu", weight: 8 },
        { name: "chakraControl", weight: 8 },
        { name: "chakraAmount", weight: 8 },
        { name: "Extra Skill", weight: 4 }
    ];
    spinWheelVisual(rewardOptions, "Battle Reward", (winner) => {
        if(winner.name === "Extra Skill") {
            player.bonusSkillWon = true;
            let currentSkills = player.stats.extraSkill;
            let available = extraSkillPool.filter(s => !currentSkills.includes(s));
            if(available.length > 0) {
                let newSkill = available[Math.floor(Math.random() * available.length)];
                if(currentSkills === "None" || currentSkills === "") player.stats.extraSkill = newSkill;
                else player.stats.extraSkill += ", " + newSkill;
                logCombat(`<span style='color:#4CAF50;'>Bonus: Unlocked ${newSkill}!</span>`);
            }
        }
        else if(winner.name !== "None") {
            upgradeSpecificStat(winner.name);
            logCombat(`<span style='color:#4CAF50;'>Bonus: ${formatStat[winner.name]} improved!</span>`);
        } else {
            logCombat(`<span style='color:gray;'>Bonus: Nothing extra.</span>`);
        }
        updateRightPanel();
        document.getElementById('combat-win-btn').classList.remove('hidden');
    });
}

function logCombat(msg) {
    let logBox = document.getElementById('combat-log');
    logBox.innerHTML += `<div>${msg}</div>`;
    logBox.scrollTop = logBox.scrollHeight;
}

function renderCombatItems() {
    document.getElementById('combat-item-pill').style.display = player.inventory["Soldier Pill"] > 0 ? "inline-block" : "none";
    if(isWorldSaver) {
        document.getElementById('combat-item-pill-naruto').style.display = player.inventory["Soldier Pill"] > 0 && allies.naruto.hp > 0 ? "inline-block" : "none";
        document.getElementById('combat-item-pill-sasuke').style.display = player.inventory["Soldier Pill"] > 0 && allies.sasuke.hp > 0 ? "inline-block" : "none";
    }
    document.getElementById('combat-item-smoke').style.display = player.inventory["Smoke Bomb"] > 0 ? "inline-block" : "none";
    document.getElementById('combat-item-tag').style.display = player.inventory["Explosive Tag"] > 0 ? "inline-block" : "none";
}

function useCombatItem(item, target = "Player") {
    if (player.inventory[item] > 0) {
        player.inventory[item]--;
        renderCombatItems();
        updateRightPanel();
        if (item === "Soldier Pill") {
            let heal = 150;
            if(target === "Player") {
                player.combat.hp = Math.min(player.combat.maxHp, player.combat.hp + heal);
                logCombat(`<span style='color:#4CAF50;'>Used Soldier Pill on Yourself! Recovered ${heal} HP.</span>`);
            } else if (target === "Naruto") {
                allies.naruto.hp = Math.min(allies.naruto.maxHp, allies.naruto.hp + heal);
                logCombat(`<span style='color:#f39c12;'>Used Soldier Pill on Naruto! Recovered ${heal} HP.</span>`);
            } else if (target === "Sasuke") {
                allies.sasuke.hp = Math.min(allies.sasuke.maxHp, allies.sasuke.hp + heal);
                logCombat(`<span style='color:#9b59b6;'>Used Soldier Pill on Sasuke! Recovered ${heal} HP.</span>`);
            }
        } else if (item === "Smoke Bomb") {
            smokeBombActive = true;
            logCombat("<span style='color:gray;'>Used Smoke Bomb! Boss's accuracy severely reduced.</span>");
        } else if (item === "Explosive Tag") {
            tagActive = true;
            logCombat("<span style='color:orange;'>Prepared Explosive Tag! Your next spin has an Explosive option.</span>");
        }
        updateCombatUI();
    }
}

function spinCombatWheel() {
    document.getElementById('combat-actions').classList.add('hidden');
    
    let wheel = [
        { name: "Stumble", weight: 10, dmg: 0, msg: "You tripped! Missed your attack." },
        { name: "Basic Strike", weight: 30, dmg: 15, msg: "Landed a basic strike." }
    ];

    let ninNum = statToNum(player.stats.ninjutsu);
    if (ninNum >= 5) wheel.push({ name: "Ninjutsu Art", weight: ninNum * 5, dmg: ninNum * 8, msg: "Hit with a powerful Ninjutsu!" });
    if (ninNum >= 12) wheel.push({ name: "Epic Ninjutsu", weight: 15, dmg: 150, msg: "Unleashed a devastating S-Rank Ninjutsu!" });

    let taiNum = statToNum(player.stats.taijutsu);
    if (taiNum >= 5) wheel.push({ name: "Taijutsu Combo", weight: taiNum * 5, dmg: taiNum * 8, msg: "Delivered a rapid Taijutsu combo!" });

    let genNum = statToNum(player.stats.genjutsu);
    if (genNum >= 8) wheel.push({ name: "Genjutsu Stun", weight: genNum * 3, dmg: 0, stun: true, msg: "Trapped the boss in a Genjutsu! They lose their turn." });

    if (player.inventory["Chakra Blade"] > 0) {
        let kenWeight = player.stats.extraSkill.includes("Kenjutsu") ? 40 : 15;
        wheel.push({ name: "Chakra Blade Slash", weight: kenWeight, dmg: 60, msg: "Sliced through with the Chakra Blade!" });
    }

    if (tagActive) {
        wheel.push({ name: "Explode Tag", weight: 100, dmg: 100, msg: "Detonated the Explosive Tag right on target!" });
        tagActive = false; 
    }

    if (player.inventory["Gunbai"] > 0) wheel.push({ name: "Uchiha Reflection", weight: 20, dmg: 80, msg: "Reflected immense pressure using the Gunbai!" });
    if (player.inventory["Sealing Scroll"] > 0) wheel.push({ name: "Adamantine Chains", weight: 20, dmg: 120, msg: "Bound and crushed them with Uzumaki sealing techniques!" });

    spinWheelVisual(wheel, "Combat Action", (result) => {
        if (result.dmg > 0) {
            activeBoss.hp -= result.dmg;
            logCombat(`<span style='color:#4CAF50;'>[${result.name}]</span> ${result.msg} (${result.dmg} DMG)`);
        } else if (result.stun) {
            logCombat(`<span style='color:#ffcc00;'>[${result.name}]</span> ${result.msg}`);
        } else {
            logCombat(`<span style='color:gray;'>[${result.name}]</span> ${result.msg}`);
        }

        updateCombatUI();

        if (activeBoss.hp > 0) {
            if (result.stun) {
                setTimeout(() => { document.getElementById('combat-actions').classList.remove('hidden'); }, 1000);
            } else {
                groupTurnSequence();
            }
        }
    });
}

function groupTurnSequence() {
    if (!isWorldSaver) {
        setTimeout(bossTurn, 1000);
        return;
    }
    
    setTimeout(() => {
        if (activeBoss.hp <= 0) return;
        if (allies.naruto.hp > 0) {
            let dmg = 150 + Math.floor(Math.random()*50);
            activeBoss.hp -= dmg;
            logCombat(`<span style='color:#f39c12;'>Naruto used Rasenshuriken! (${dmg} DMG)</span>`);
            updateCombatUI();
        }
        
        if (activeBoss.hp <= 0) return;
        
        setTimeout(() => {
            if (allies.sasuke.hp > 0) {
                let dmg = 150 + Math.floor(Math.random()*50);
                activeBoss.hp -= dmg;
                logCombat(`<span style='color:#9b59b6;'>Sasuke used Amaterasu! (${dmg} DMG)</span>`);
                updateCombatUI();
            }
            
            if (activeBoss.hp <= 0) return;
            
            setTimeout(bossTurn, 1500);
        }, 1500);
    }, 1500);
}

function bossTurn() {
    let bossWheel = [
        { name: "Basic Attack", weight: 50, mult: 1, msg: "attacked." },
        { name: "Heavy Attack", weight: 20, mult: 1.5, msg: "used a heavy signature move!" },
        { name: "Miss", weight: 10, mult: 0, msg: "missed their attack." }
    ];

    if (smokeBombActive) {
        bossWheel.push({ name: "Smoke Miss", weight: 100, mult: 0, msg: "was blinded by the smoke and completely missed!" });
        smokeBombActive = false;
    }

    spinWheelVisual(bossWheel, `${activeBoss.name}'s Turn`, (result) => {
        let targets = ["Player"];
        if (isWorldSaver) {
            if (allies.naruto.hp > 0) targets.push("Naruto");
            if (allies.sasuke.hp > 0) targets.push("Sasuke");
        }
        let target = targets[Math.floor(Math.random() * targets.length)];

        if (result.mult > 0) {
            let dmg = Math.floor((activeBoss.minDmg + Math.random() * (activeBoss.maxDmg - activeBoss.minDmg)) * result.mult);
            
            if (target === "Player") {
                if (player.combat.isDefending) {
                    dmg = Math.floor(dmg * 0.3);
                    player.combat.isDefending = false;
                }
                player.combat.hp -= dmg;
            } else if (target === "Naruto") {
                allies.naruto.hp -= dmg;
            } else if (target === "Sasuke") {
                allies.sasuke.hp -= dmg;
            }
            logCombat(`<span style='color:#ff3333;'>${activeBoss.name} ${result.msg} (${dmg} DMG to ${target})</span>`);
        } else {
            logCombat(`<span style='color:gray;'>${activeBoss.name} ${result.msg}</span>`);
        }

        updateCombatUI();
        if(player.combat.hp > 0 || (isWorldSaver && (allies.naruto.hp > 0 || allies.sasuke.hp > 0))) {
            if(activeBoss.hp > 0) document.getElementById('combat-actions').classList.remove('hidden');
        }
    });
}