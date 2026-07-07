import type { Finding } from "@/lib/types";

interface ScoreCardProps {
  score: number;
  findings: Finding[];
}

export default function ScoreCard({ score, findings }: ScoreCardProps) {
  const errors = findings.filter((f) => f.severity === "error").length;
  const warnings = findings.filter((f) => f.severity === "warning").length;

  const getScoreColor = () => {
    if (score >= 80) return "text-green-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreRing = () => {
    if (score >= 80) return "stroke-green-400";
    if (score >= 50) return "stroke-yellow-400";
    return "stroke-red-400";
  };

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-[#111] border border-[#2a2a3e] rounded-xl p-6">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative flex-shrink-0">
          <svg width="130" height="130" className="transform -rotate-90">
            <circle
              cx="65"
              cy="65"
              r={radius}
              fill="none"
              stroke="#2a2a3e"
              strokeWidth="8"
            />
            <circle
              cx="65"
              cy="65"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className={`transition-all duration-1000 ${getScoreRing()}`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-3xl font-bold ${getScoreColor()}`}>
              {score}
            </span>
          </div>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-xl font-semibold text-white mb-2">
            SEO Score
          </h2>
          <div className="flex gap-4 justify-center sm:justify-start text-sm">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="text-gray-400">
                {errors} error{errors !== 1 ? "s" : ""}
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <span className="text-gray-400">
                {warnings} warning{warnings !== 1 ? "s" : ""}
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <span className="text-gray-400">
                {findings.filter((f) => f.severity === "pass").length} passed
              </span>
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            {score >= 90
              ? "Excellent meta tag optimization!"
              : score >= 70
              ? "Good, but some improvements available."
              : score >= 50
              ? "Needs improvement. Check the issues below."
              : "Poor meta tag setup. Significant fixes required."}
          </p>
        </div>
      </div>
    </div>
  );
}
