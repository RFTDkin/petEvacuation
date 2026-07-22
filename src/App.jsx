import React, { useState, useEffect } from 'react';
import scenarioData from './data/scenario.json';
import { AlertTriangle, Home, CheckCircle2, XCircle } from 'lucide-react';

export default function App() {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameClear, setIsGameClear] = useState(false);
  const [feedback, setFeedback] = useState(null); // { isCorrect: boolean, text: string }
  const [showQuestionPopup, setShowQuestionPopup] = useState(false);
  
  // Preload
  useEffect(() => {
    scenarioData.forEach((scene) => {
      if (scene.image) {
        const img = new Image();
        img.src = scene.image;
      }
    });
  }, []);

  const handleOptionClick = (option) => {
    setFeedback({
      isCorrect: option.isCorrect,
      isNeutral: option.isNeutral,
      text: option.explanation
    });

    setTimeout(() => {
      setFeedback(null);
      setShowQuestionPopup(false);
      if (option.nextScene === 'end_good') {
        setIsGameClear(true);
      } else if (option.nextScene === 'restart') {
        restartGame();
      } else if (option.nextScene && option.nextScene !== currentScene.id) {
        const nextIndex = scenarioData.findIndex(s => s.id === option.nextScene);
        if (nextIndex !== -1) setCurrentSceneIndex(nextIndex);
      }
    }, 3000);
  };

  const handleNextBtnClick = () => {
    if (currentScene.type === 'question') {
      setShowQuestionPopup(true);
    } else {
      if (currentScene.nextScene === 'end_good') {
        setIsGameClear(true);
      } else if (currentScene.nextScene === 'restart') {
        restartGame();
      } else {
        const nextIndex = scenarioData.findIndex(s => s.id === currentScene.nextScene);
        if (nextIndex !== -1) setCurrentSceneIndex(nextIndex);
      }
    }
  };

  const restartGame = () => {
    setCurrentSceneIndex(0);
    setIsGameOver(false);
    setIsGameClear(false);
    setFeedback(null);
    setShowQuestionPopup(false);
  };

  if (isGameClear) {
    return (
      <div className="app-container">
        <div className="card result-card success-card">
          <CheckCircle2 size={64} className="icon-success" />
          <h1>避難完了！</h1>
          <p>無事に愛犬と一緒に避難所へ避難することができました。</p>
          <div className="knowledge-base">
            <h2>📚 防災メモ</h2>
            <ul>
              <li>ペットの避難用品（クレート、リード、フード等）は日頃から準備しておきましょう。</li>
              <li>避難所でのルールを守り、周囲への配慮を忘れないようにしましょう。</li>
              <li>普段からクレートに入る練習をしておくと安心です。</li>
            </ul>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%', maxWidth: '300px' }}>
            <button className="primary-btn" onClick={restartGame}>もう一度プレイする</button>
            <button 
              className="option-btn" 
              onClick={() => {
                setIsGameClear(false);
                const nextIndex = scenarioData.findIndex(s => s.id === 'bad_1');
                if (nextIndex !== -1) setCurrentSceneIndex(nextIndex);
              }}
              style={{ textAlign: 'center', borderColor: '#e74c3c', color: '#e74c3c' }}
            >
              バッドエンドもやってみる
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentScene = scenarioData[currentSceneIndex];

  return (
    <div className="app-container">
      <header className="app-header">
        <AlertTriangle className="header-icon" />
        <h1>ペット防災シミュレーション</h1>
      </header>

      <main className="main-content">
        <div className="scene-card fade-in">
          
          <div className={`image-container ${currentScene.shake ? 'shake-animation' : ''}`}>
            <img src={currentScene.image} alt={currentScene.title} className="scene-image" />
          </div>
          
          <div className="scene-content">
            <h2 className="scene-title">{currentScene.title}</h2>
            <p className="scene-description">{currentScene.description}</p>
          </div>

          <div className="options-container">
            <button 
              className="option-btn primary-btn"
              onClick={handleNextBtnClick}
            >
              次へ
            </button>
          </div>
        </div>

        {showQuestionPopup && currentScene.type === 'question' && (
          <div className="popup-overlay">
            <div className="popup-content zoom-in">
              <h3 className="popup-question">{currentScene.question}</h3>
              <div className="popup-options">
                {currentScene.options.map((option) => (
                  <button 
                    key={option.id} 
                    className="option-btn popup-option-btn"
                    onClick={() => handleOptionClick(option)}
                    disabled={feedback !== null}
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {feedback && (
          <div className={`feedback-overlay ${feedback.isNeutral ? 'feedback-neutral' : (feedback.isCorrect ? 'feedback-correct' : 'feedback-incorrect')}`}>
            <div className="feedback-content zoom-in">
              {!feedback.isNeutral && (feedback.isCorrect ? <CheckCircle2 size={48} /> : <XCircle size={48} />)}
              {!feedback.isNeutral && <h3>{feedback.isCorrect ? '正解！' : '不正解...'}</h3>}
              <p>{feedback.text}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}