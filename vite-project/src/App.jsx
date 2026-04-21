import React, { useState, useEffect } from 'react';

const FIELDS = [
  { key: 'id', label: 'ID', icon: '🆔', index: 1 },
  { key: 'pris_en_charge', label: 'Pris en charge', icon: '👤', index: 2 },
  { key: 'source_rdv', label: 'Source de RDV', icon: '📍', index: 4 },
  { key: 'num_dossier', label: 'Num de dossier', icon: '📂', index: 6 },
  { key: 'date_signature', label: 'Date de signature', icon: '📅', index: 8 },
  { key: 'entreprise', label: 'Entreprise', icon: '🏢', index: 10 },
  { key: 'siret', label: 'Siret', icon: '🔢', index: 11 },
  { key: 'opco', label: 'OPCO', icon: '🏦', index: 13 },
  { key: 'formation', label: 'Formation', icon: '🎓', index: 12 },
  { key: 'prix_formation', label: 'Prix de Formations', icon: '💰', index: 15 },
  { key: 'duree', label: 'Durée (H)', icon: '⏳', index: 14 },
];

function App() {
  const [inputText, setInputText] = useState('');
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [parsedData, setParsedData] = useState({});

  useEffect(() => {
    if (inputText.trim()) {
      parseInput(inputText);
    } else {
      setGeneratedMessage('');
      setParsedData({});
    }
  }, [inputText]);

  const parseInput = (text) => {
    // Take only the first row and split by tabs
    const values = text.split('\n')[0].split('\t').map(v => v.trim());
    
    const data = {};
    FIELDS.forEach((field) => {
      data[field.key] = values[field.index] || '---';
    });

    setParsedData(data);

    // Format WhatsApp Message
    let message = ``;
    FIELDS.forEach(field => {
      message += `*${field.label}*: ${data[field.key]}\n`;
    });
    
    setGeneratedMessage(message);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setInputText('');
    setCopied(false);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center">
      <header className="w-full max-w-4xl mb-12 animate-fade-in text-center">
        <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
          WhatsApp Generator
        </h1>
        <p className="text-slate-400 text-lg">Collez une ligne de votre sheet pour générer le message</p>
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        {/* Input Section */}
        <section className="glass-card rounded-3xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="w-2 h-6 bg-primary rounded-full"></span>
              Pâte de données
            </h2>
            <button 
              onClick={clearAll}
              className="text-slate-400 hover:text-white transition-colors text-sm font-medium px-3 py-1 rounded-lg hover:bg-white/5"
            >
              Effacer
            </button>
          </div>
          
          <textarea
            className="flex-1 min-h-[300px] bg-slate-900/50 border border-slate-700/50 rounded-2xl p-4 text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-600 font-mono text-sm"
            placeholder="Copiez une ligne de Google Sheets et collez-la ici..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          
          <div className="text-xs text-slate-500 italic">
            * Les données sont traitées localement et ne sont jamais enregistrées.
          </div>
        </section>

        {/* Preview Section */}
        <section className="flex flex-col gap-4">
          <div className="glass-card rounded-3xl p-6 flex-col flex-1 h-full relative overflow-hidden">
            {/* WhatsApp Mockup Interface */}
            <div className="absolute top-0 left-0 right-0 h-14 bg-slate-800/80 backdrop-blur-md flex items-center px-6 gap-3 border-b border-white/5 z-10">
              <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-xs">🤖</div>
              <div>
                <div className="text-sm font-bold">WhatsApp Preview</div>
                <div className="text-[10px] text-secondary">en ligne</div>
              </div>
            </div>

            <div className="mt-16 mb-4 flex-1 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-[length:400px] rounded-2xl p-4 overflow-y-auto max-h-[500px]">
              {generatedMessage ? (
                <div className="bg-[#0b141a] text-[#e9edef] p-4 rounded-xl rounded-tl-none shadow-lg max-w-[90%] animate-fade-in relative group">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {generatedMessage.split('\n').map((line, i) => (
                      <div key={i}>
                        {line.split('*').map((part, j) => (
                          j % 2 === 1 ? <b key={j}>{part}</b> : part
                        ))}
                      </div>
                    ))}
                  </pre>
                  <div className="text-[10px] text-slate-400 text-right mt-1">13:37 ✓✓</div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500 italic text-sm">
                  Rien à afficher pour le moment
                </div>
              )}
            </div>

            {generatedMessage && (
              <button
                onClick={copyToClipboard}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 ${
                  copied 
                    ? 'bg-secondary text-white animate-success' 
                    : 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20'
                }`}
              >
                {copied ? (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                    Copié !
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Copier le Message
                  </>
                )}
              </button>
            )}
          </div>
        </section>
      </main>

      <footer className="mt-auto py-8 text-slate-500 text-sm">
        Built with ❤️ for Funnebooster team
      </footer>
    </div>
  );
}

export default App;
