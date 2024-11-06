// Load the corpus and generate a Markov chain model with positional encoding and multi-head attention
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
      
      // Calculate positional weight for encoding
      const positionWeight = 1 / (i + 1);

      if (!markovChain[key]) {
          markovChain[key] = [];
      }
      
      if (nextWord) {
          markovChain[key].push({ word: nextWord, weight: positionWeight });
      }
  }
  
  return markovChain;
}

// Generate a sentence based on the Markov chain model using multi-head attention
function generateSentenceWithAttention(chain, creativity = 0.7, numHeads = 4) {
  const keys = Object.keys(chain);
  let key = keys[Math.floor(Math.random() * keys.length)];  // Start with a random bigram
  const sentence = key.split(' ');

  for (let i = 0; i < 20; i++) {  // Limit sentence length for control
      const nextWords = chain[key] || [];
      if (nextWords.length === 0) break;

      // Get attention scores for each word using multiple heads
      const attentionScores = calculateAttentionScores(nextWords, numHeads, creativity);
      
      // Select the next word based on the attention-weighted probabilities
      const nextWord = selectWordWithAttention(attentionScores);

      sentence.push(nextWord);
      
      // Update the key to the last bigram for continuity
      key = sentence.slice(-2).join(' ');
  }

  return capitalize(sentence.join(' ')) + '.';
}

// Calculate attention scores for each word using multiple attention heads
function calculateAttentionScores(words, numHeads, creativity) {
  return words.map(wordObj => {
      let attentionScore = 0;

      for (let head = 0; head < numHeads; head++) {
          // Each head gives a score based on position and creativity
          const headFactor = (head + 1) / numHeads;
          attentionScore += headFactor * (wordObj.weight ** creativity);
      }

      return {
          word: wordObj.word,
          score: attentionScore / numHeads  // Average across heads
      };
  });
}

// Select the next word based on weighted attention scores
function selectWordWithAttention(attentionScores) {
  const totalScore = attentionScores.reduce((acc, obj) => acc + obj.score, 0);
  let threshold = Math.random() * totalScore;

  for (const obj of attentionScores) {
      threshold -= obj.score;
      if (threshold <= 0) {
          return obj.word;
      }
  }

  // Fallback in case no selection was made
  return attentionScores[attentionScores.length - 1].word;
}

// Capitalize the first letter of the sentence
function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Display generated text on the page
async function displayGeneratedText() {
  const chain = await loadCorpusAndGenerateModel(2);
  const sentence = generateSentenceWithAttention(chain, 0.7, 4);
  document.getElementById('output').innerText = sentence;
}

// Add event listener to button
document.getElementById('generate-btn').addEventListener('click', displayGeneratedText);
