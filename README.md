# Fake News Detector

![Fake News Detector](project/public/images/news-background.svg)

A modern web application that uses machine learning to detect fake news articles. Built with React, TypeScript, TensorFlow.js, and Tailwind CSS.

## 🚀 Features

- **AI-Powered Analysis**: Uses TensorFlow.js and Universal Sentence Encoder to analyze news content
- **URL Support**: Analyze articles directly from URLs
- **Trending News**: View trending articles with credibility scores
- **Analysis History**: Keep track of previously analyzed articles
- **Responsive Design**: Works on desktop and mobile devices
- **Offline Capability**: Runs entirely in the browser with no backend dependencies

## 📸 Screenshots

![Screenshot of the Fake News Detector](screenshot.png)

## 🔧 Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS
- **Machine Learning**: TensorFlow.js, Universal Sentence Encoder
- **State Management**: React Hooks
- **UI Components**: Lucide React (icons)
- **Notifications**: React Hot Toast
- **Local Storage**: Browser localStorage for persistence

## 🛠️ Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/fake-news-detector.git
   cd fake-news-detector
   ```

2. Install dependencies:
   ```bash
   cd project
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## 🧠 How It Works

The Fake News Detector uses a pre-trained machine learning model based on the Universal Sentence Encoder to analyze text content. The model evaluates various linguistic features and patterns commonly found in fake news articles.

Key indicators analyzed include:
- Sensationalist language
- Emotional tone
- Source credibility
- Content consistency
- Factual accuracy markers

## 🔒 Privacy

This application runs entirely in your browser. No article content or analysis results are sent to any external servers. All data is stored locally on your device using browser localStorage.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [TensorFlow.js](https://www.tensorflow.org/js) for browser-based machine learning
- [Universal Sentence Encoder](https://github.com/tensorflow/tfjs-models/tree/master/universal-sentence-encoder) for text embeddings
- [React](https://reactjs.org/) for the UI framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide React](https://lucide.dev/) for beautiful icons
