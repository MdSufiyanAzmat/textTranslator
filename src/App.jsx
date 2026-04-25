import React, { useState } from 'react';
import './App.css'

const Translator = () => {
  const [inputText, setInputText] = useState('');
  const [resultText, setResultText] = useState('');
  const [targetLang, setTargetLang] = useState('es');
  const [loading, setLoading] = useState(false);

  const languages = [
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ja', name: 'Japanese' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ar', name: 'Arabic' }
  ];

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    
    setLoading(true);
    
    try {
      // Using MyMemory API - completely free, no API key required
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(inputText)}&langpair=en|${targetLang}`
      );

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      
      // MyMemory returns the translation in responseData.translatedText
      let translatedText = data.responseData.translatedText;
      
      // Sometimes MyMemory returns the original text if no translation found
      if (translatedText === inputText) {
        translatedText = "Translation not found. Please try different text.";
      }
      
      setResultText(translatedText);
      
    } catch (error) {
      console.error("Translation error:", error);
      setResultText("Error: Could not fetch translation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white font-sans">
      <div className="w-full max-w-2xl bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
        <h1 className="text-3xl font-bold text-center mb-8 bg-linear-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          AI Translator
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="flex flex-col gap-4">
            <label className="text-sm font-medium text-slate-400">English Input</label>
            <textarea
              className="w-full h-40 p-4 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
              placeholder="Type something in English..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>

          {/* Output Section */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-slate-400">Translation</label>
              <select 
                className="bg-slate-700 text-xs rounded-md px-2 py-1 outline-none border border-slate-600"
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>
            <div className="w-full h-40 p-4 bg-slate-700/50 border border-slate-700 rounded-xl overflow-auto text-slate-200">
              {loading ? (
                <div className="animate-pulse flex space-x-2">
                  <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                  <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                  <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                </div>
              ) : (
                resultText || <span className="text-slate-500 italic">Your translation will appear here...</span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleTranslate}
          disabled={loading || !inputText.trim()}
          className="w-full mt-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 rounded-xl font-semibold tracking-wide transition-colors shadow-lg shadow-blue-900/20"
        >
          {loading ? 'Translating...' : 'Translate Now'}
        </button>
      </div>
    </div>
  );
};

export default Translator;