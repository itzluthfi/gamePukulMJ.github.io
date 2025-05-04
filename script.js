const tanah = document.querySelectorAll(".tanah");
const monyet = document.querySelectorAll(".monyet");
const start = document.querySelector("#button");
const papanSkor = document.querySelector(".papan-skor");
const sound = document.querySelector("#sound");
const sound2 = document.querySelector("#sound2");

const backsound = document.querySelector("#backsound");
const countdown = document.querySelector(".countdown");
const leaderboard = document.querySelector("#leaderboard");
let history = JSON.parse(localStorage.getItem("leaderboard")) || [];

let tanahbefore;
let selesai;
let skor;
let backsoundTimeout;
let countdownInterval;

const resetButton = document.querySelector("#resetLeaderboard");

resetButton.addEventListener("click", () => {
  // Menghapus leaderboard dari localStorage
  localStorage.removeItem("leaderboard");

  // Menampilkan leaderboard kosong
  history = [];
  tampilkanLeaderboard();
});

function updateCountdown(seconds) {
  countdown.textContent = seconds + " detik";
}

function startCountdown() {
  let seconds = 20;

  countdownInterval = setInterval(() => {
    updateCountdown(seconds);
    if (seconds === 0) {
      clearInterval(countdownInterval); // Hentikan countdown jika waktu habis
      countdown.textContent = "Waktu Habis!";
      selesai = true;
      backsound.pause();
      start.textContent = "Main Lagi!";
      simpanSkorBaru(skor); // simpan skor ke history setelah waktu habis
    } else {
      seconds--;
    }
  }, 1000); // Mengurangi waktu setiap 1 detik (1000 milidetik)
}

function tanahRandom(tanah) {
  let t = Math.floor(Math.random() * tanah.length);
  const random = tanah[t];
  if (random == tanahbefore) {
    tanahRandom(tanah);
  }
  tanahbefore = random;
  return random;
}

function randomWaktu(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function munculkanMonyet() {
  const random = tanahRandom(tanah);
  const waktuRandom = randomWaktu(400, 1500);
  random.classList.add("muncul");
  // Atur ulang dan mainkan suara saat monyet muncul
  sound2.pause(); // hentikan jika sedang dimainkan
  sound2.currentTime = 0.3; // mulai dari awal
  sound2.playbackRate = 1.5; // ubah kecepatan (1 = normal, >1 = cepat, <1 = lambat)
  sound2.play();
  setTimeout(() => {
    random.classList.remove("muncul");
    if (!selesai) {
      backsound.play();
      munculkanMonyet();
    }
  }, waktuRandom);
}

function mulai() {
  console.log("Permainan dimulai!");
  selesai = false;
  skor = 0;
  papanSkor.innerHTML = "score : " + 0;
  updateCountdown(15); // Mulai countdown dari 15 detik
  munculkanMonyet();
  startCountdown(); // Memulai countdown
  // setTimeout(() => {
  //   backsound.pause();
  //   selesai = true;
  //   start.textContent = "Main Lagi";
  // }, 15000);
}
selesai = true;
start.addEventListener("click", () => {
  if (selesai == true) {
    // Jika permainan telah selesai, maka tombol berfungsi untuk memulai permainan baru
    mulai();
    start.textContent = "Berhenti";
    selesai = false;
  } else {
    // Jika permainan sedang berjalan, maka tombol berfungsi untuk menghentikan permainan
    selesai = true;
    start.textContent = "Main Lagi";
    backsound.pause();
    clearInterval(countdownInterval);
    countdown.textContent = "Waktu Habis!";
    // papanSkor.innerHTML = "score : " + 0;
  }
});

function pukul() {
  sound.playbackRate = 5;
  sound.play();

  if (this.parentNode.classList.contains("muncul")) {
    skor++;
  }

  papanSkor.innerHTML = "score : " + skor;

  this.parentNode.classList.remove("muncul");
  this.style.transition = "top 0.1s";
}

monyet.forEach((m) => {
  m.addEventListener("click", pukul);
});

function simpanSkorBaru(skor) {
  const waktu = new Date().toLocaleString();
  history.push({ skor, waktu });

  // Urutkan dari skor tertinggi
  history.sort((a, b) => b.skor - a.skor);

  // Simpan hanya 5 skor tertinggi
  history = history.slice(0, 5);

  localStorage.setItem("leaderboard", JSON.stringify(history));
  tampilkanLeaderboard();
}

function tampilkanLeaderboard() {
  leaderboard.innerHTML = "";
  history.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.skor} poin - ${item.waktu}`;
    leaderboard.appendChild(li);
  });
}

tampilkanLeaderboard();
