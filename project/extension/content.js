// This script runs in the context of web pages
// It can interact with the page's DOM and communicate with the popup

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractContent') {
    const content = extractPageContent();
    sendResponse(content);
  }
});

function extractPageContent() {
  // Find the main article content
  const article = document.querySelector('article') || document.querySelector('main');
  
  // Fallback to all paragraphs if no article element is found
  const paragraphs = Array.from(document.querySelectorAll('p'))
    .map(p => p.textContent.trim())
    .filter(text => text.length > 50); // Filter out short paragraphs
  
  return {
    title: document.title,
    content: article ? article.textContent : paragraphs.join(' '),
    url: window.location.href,
    // Add metadata if available
    author: getMetaContent('author'),
    publishDate: getMetaContent('publishedTime') || getMetaContent('date'),
    source: getMetaContent('site_name') || window.location.hostname
  };
}

function getMetaContent(name) {
  const meta = document.querySelector(`meta[name="${name}"], meta[property="og:${name}"]`);
  return meta ? meta.content : null;
}