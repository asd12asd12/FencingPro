import { createFileRoute } from "@tanstack/react-router";
import { Theme } from "../shared/types/Themes";
import { useAuth } from "../context/AuthContext";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/")({
  component: FencingTournament,
});

function FencingTournament() {
  const { theme, setTheme } = useAuth();
  const [step, setStep] = useState<"setup" | "names" | "pool" | "bracket">("setup");
  const [playerCount, setPlayerCount] = useState(5);
  const [names, setNames] = useState<string[]>(Array(12).fill(""));
  const [scores, setScores] = useState<Record<string, number>>({});

  const currentTheme = useMemo(() => 
    Theme.find((t) => t.name === theme)?.config || Theme[0].config, 
  [theme]);

  const stats = useMemo(() => {
    return Array.from({ length: playerCount }).map((_, i) => {
      let wins = 0, hs = 0, hr = 0;
      for (let j = 0; j < playerCount; j++) {
        if (i === j) continue;
        const s1 = scores[`${i}-${j}`] || 0;
        const s2 = scores[`${j}-${i}`] || 0;
        hs += s1; hr += s2;
        if (s1 > s2) wins++;
      }
      return { id: i, name: names[i] || `Боец ${i+1}`, wins, hs, hr, ind: hs - hr };
    });
  }, [scores, playerCount, names]);

  const rankedPlayers = [...stats].sort((a, b) => b.wins - a.wins || b.ind - a.ind);

  return (
    <div className={`min-h-screen ${currentTheme.mainContentBg} ${currentTheme.mainContentText} pb-10 transition-colors font-sans`}>
      <header className={`flex items-center justify-between p-4 border-b-2 ${currentTheme.mainContentBorder} ${currentTheme.sidebarBg}`}>
        <h1 className="text-xl font-black uppercase italic">Fencing Pro</h1>
        <button onClick={() => setTheme(theme === "Светлая тема" ? "Тёмная тема" : "Светлая тема")} className="text-2xl">
          {theme === "Светлая тема" ? "🌙" : "☀️"}
        </button>
      </header>

      <main className="p-4">
        {/* 1. ВЫБОР КОЛИЧЕСТВА */}
        {step === "setup" && (
          <div className="flex flex-col items-center py-10 space-y-6">
            <h2 className="text-2xl font-bold uppercase text-center">Сколько бойцов?</h2>
            <div className="grid grid-cols-4 gap-3">
              {[5,6,7,8,9,10,11,12].map(n => (
                <button key={n} onClick={() => {setPlayerCount(n); setStep("names")}} className="w-14 h-14 text-lg font-black border-2 rounded-xl active:scale-90 transition-transform bg-white text-black">
                  {n}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 2. ИМЕНА */}
        {step === "names" && (
          <div className="max-w-md mx-auto space-y-4">
            <h2 className="text-xl font-black uppercase">Введите имена:</h2>
            {Array.from({ length: playerCount }).map((_, i) => (
              <input key={i} placeholder={`Боец №${i+1}`} value={names[i]} 
                onChange={e => { const n = [...names]; n[i] = e.target.value; setNames(n); }} 
                className="w-full p-4 border-2 rounded-2xl text-black font-bold text-lg" />
            ))}
            <button onClick={() => setStep("pool")} className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl uppercase">К пульке (до 5)</button>
          </div>
        )}

        {/* 3. ПУЛЬКА (ТАБЛИЦА) */}
        {step === "pool" && (
          <div className="space-y-6">
            <h2 className="text-xl font-black uppercase text-center">Протокол</h2>
            <div className="overflow-x-auto rounded-xl border-2 border-black">
              <table className="w-full bg-white text-black text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">№</th>
                    <th className="p-2 border text-left">Имя</th>
                    {Array.from({ length: playerCount }).map((_, i) => <th key={i} className="p-2 border">{i+1}</th>)}
                    <th className="p-2 border bg-yellow-50">V</th>
                    <th className="p-2 border bg-blue-50">+/-</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map((p, i) => (
                    <tr key={i} className="font-bold">
                      <td className="p-2 border text-center bg-gray-50">{i+1}</td>
                      <td className="p-2 border truncate max-w-[100px]">{p.name}</td>
                      {Array.from({ length: playerCount }).map((_, j) => (
                        <td key={j} className={`p-0 border ${i === j ? 'bg-gray-800' : ''}`}>
                          {i !== j && (
                            <input type="number" value={scores[`${i}-${j}`] || ""} 
                              onChange={e => setScores({...scores, [`${i}-${j}`]: Math.min(Number(e.target.value), 5)})}
                              className="w-full h-10 text-center text-lg outline-none" />
                          )}
                        </td>
                      ))}
                      <td className="p-2 border text-center bg-yellow-50">{p.wins}</td>
                      <td className={`p-2 border text-center ${p.ind >= 0 ? 'text-green-600' : 'text-red-500'}`}>{p.ind}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={() => setStep("bracket")} className="w-full py-5 bg-black text-white font-black rounded-2xl uppercase">К олимпийке (до 15)</button>
          </div>
        )}

        {/* 4. ОЛИМПИЙКА (РУЧНАЯ) */}
        {step === "bracket" && (
          <div className="space-y-6 max-w-lg mx-auto">
            <h2 className="text-2xl font-black uppercase text-center">Сетка на 15</h2>
            
            {/* Памятка по рейтингу */}
            <div className="p-3 bg-gray-200 rounded-xl flex flex-wrap gap-2 text-[10px] text-black">
                {rankedPlayers.map((p, i) => <span key={i}>#{i+1} {p.name}({p.ind})</span>)}
            </div>

            <div className="space-y-4">
              {[1, 2, 3, 4].map(num => (
                <div key={num} className="p-4 bg-white border-2 border-black rounded-3xl shadow-lg space-y-3 text-black">
                  <div className="text-[10px] font-bold opacity-30 text-center">ПАРА №{num}</div>
                  <div className="flex items-center gap-2">
                    <select className="flex-1 p-3 bg-gray-100 rounded-xl font-bold">
                      <option>-- Боец --</option>
                      {names.filter(n => n !== "").map((n, i) => <option key={i}>{n}</option>)}
                    </select>
                    <input type="number" placeholder="0" className="w-14 h-12 text-center border-2 rounded-xl font-black text-xl" />
                  </div>
                  <div className="flex items-center gap-2">
                    <select className="flex-1 p-3 bg-gray-100 rounded-xl font-bold">
                      <option>-- Боец --</option>
                      {names.filter(n => n !== "").map((n, i) => <option key={i}>{n}</option>)}
                    </select>
                    <input type="number" placeholder="0" className="w-14 h-12 text-center border-2 rounded-xl font-black text-xl" />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setStep("pool")} className="w-full py-3 opacity-50 font-bold uppercase">Назад в таблицу</button>
          </div>
        )}
      </main>
    </div>
  );
}