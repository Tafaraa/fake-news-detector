let currentTab = null;
let currentView = 'analyze';
let model = null;
let encoder = null;

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  currentTab = tab;

  // Initialize theme
  const theme = await chrome.storage.local.get('theme');
  setTheme(theme.theme || 'light');

  // Initialize navigation
  setupNavigation();
  setupThemeToggle();
  setupBackButton();
  
  // Load ML models
  await loadModels();
  
  // Load trending news
  loadTrendingNews();
  
  // Load history
  loadHistory();

  document.getElementById('analyze-page').addEventListener('click', analyzePage);
});

async function loadModels() {
  try {
    // Load Universal Sentence Encoder
    encoder = await use.load();
    
    // Load custom model (replace with your model URL)
    model = await tf.loadLayersModel('https://your-model-url/model.json');
    
    return true;
  } catch (error) {
    console.error('Error loading models:', error);
    return false;
  }
}

function setupBackButton() {
  const backButton = document.getElementById('back-button');
  backButton.addEventListener('click', () => {
    showView('analyze');
  });
}

function showView(view) {
  const backButton = document.getElementById('back-button');
  
  // Update navigation buttons
  document.querySelectorAll('.nav-button').forEach(btn => {
    btn.classList.remove('active');
  });
  document.getElementById(`nav-${view}`).classList.add('active');

  // Show/hide back button
  backButton.classList.toggle('hidden', view === 'analyze');

  // Hide all views
  document.querySelectorAll('.view').forEach(v => {
    v.classList.add('hidden');
  });

  // Show selected view
  document.getElementById(`${view}-view`).classList.remove('hidden');
  currentView = view;
}

async function analyzePage() {
  if (!currentTab || !encoder || !model) return;

  showLoading(true);

  try {
    // Extract content
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: currentTab.id },
      function: extractPageContent,
    });

    if (!result.content) {
      throw new Error('No content found');
    }

    // Encode text using Universal Sentence Encoder
    const embeddings = await encoder.embed(result.content);
    
    // Make prediction
    const prediction = await model.predict(embeddings).data();
    
    // Get confidence score
    const confidence = Math.max(...prediction) * 100;
    
    // Extract keywords
    const keywords = await extractKeywords(result.content);

    const analysis = {
      prediction: prediction[1] > 0.5 ? 'fake' : 'real',
      confidence,
      keywords,
      url: result.url,
      title: result.title
    };

    showResult(analysis);
    
    // Send browser notification for suspicious content
    if (analysis.prediction === 'fake' && analysis.confidence > 70) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'Suspicious Content Detected',
        message: `This article has been flagged as potentially fake news with ${analysis.confidence.toFixed(1)}% confidence.`
      });
    }
  } catch (error) {
    showError('Failed to analyze page');
  } finally {
    showLoading(false);
  }
}

async function extractKeywords(text) {
  // Simple keyword extraction (replace with more sophisticated algorithm)
  const words = text.toLowerCase().split(/\W+/);
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for']);
  
  const wordFreq = {};
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

// ... rest of existing functions ...

function showResult(analysis) {
  const result = document.getElementById('result');
  result.innerHTML = `
    <div class="prediction">
      ${analysis.prediction === 'real' ? getCheckIcon() : getAlertIcon()}
      <h2>${analysis.prediction === 'real' ? 'Real News' : 'Fake News'}</h2>
    </div>
    
    <div class="confidence">
      <div class="confidence-bar">
        <div id="confidence-level" style="
          width: ${analysis.confidence}%;
          background-color: var(${analysis.prediction === 'real' ? '--success-color' : '--error-color'})
        "></div>
      </div>
      <div class="confidence-text">${analysis.confidence.toFixed(1)}% confidence</div>
    </div>
    
    <div class="keywords">
      <h3>Key Indicators</h3>
      <div id="keywords-list">
        ${analysis.keywords.map(keyword => `
          <span class="keyword">${keyword}</span>
        `).join('')}
      </div>
    </div>
    
    <div class="actions mt-4">
      <button class="button secondary" id="share-result">
        Share Analysis
      </button>
    </div>
  `;

  // Add share functionality
  document.getElementById('share-result')?.addEventListener('click', () => {
    const text = `Fake News Analysis for "${analysis.title}"\n` +
      `Verdict: ${analysis.prediction} (${analysis.confidence.toFixed(1)}% confidence)\n` +
      `Key indicators: ${analysis.keywords.join(', ')}\n` +
      `Analyzed with Fake News Detector`;
    
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Analysis copied to clipboard');
    });
  });

  result.classList.remove('hidden');
  
  // Save to history
  saveToHistory(analysis);
}

async function saveToHistory(analysis) {
  const history = await chrome.storage.local.get('analysisHistory');
  const analysisHistory = history.analysisHistory || [];
  
  analysisHistory.unshift({
    ...analysis,
    timestamp: new Date().toISOString()
  });

  // Keep only last 50 items
  if (analysisHistory.length > 50) {
    analysisHistory.pop();
  }

  await chrome.storage.local.set({ analysisHistory });
  
  // Refresh history view if it's currently shown
  if (currentView === 'history') {
    loadHistory();
  }
}