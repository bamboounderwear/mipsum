// Load the corpus and generate a Markov chain model with positional encoding
async function loadCorpusAndGenerateModel(n = 2) {
  const response = await fetch('corpus.txt');
  const text = await response.text();
  return buildMarkovChainWithPositionalEncoding(text, n);
}

// Function to build an n-gram Markov chain model with positional encoding
function buildMarkovChainWithPositionalEncoding(text, n = 2) {
  const words = text.split(/\s+/);
  const markovChain = {};

  for (let i = 0; i < words.length - (n - 1); i++) {
      const key = words.slice(i, i + n).join(' ').toLowerCase();
      const nextWord = words[i + n] ? words[i + n].toLowerCase() : null;
      
      // Calculate positional weight
      const positionWeight = 1 / (i + 1);  // Higher weight for words at the start

      if (!markovChain[key]) {
          markovChain[key] = [];
      }
      
      if (nextWord) {
          markovChain[key].push({ word: nextWord, weight: positionWeight });
      }
  }
  
  return markovChain;
}

// Generate a sentence based on the Markov chain model with weighted word selection
function generateSentence(chain, creativity = 0.7) {
  const keys = Object.keys(chain);
  let key = keys[Math.floor(Math.random() * keys.length)];  // Start with a random bigram
  const sentence = key.split(' ');

  for (let i = 0; i < 20; i++) {  // Limit length to control sentence structure
      const nextWords = chain[key] || [];
      if (nextWords.length === 0) break;

      // Calculate weighted selection based on position and creativity
      const nextWord = selectWeightedRandomWord(nextWords, creativity);
      
      sentence.push(nextWord);
      
      // Update the key to the last bigram for continuity
      key = sentence.slice(-2).join(' ');
  }

  return capitalize(sentence.join(' ')) + '.';
}

// Select the next word based on weighted random selection
function selectWeightedRandomWord(words, creativity) {
  const weightedWords = words.map(item => item.weight);
  const totalWeight = weightedWords.reduce((acc, w) => acc + w ** creativity, 0);

  // Select a word based on adjusted weights
  let threshold = Math.random() * totalWeight;
  for (let i = 0; i < words.length; i++) {
      threshold -= (words[i].weight ** creativity);
      if (threshold <= 0) {
          return words[i].word;
      }
  }

  // Fallback to the last word if no selection was made
  return words[words.length - 1].word;
}

// Capitalize the first letter of the sentence
function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Display generated text on the page
async function displayGeneratedText() {
  const chain = await loadCorpusAndGenerateModel(2);
  const sentence = generateSentence(chain, 0.7);
  document.getElementById('output').innerText = sentence;
}

// Add event listener to button
document.getElementById('generate-btn').addEventListener('click', displayGeneratedText);
