"use client";

import { Repo, LANGUAGE_COLORS } from "../types/repo";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Cpu } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface AnalysisPanelProps {
  repos: Repo[];
  isVisible: boolean;
}

export default function AnalysisPanel({ repos, isVisible }: AnalysisPanelProps) {
  if (!isVisible || repos.length === 0) return null;

  const langCounts: Record<string, number> = {};
  repos.forEach((r) => {
    langCounts[r.language] = (langCounts[r.language] || 0) + 1;
  });

  const sortedLangs = Object.entries(langCounts).sort((a, b) => b[1] - a[1]);
  const topLang = sortedLangs[0];
  
  const totalStars = repos.reduce((acc, r) => {
    const s = parseInt(r.stars.replace(/,/g, ""));
    return acc + (isNaN(s) ? 0 : s);
  }, 0);

  const topRepo = [...repos].sort((a, b) => {
    const sA = parseInt(a.stars.replace(/,/g, ""));
    const sB = parseInt(b.stars.replace(/,/g, ""));
    return sB - sA;
  })[0];

  const chartData = {
    labels: sortedLangs.map(([lang]) => lang),
    datasets: [
      {
        label: "Projects",
        data: sortedLangs.map(([, count]) => count),
        backgroundColor: sortedLangs.map(([lang]) => LANGUAGE_COLORS[lang] || LANGUAGE_COLORS["Unknown"]),
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "#30363d" },
        ticks: { color: "#8b949e" },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#8b949e" },
      },
    },
  };

  return (
    <section className="bg-[#21262d] border border-[#30363d] rounded-xl p-6 mb-8 grid grid-cols-1 lg:grid-cols-3 gap-8 shadow-sm">
      <div className="lg:col-span-2">
        <h3 className="text-xs font-bold text-[#8b949e] uppercase tracking-wider mb-4">Language Distribution</h3>
        <div className="h-[200px]">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-[#58a6ff] font-semibold">
          <Cpu size={20} />
          <h2>AI Summary</h2>
        </div>
        <p className="text-sm text-[#8b949e] leading-relaxed">
          The trending list is dominated by <strong className="text-[#c9d1d9]">{topLang[0]}</strong> projects, 
          which make up {Math.round((topLang[1] / repos.length) * 100)}% of the results. 
          The current star-leader is <strong className="text-[#c9d1d9]">{topRepo.owner}/{topRepo.name}</strong> with {topRepo.stars} stars. 
          Overall activity is high with a combined total of <strong className="text-[#c9d1d9]">{totalStars.toLocaleString()}</strong> stars across the listed repositories.
        </p>
      </div>
    </section>
  );
}
