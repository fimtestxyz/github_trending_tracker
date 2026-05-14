"use client";

interface SidebarProps {
  since: string;
  setSince: (val: string) => void;
  selectedLang: string;
  setSelectedLang: (val: string) => void;
}

const LANGUAGES = ['Python', 'JavaScript', 'TypeScript', 'Rust', 'Go', 'Java', 'C++', 'HTML/CSS', 'Ruby'];

export default function Sidebar({ since, setSince, selectedLang, setSelectedLang }: SidebarProps) {
  return (
    <aside className="w-[280px] bg-[#161b22] border-r border-[#30363d] p-5 flex flex-col gap-6 overflow-y-auto shrink-0">
      <section>
        <h3 className="text-xs font-bold text-[#8b949e] uppercase tracking-wider mb-3">Time Range</h3>
        <div className="flex flex-col gap-1">
          {['daily', 'weekly', 'monthly'].map((period) => (
            <label key={period} className="flex items-center gap-2.5 p-2 rounded-md hover:bg-[#21262d] cursor-pointer transition-colors capitalize">
              <input
                type="radio"
                name="since"
                value={period}
                checked={since === period}
                onChange={(e) => setSince(e.target.value)}
                className="accent-[#58a6ff]"
              />
              <span className="text-sm">{period === 'daily' ? 'Today' : `This ${period.replace('ly', '')}`}</span>
            </label>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-xs font-bold text-[#8b949e] uppercase tracking-wider mb-3">Programming Language</h3>
        <div className="flex flex-col gap-1">
          <label className="flex items-center gap-2.5 p-2 rounded-md hover:bg-[#21262d] cursor-pointer transition-colors">
            <input
              type="radio"
              name="lang"
              value="all"
              checked={selectedLang === "all"}
              onChange={() => setSelectedLang("all")}
              className="accent-[#58a6ff]"
            />
            <span className="text-sm">All</span>
          </label>
          {LANGUAGES.map((lang) => (
            <label key={lang} className="flex items-center gap-2.5 p-2 rounded-md hover:bg-[#21262d] cursor-pointer transition-colors">
              <input
                type="radio"
                name="lang"
                value={lang}
                checked={selectedLang === lang}
                onChange={() => setSelectedLang(lang)}
                className="accent-[#58a6ff]"
              />
              <span className="text-sm">{lang}</span>
            </label>
          ))}
        </div>
      </section>
    </aside>
  );
}
