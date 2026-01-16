import { createFileRoute } from "@tanstack/react-router";
import { Theme } from "../shared/types/Themes";
import { useAuth } from "../context/AuthContext";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/")({
  component: FencingTournament,
});

function FencingTournament() {
  const { theme, setTheme } = useAuth();
  const [step, setStep] = useState<"setup" | "names" | "pool" | "bracket">(
    "setup"
  );
  const [playerCount, setPlayerCount] = useState(5);
  const [names, setNames] = useState<string[]>(Array(12).fill(""));
  const [scores, setScores] = useState<Record<string, number>>({});

  const currentTheme = useMemo(
    () => Theme.find((t) => t.name === theme)?.config || Theme[0].config,
    [theme]
  );

  const logoSrc = theme === "Тёмная тема" ? "/log.jpg" : "/Logo.jpg";

  // Расчет статистики
  const stats = useMemo(() => {
    return Array.from({ length: playerCount }).map((_, i) => {
      let wins = 0,
        hs = 0,
        hr = 0;
      for (let j = 0; j < playerCount; j++) {
        if (i === j) continue;
        const s1 = scores[`${i}-${j}`] || 0;
        const s2 = scores[`${j}-${i}`] || 0;
        hs += s1;
        hr += s2;
        // В фехтовании победа в пульке - это когда набрал больше, чем соперник
        if (s1 > s2) wins++;
      }
      return {
        id: i,
        name: names[i] || `Боец ${i + 1}`,
        wins,
        hs,
        hr,
        ind: hs - hr,
      };
    });
  }, [scores, playerCount, names]);

  // Сортировка для сетки
  const rankedPlayers = [...stats].sort(
    (a, b) => b.wins - a.wins || b.ind - a.ind
  );

  const updateScore = (p1: number, p2: number, val: string) => {
    const num = Math.min(parseInt(val) || 0, 5);
    setScores((prev) => ({ ...prev, [`${p1}-${p2}`]: num }));
  };

  return (
    <div
      className={`min-h-screen ${currentTheme.mainContentBg} ${currentTheme.mainContentText} transition-colors font-sans`}
    >
      <header
        className={`flex items-center justify-between p-4 border-b-2 ${currentTheme.mainContentBorder} ${currentTheme.sidebarBg}`}
      >
        <div className="flex items-center gap-3">
          <img src={logoSrc} alt="Logo" className="h-10 w-auto" />
          <h1 className="text-xl font-black uppercase italic italic">
            Fencing Pro
          </h1>
        </div>
        <button
          onClick={() =>
            setTheme(theme === "Светлая тема" ? "Тёмная тема" : "Светлая тема")
          }
          className="p-2 border rounded-full"
        >
          {theme === "Светлая тема" ? "🌙" : "☀️"}
        </button>
      </header>

      <main className="p-4 max-w-[100vw]">
        {step === "setup" && (
          <div className="text-center py-20 space-y-6">
            <h2 className="text-3xl font-black uppercase">Выбор участников</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                <button
                  key={n}
                  onClick={() => {
                    setPlayerCount(n);
                    setStep("names");
                  }}
                  className="w-16 h-16 text-xl font-bold border-2 rounded-2xl hover:bg-blue-600 hover:text-white transition-all"
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "names" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl font-black uppercase">Имена бойцов</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: playerCount }).map((_, i) => (
                <input
                  key={i}
                  placeholder={`Боец ${i + 1}`}
                  value={names[i]}
                  onChange={(e) => {
                    const n = [...names];
                    n[i] = e.target.value;
                    setNames(n);
                  }}
                  className="p-4 border-2 rounded-xl text-black font-bold outline-blue-500"
                />
              ))}
            </div>
            <button
              onClick={() => setStep("pool")}
              className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl uppercase shadow-lg"
            >
              Начать пульку (до 5)
            </button>
          </div>
        )}

        {step === "pool" && (
          <div className="space-y-8">
            <h2 className="text-2xl font-black uppercase text-center italic">
              Протокол пульки
            </h2>

            <div className="overflow-x-auto shadow-2xl rounded-xl border-2 border-black">
              <table className="w-full border-collapse bg-white text-black">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-2 border border-gray-400 text-xs">№</th>
                    <th className="p-2 border border-gray-400 text-left min-w-[150px]">
                      Фамилия Имя
                    </th>
                    {Array.from({ length: playerCount }).map((_, i) => (
                      <th
                        key={i}
                        className="p-2 border border-gray-400 w-12 text-center"
                      >
                        {i + 1}
                      </th>
                    ))}
                    <th className="p-2 border border-gray-400 bg-yellow-100 w-10">
                      V
                    </th>
                    <th className="p-2 border border-gray-400 w-10">Ind</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map((player, i) => (
                    <tr key={i} className="font-bold">
                      <td className="p-2 border border-gray-300 text-center bg-gray-50">
                        {i + 1}
                      </td>
                      <td className="p-2 border border-gray-300 truncate">
                        {player.name}
                      </td>
                      {Array.from({ length: playerCount }).map((_, j) => (
                        <td
                          key={j}
                          className={`p-0 border border-gray-300 text-center ${
                            i === j ? "bg-gray-800" : ""
                          }`}
                        >
                          {i !== j && (
                            <input
                              type="number"
                              className="w-full h-10 text-center bg-transparent outline-none focus:bg-yellow-100 text-lg"
                              value={scores[`${i}-${j}`] || ""}
                              onChange={(e) =>
                                updateScore(i, j, e.target.value)
                              }
                            />
                          )}
                        </td>
                      ))}
                      <td className="p-2 border border-gray-300 text-center bg-yellow-50 text-xl">
                        {player.wins}
                      </td>
                      <td
                        className={`p-2 border border-gray-300 text-center ${
                          player.ind >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {player.ind > 0 ? `+${player.ind}` : player.ind}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep("names")}
                className="px-6 py-4 border-2 rounded-xl font-bold uppercase"
              >
                Имена
              </button>
              <button
                onClick={() => setStep("bracket")}
                className="flex-1 py-4 bg-black text-white font-black rounded-xl uppercase tracking-widest"
              >
                Перейти к Олимпийке (до 15)
              </button>
            </div>
          </div>
        )}

        {/* ШАГ 4: СЕТКА (Олимпийка) — РУЧНАЯ РАССТАНОВКА */}
        {step === "bracket" && (
          <div className="space-y-10 animate-in slide-in-from-right duration-500">
            <h2 className="text-3xl font-black uppercase text-center italic">
              Прямое выбывание (до 15)
            </h2>

            {/* Таблица результатов пульки для справки (чтобы видеть, кто на каком месте) */}
            <div className="bg-gray-100 p-4 rounded-xl text-black">
              <p className="text-xs font-bold opacity-50 mb-2">
                РЕЙТИНГ ПОСЛЕ ПУЛЬКИ:
              </p>
              <div className="flex flex-wrap gap-2">
                {rankedPlayers.map((p, idx) => (
                  <div
                    key={p.id}
                    className="bg-white px-2 py-1 rounded border border-gray-300 text-xs"
                  >
                    <span className="font-black text-blue-600">#{idx + 1}</span>{" "}
                    {p.name} ({p.wins}V)
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-8 overflow-x-auto pb-10 items-start justify-center">
              {/* 1/4 ФИНАЛА — ТУТ ТЫ ВЫБИРАЕШЬ САМ */}
              <div className="flex flex-col gap-6 min-w-[260px]">
                <p className="text-center font-black opacity-40 text-sm">
                  1/4 ФИНАЛА (ВЫБЕРИ ПАРЫ)
                </p>
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl border-2 border-black bg-white text-black shadow-lg space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <select className="flex-1 p-2 bg-gray-50 border rounded font-bold text-sm">
                          <option value="">-- Выбрать бойца --</option>
                          {names
                            .filter((n) => n !== "")
                            .map((name, idx) => (
                              <option key={idx} value={name}>
                                {name}
                              </option>
                            ))}
                        </select>
                        <input
                          type="number"
                          className="w-12 h-10 text-center font-black border-2 rounded text-lg"
                          placeholder="0"
                          max="15"
                        />
                      </div>
                      <div className="text-center text-xs font-black text-red-500">
                        VS
                      </div>
                      <div className="flex items-center gap-2">
                        <select className="flex-1 p-2 bg-gray-50 border rounded font-bold text-sm">
                          <option value="">-- Выбрать бойца --</option>
                          {names
                            .filter((n) => n !== "")
                            .map((name, idx) => (
                              <option key={idx} value={name}>
                                {name}
                              </option>
                            ))}
                        </select>
                        <input
                          type="number"
                          className="w-12 h-10 text-center font-black border-2 rounded text-lg"
                          placeholder="0"
                          max="15"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ПОЛУФИНАЛ */}
              <div className="flex flex-col gap-32 pt-24 min-w-[240px]">
                <p className="text-center font-black opacity-30 text-sm">
                  ПОЛУФИНАЛ
                </p>
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl border-4 border-blue-500 bg-blue-50 text-black shadow-md"
                  >
                    <select className="w-full p-1 mb-2 bg-transparent font-bold border-b border-blue-200">
                      <option>Победитель пары</option>
                      {names
                        .filter((n) => n !== "")
                        .map((name, idx) => (
                          <option key={idx}>{name}</option>
                        ))}
                    </select>
                    <select className="w-full p-1 bg-transparent font-bold">
                      <option>Победитель пары</option>
                      {names
                        .filter((n) => n !== "")
                        .map((name, idx) => (
                          <option key={idx}>{name}</option>
                        ))}
                    </select>
                  </div>
                ))}
              </div>

              {/* ФИНАЛ */}
              <div className="flex flex-col pt-56 min-w-[260px]">
                <p className="text-center font-black text-yellow-600 text-sm mb-4">
                  🏆 ФИНАЛ
                </p>
                <div className="p-6 rounded-[30px] border-[6px] border-yellow-500 bg-yellow-50 shadow-2xl">
                  <select className="w-full p-2 text-center bg-transparent font-black text-xl uppercase text-yellow-800">
                    <option>ФИНАЛИСТ 1</option>
                    {names
                      .filter((n) => n !== "")
                      .map((name, idx) => (
                        <option key={idx}>{name}</option>
                      ))}
                  </select>
                  <div className="h-[2px] bg-yellow-500 my-4"></div>
                  <select className="w-full p-2 text-center bg-transparent font-black text-xl uppercase text-yellow-800">
                    <option>ФИНАЛИСТ 2</option>
                    {names
                      .filter((n) => n !== "")
                      .map((name, idx) => (
                        <option key={idx}>{name}</option>
                      ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep("pool")}
                className="flex-1 py-4 border-2 rounded-xl font-bold uppercase opacity-50"
              >
                Назад в пульку
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 py-4 bg-green-600 text-white font-black rounded-xl uppercase"
              >
                Распечатать сетку
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
