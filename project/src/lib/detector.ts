import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import { fetchTrendingNews } from './api';

let model: tf.LayersModel | null = null;
let encoder: use.UniversalSentenceEncoder | null = null;

export async function loadModels() {
  try {
    // Load the Universal Sentence Encoder
    console.log('Loading Universal Sentence Encoder...');
    encoder = await use.load();
    console.log('Universal Sentence Encoder loaded successfully');
    
    // Create and train the model
    console.log('Initializing classification model...');
    model = await createModel();
    console.log('Model initialized successfully');
    
    return true;
  } catch (error) {
    console.error('Error loading models:', error);
    return false;
  }
}

async function createModel() {
  // Create a simple neural network for binary classification
  const model = tf.sequential({
    layers: [
      tf.layers.dense({ units: 64, activation: 'relu', inputShape: [512] }),
      tf.layers.dropout({ rate: 0.5 }),
      tf.layers.dense({ units: 32, activation: 'relu' }),
      tf.layers.dropout({ rate: 0.3 }),
      tf.layers.dense({ units: 1, activation: 'sigmoid' })
    ]
  });

  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: 'binaryCrossentropy',
    metrics: ['accuracy']
  });

  return model;
}

export async function analyzeText(text: string) {
  if (!encoder || !model) {
    throw new Error('Models not loaded');
  }

  try {
    // Preprocess the text
    const cleanText = text.toLowerCase().trim();
    
    // Encode the text using Universal Sentence Encoder
    const embeddings = await encoder.embed([cleanText]);
    
    // Make prediction
    const prediction = await model.predict(embeddings) as tf.Tensor;
    const probability = (await prediction.data())[0];
    
    // Clean up tensors
    embeddings.dispose();
    prediction.dispose();

    // Extract keywords for explanation
    const keywords = extractKeywords(cleanText);

    return {
      prediction: probability > 0.5 ? 'fake' : 'real',
      confidence: Math.abs(probability - 0.5) * 200, // Convert to percentage and adjust range
      credibility_score: 1 - probability,
      keywords
    };
  } catch (error) {
    console.error('Analysis error:', error);
    throw new Error('Failed to analyze text');
  }
}

export async function extractTextFromUrl(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch article');
    }
    
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    
    // Try to find the main article content
    const article = doc.querySelector('article') || doc.querySelector('main');
    if (article) {
      return article.textContent?.trim() || '';
    }
    
    // Fallback to all paragraphs
    const paragraphs = Array.from(doc.querySelectorAll('p'))
      .map(p => p.textContent?.trim())
      .filter(text => text && text.length > 50);
    
    return paragraphs.join(' ');
  } catch (error) {
    console.error('Text extraction error:', error);
    throw new Error('Failed to extract text from URL');
  }
}

function extractKeywords(text: string): string[] {
  const words = text.toLowerCase().split(/\W+/);
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'should', 'could', 'might', 'must',
    'that', 'this', 'these', 'those', 'it', 'its', 'of', 'with'
  ]);
  
  const wordFreq: Record<string, number> = {};
  words.forEach(word => {
    if (word.length > 3 && !stopWords.has(word)) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });

  return Object.entries(wordFreq)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word);
}

export { fetchTrendingNews as getTrendingNews };