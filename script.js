const tanah = document.querySelectorAll(".tanah");
const monyet = document.querySelectorAll(".monyet");
const start = document.querySelector("#button");
const papanSkor = document.querySelector(".papan-skor");
const sound = document.querySelector("#sound");
const backsound = document.querySelector("#backsound");
const countdown = document.querySelector(".countdown");

let tanahbefore;
let selesai;
let skor;
let backsoundTimeout;
let countdownInterval;

function updateCountdown(seconds) {
  countdown.textContent = seconds + " detik";
}

function startCountdown() {
  let seconds = 15;

  countdownInterval = setInterval(() => {
    updateCountdown(seconds);
    if (seconds === 0) {
      clearInterval(countdownInterval); // Hentikan countdown jika waktu habis
      countdown.textContent = "Waktu Habis!";
      selesai = true;
      backsound.pause();
      start.textContent = "Main Lagi!";
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
  const waktuRandom = randomWaktu(300, 700);
  random.classList.add("muncul");
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
