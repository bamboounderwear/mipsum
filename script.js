// Load the corpus and generate a Markov chain model using bigrams
async function loadCorpusAndGenerateModel(n = 2) {
  const response = await fetch('corpus.txt');  // Path to corpus file
  const text = await response.text();
  return buildMarkovChain(text, n);
}

// Function to build an n-gram Markov chain model
function buildMarkovChain(text, n = 2) {
  const words = text.split(/\s+/);  // Tokenize by whitespace
  const markovChain = {};

  for (let i = 0; i < words.length - (n - 1); i++) {
      const key = words.slice(i, i + n).join(' ').toLowerCase();
      const nextWord = words[i + n] ? words[i + n].toLowerCase() : null;
      
      if (!markovChain[key]) {
          markovChain[key] = [];
      }
      
      if (nextWord) {
          markovChain[key].push(nextWord);
      }
  }
  
  return markovChain;
}

// Generate a sentence based on the Markov chain model
function generateSentence(chain, creativity = 0.7) {
  const keys = Object.keys(chain);
  let key = keys[Math.floor(Math.random() * keys.length)];  // Start with a random bigram
  const sentence = key.split(' ');  // Initialize sentence with bigram

  // Limit sentence length to prevent infinite loops
  for (let i = 0; i < 20; i++) { 
      const nextWords = chain[key] || [];
      
      if (nextWords.length === 0) break;  // End if no continuation
      
      // Select the next word based on creativity control (weighted randomness)
      const weightedRandomIndex = Math.floor(Math.pow(Math.random(), creativity) * nextWords.length);
      const nextWord = nextWords[weightedRandomIndex];
      
      sentence.push(nextWord);
      
      // Update the key to the last bigram/trigram
      key = sentence.slice(-2).join(' ');  // Using bigram keys for continuity
  }
  
  // Join the sentence array into a coherent sentence with capitalization
  return capitalize(sentence.join(' ')) + '.';
}

// Capitalize the first letter of a sentence
function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Display generated text on the page
async function displayGeneratedText() {
  const chain = await loadCorpusAndGenerateModel(2);  // Use bigrams (2-grams)
  const sentence = generateSentence(chain, 0.7);  // Generate sentence with medium creativity
  document.getElementById('output').innerText = sentence;
}

// Add event listener to button
document.getElementById('generate-btn').addEventListener('click', displayGeneratedText);
