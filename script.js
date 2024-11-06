// Load the corpus and generate a Markov chain model
async function loadCorpusAndGenerateModel() {
  const response = await fetch('corpus.txt');
  const text = await response.text();
  return buildMarkovChain(text);
}

function buildMarkovChain(text) {
  const words = text.split(/\s+/);
  const markovChain = {};

  for (let i = 0; i < words.length - 1; i++) {
    const word = words[i].toLowerCase();
    const nextWord = words[i + 1].toLowerCase();
    if (!markovChain[word]) {
      markovChain[word] = [];
    }
    markovChain[word].push(nextWord);
  }

  return markovChain;
}

function generateSentence(chain) {
  const sentenceStructures = [
    ['subject', 'verb', 'object'],
    ['adjective', 'subject', 'verb', 'object'],
    ['subject', 'verb', 'adverb'],
    ['subject', 'verb', 'preposition', 'object']
  ];
  
  const structure = sentenceStructures[Math.floor(Math.random() * sentenceStructures.length)];
  const sentence = [];
  let word = getRandomStartingWord(chain);

  structure.forEach(part => {
    sentence.push(word);
    word = getNextWord(chain, word);
    if (!word) word = getRandomStartingWord(chain);
  });

  return sentence.join(' ') + '.';
}

function getRandomStartingWord(chain) {
  const words = Object.keys(chain);
  return words[Math.floor(Math.random() * words.length)];
}

function getNextWord(chain, word) {
  const nextWords = chain[word];
  if (!nextWords || nextWords.length === 0) {
    return null;
  }
  return nextWords[Math.floor(Math.random() * nextWords.length)];
}

async function displayGeneratedText() {
  const chain = await loadCorpusAndGenerateModel();
  const sentence = generateSentence(chain);
  document.getElementById('output').innerText = sentence;
}

document.getElementById('generate-btn').addEventListener('click', displayGeneratedText);
