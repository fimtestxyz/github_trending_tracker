"use client";

import { useEffect, useState } from "react";
import { Repo, LANGUAGE_COLORS } from "../types/repo";
import Sidebar from "./Sidebar";
import RepoCard from "./RepoCard";
import AnalysisPanel from "./AnalysisPanel";
import Header from "./Header";

export default function Dashboard() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<Repo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [since, setSince] = useState("daily");
  const [selectedLang, setSelectedLang] = useState("all");

  const fetchRepos = async (timeRange: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:4001/api/trending?since=${timeRange}`);
      const data = await response.json();
      setRepos(data);
    } catch (error) {
      console.error("Failed to fetch repos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos(since);
  }, [since]);

  useEffect(() => {
    if (selectedLang === "all") {
      setFilteredRepos(repos);
    } else {
      setFilteredRepos(repos.filter((r) => r.language === selectedLang));
    }
  }, [repos, selectedLang]);

  return (
    <div className="flex flex-col h-screen bg-[#0d1117] text-[#c9d1d9] overflow-hidden">
      <Header onScrape={() => fetchRepos(since)} isLoading={isLoading} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          since={since} 
          setSince={setSince} 
          selectedLang={selectedLang} 
          setSelectedLang={setSelectedLang} 
        />
        
        <main className="flex-1 p-8 overflow-y-auto">
          <AnalysisPanel repos={filteredRepos} isVisible={!isLoading && filteredRepos.length > 0} />
          
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold">Trending Repositories</h2>
            <span className="text-sm text-[#8b949e]">{filteredRepos.length} results found</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-[180px] bg-[#21262d] border border-[#30363d] rounded-xl animate-pulse p-5" />
              ))
            ) : (
              filteredRepos.map((repo, i) => (
                <RepoCard key={i} repo={repo} />
              ))
            )}
            {!isLoading && filteredRepos.length === 0 && (
               <div className="col-span-full text-center py-10 text-[#8b949e]">
                 No repositories found for these filters.
               </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
