let countries = [];
let country1, country2;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let timer = 60;
let countdown;

// Fetch countries from API
async function fetchCountries() {
  try {
    const res = await fetch('https://restcountries.com/v3.1/all');
    const data = await res.json();

    countries = data.map(country => ({
      name: country.name.common,
      population: country.population,
      flag: country.flags && country.flags.png ? country.flags.png : '',
      cca2: country.cca2 // For flag API if needed
    })).filter(c => c.population && c.name && c.flag);

    startGame();
  } catch (error) {
    console.error('Error fetching country data:', error);
  }
}

// Start game
function startGame() {
  score = 0;
  timer = 60;
  updateScoreboard();
  startTimer();
  newRound();
}

// Start countdown
function startTimer() {
  clearInterval(countdown);
  countdown = setInterval(() => {
    timer--;
    document.getElementById('timer').innerText = `Time Left: ${timer}s`;

    if (timer <= 0) {
      clearInterval(countdown);
      endGame("⏰ Time's up!");
    }
  }, 1000);
}

// Get two random different countries
function getTwoCountries() {
  let c1 = countries[Math.floor(Math.random() * countries.length)];
  let c2;
  do {
    c2 = countries[Math.floor(Math.random() * countries.length)];
  } while (c1.name === c2.name);
  return [c1, c2];
}

// Update DOM with new countries
function newRound() {
  [country1, country2] = getTwoCountries();

  document.getElementById('country1-name').innerText = country1.name;
  document.getElementById('country1-pop').innerText = `Population: ${country1.population.toLocaleString()}`;
  document.getElementById('country1-flag').src = country1.flag;

  document.getElementById('country2-name').innerText = country2.name;
  document.getElementById('country2-pop').innerText = '???';
  document.getElementById('country2-flag').src = country2.flag;

  document.getElementById('result').innerText = '';
}

// Handle guess
function handleGuess(direction) {
  const correct =
    (direction === 'Higher' && country2.population > country1.population) ||
    (direction === 'Lower' && country2.population < country1.population);

  document.getElementById('country2-pop').innerText =
    `Population: ${country2.population.toLocaleString()}`;

  if (correct) {
    document.getElementById('result').innerText = '✅ Correct!';
    score++;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('highScore', highScore);
    }
    setTimeout(() => {
      updateScoreboard();
      newRound();
    }, 1000);
  } else {
    endGame('❌ Wrong! Game over.');
  }
}

// Update score and high score
function updateScoreboard() {
  document.getElementById('score').innerText = `Score: ${score}`;
  document.getElementById('high-score').innerText = `High Score: ${highScore}`;
  document.getElementById('timer').innerText = `Time Left: ${timer}s`;
}

// End the game
function endGame(message) {
  clearInterval(countdown);
  document.getElementById('result').innerText = message;
  setTimeout(() => {
    alert(message);
    startGame(); // Restart
  }, 1000);
}

// Event listeners
document.getElementById('higher-btn').addEventListener('click', () => handleGuess('Higher'));
document.getElementById('lower-btn').addEventListener('click', () => handleGuess('Lower'));

// Start everything
fetchCountries();
