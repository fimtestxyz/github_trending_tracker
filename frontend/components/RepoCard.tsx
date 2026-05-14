"use client";

import { Repo, LANGUAGE_COLORS } from "../types/repo";
import { Star, GitFork, Code, ExternalLink } from "lucide-react";

interface RepoCardProps {
  repo: Repo;
}

export default function RepoCard({ repo }: RepoCardProps) {
  const color = LANGUAGE_COLORS[repo.language] || LANGUAGE_COLORS["Unknown"];
  const githubUrl = `https://github.com/${repo.owner}/${repo.name}`;
  const deepWikiUrl = `https://deepwiki.com/${repo.owner}/${repo.name}`;
  
  return (
    <div className="bg-[#21262d] border border-[#30363d] rounded-xl p-5 hover:translate-y-[-4px] hover:shadow-2xl hover:border-[#8b949e] transition-all cursor-pointer flex flex-col h-full relative overflow-hidden group">
      <div className="flex items-center gap-3 mb-3">
        {repo.avatar && (
           <img src={repo.avatar} alt={repo.owner} className="w-8 h-8 rounded-full bg-[#30363d]" />
        )}
        <div className="flex items-center gap-2 overflow-hidden">
          <h3 className="font-semibold text-[#58a6ff] hover:underline truncate text-[1.05rem]">
            {repo.owner}/{repo.name}
          </h3>
          <span className="text-[0.75rem] border border-[#30363d] px-1.5 py-0.5 rounded-full text-[#8b949e] whitespace-nowrap">
            Public
          </span>
        </div>
      </div>
      
      <p className="text-sm text-[#c9d1d9] mb-4 line-clamp-3 flex-1 leading-relaxed">
        {repo.description}
      </p>
      
      <div className="flex items-center gap-4 text-xs text-[#8b949e] mb-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
          {repo.language}
        </div>
        <div className="flex items-center gap-1">
          <Star size={14} className="fill-current" />
          {repo.stars}
        </div>
        <div className="flex items-center gap-1">
          <GitFork size={14} className="fill-current" />
          {repo.forks}
        </div>
      </div>

      {/* Hover Actions */}
      <div className="flex items-center gap-3 pt-3 mt-auto border-t border-[#30363d] opacity-0 group-hover:opacity-100 transition-opacity">
        <a 
          href={githubUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-[#c9d1d9] hover:text-[#58a6ff] transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <Code size={14} />
          GitHub
        </a>
        <a 
          href={deepWikiUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-[#c9d1d9] hover:text-[#58a6ff] transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink size={14} />
          DeepWiki
        </a>
      </div>
      
      <div className="absolute top-5 right-5 text-xs text-[#8b949e] opacity-0 group-hover:opacity-100 transition-opacity">
        {repo.stars_gained}
      </div>
    </div>
  );
}
