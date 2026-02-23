"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Trophy, TrendingDown, Calendar, Target, Shield } from "lucide-react";
import { useState } from "react";

type TeamTab = "real-zaragoza" | "casademont";

interface MatchResult {
  date: string;
  matchday: string;
  home: string;
  away: string;
  scoreHome: number;
  scoreAway: number;
  isHome: boolean;
  pending?: boolean;
}

interface TeamData {
  name: string;
  nameEn: string;
  league: string;
  leagueEn: string;
  sport: string;
  logo: string;
  primaryColor: string;
  position: string;
  record: string;
  situation: string;
  situationEn: string;
  results: MatchResult[];
  nextMatch: {
    date: string;
    opponent: string;
    isHome: boolean;
  };
  vocabulary: { en: string; es: string }[];
}

const TEAMS: Record<TeamTab, TeamData> = {
  "real-zaragoza": {
    name: "Real Zaragoza",
    nameEn: "Real Zaragoza",
    league: "LaLiga Hypermotion",
    leagueEn: "Spanish Second Division",
    sport: "fútbol",
    logo: "RZ",
    primaryColor: "#003DA5",
    position: "Zona de descenso",
    record: "5 partidos sin ganar",
    situation:
      "El Real Zaragoza está en puestos de descenso, a 5 puntos de la salvación. Lleva 5 partidos sin ganar bajo la dirección de Rubén Sellés.",
    situationEn:
      "Real Zaragoza is in the relegation zone, 5 points away from safety. They have gone 5 matches without a win under manager Rubén Sellés.",
    results: [
      {
        date: "01/02/2026",
        matchday: "J24",
        home: "Albacete",
        away: "Real Zaragoza",
        scoreHome: 2,
        scoreAway: 0,
        isHome: false,
      },
      {
        date: "08/02/2026",
        matchday: "J25",
        home: "Real Zaragoza",
        away: "SD Eibar",
        scoreHome: 1,
        scoreAway: 1,
        isHome: true,
      },
      {
        date: "15/02/2026",
        matchday: "J26",
        home: "Cultural Leonesa",
        away: "Real Zaragoza",
        scoreHome: 1,
        scoreAway: 1,
        isHome: false,
      },
      {
        date: "22/02/2026",
        matchday: "J27",
        home: "FC Andorra",
        away: "Real Zaragoza",
        scoreHome: 0,
        scoreAway: 0,
        isHome: false,
        pending: true,
      },
    ],
    nextMatch: {
      date: "01/03/2026",
      opponent: "Burgos CF",
      isHome: true,
    },
    vocabulary: [
      { en: "relegation", es: "descenso" },
      { en: "draw", es: "empate" },
      { en: "defeat", es: "derrota" },
      { en: "match", es: "partido" },
      { en: "goal", es: "gol" },
      { en: "league table", es: "clasificación" },
      { en: "manager / coach", es: "entrenador" },
      { en: "stadium", es: "estadio" },
      { en: "away game", es: "partido fuera" },
      { en: "home game", es: "partido en casa" },
    ],
  },
  casademont: {
    name: "Casademont Zaragoza",
    nameEn: "Casademont Zaragoza (Men)",
    league: "Liga Endesa ACB",
    leagueEn: "Spanish Basketball League (Men)",
    sport: "baloncesto",
    logo: "CZ",
    primaryColor: "#C8102E",
    position: "Balance 6-13",
    record: "6 derrotas consecutivas",
    situation:
      "El Casademont Zaragoza masculino tiene un balance de 6-13 y está a solo 2 victorias de los puestos de descenso. Encadena 6 derrotas consecutivas en la ACB.",
    situationEn:
      "Casademont Zaragoza men's team has a 6-13 record and is just 2 wins above the relegation spots. They are on a 6-game losing streak in the ACB.",
    results: [
      {
        date: "07/02/2026",
        matchday: "J19",
        home: "Casademont Zaragoza",
        away: "Bilbao Basket",
        scoreHome: 82,
        scoreAway: 84,
        isHome: true,
      },
      {
        date: "14/02/2026",
        matchday: "J20",
        home: "Casademont Zaragoza",
        away: "Joventut Badalona",
        scoreHome: 67,
        scoreAway: 79,
        isHome: true,
      },
    ],
    nextMatch: {
      date: "25/02/2026",
      opponent: "USK Praga",
      isHome: true,
    },
    vocabulary: [
      { en: "basketball", es: "baloncesto" },
      { en: "court", es: "cancha / pista" },
      { en: "basket / hoop", es: "canasta / aro" },
      { en: "losing streak", es: "racha de derrotas" },
      { en: "score", es: "marcador" },
      { en: "rebound", es: "rebote" },
      { en: "three-pointer", es: "triple" },
      { en: "free throw", es: "tiro libre" },
      { en: "quarter", es: "cuarto" },
      { en: "overtime", es: "prórroga" },
    ],
  },
};

function getResultBadge(result: MatchResult) {
  if (result.pending) {
    return (
      <Badge variant="default">
        <Calendar size={12} className="mr-1" />
        Por jugar
      </Badge>
    );
  }

  const teamScore = result.isHome ? result.scoreHome : result.scoreAway;
  const opponentScore = result.isHome ? result.scoreAway : result.scoreHome;

  if (teamScore > opponentScore) {
    return <Badge variant="success">Victoria</Badge>;
  } else if (teamScore < opponentScore) {
    return <Badge variant="error">Derrota</Badge>;
  } else {
    return <Badge variant="warning">Empate</Badge>;
  }
}

export function SportsZaragoza() {
  const [activeTab, setActiveTab] = useState<TeamTab>("real-zaragoza");
  const team = TEAMS[activeTab];

  return (
    <div className="space-y-4">
      {/* Team selector tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("real-zaragoza")}
          className={`flex-1 px-4 py-3 rounded-[var(--radius-md)] font-medium transition-all flex items-center justify-center gap-2 ${
            activeTab === "real-zaragoza"
              ? "text-white shadow-lg"
              : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)]"
          }`}
          style={
            activeTab === "real-zaragoza"
              ? { backgroundColor: "#003DA5" }
              : {}
          }
        >
          <Shield size={18} />
          <div className="text-left">
            <div className="text-sm font-bold">Real Zaragoza</div>
            <div
              className={`text-xs ${activeTab === "real-zaragoza" ? "text-blue-200" : "text-[var(--color-text-muted)]"}`}
            >
              LaLiga Hypermotion
            </div>
          </div>
        </button>
        <button
          onClick={() => setActiveTab("casademont")}
          className={`flex-1 px-4 py-3 rounded-[var(--radius-md)] font-medium transition-all flex items-center justify-center gap-2 ${
            activeTab === "casademont"
              ? "text-white shadow-lg"
              : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)]"
          }`}
          style={
            activeTab === "casademont"
              ? { backgroundColor: "#C8102E" }
              : {}
          }
        >
          <Trophy size={18} />
          <div className="text-left">
            <div className="text-sm font-bold">Casademont</div>
            <div
              className={`text-xs ${activeTab === "casademont" ? "text-red-200" : "text-[var(--color-text-muted)]"}`}
            >
              ACB (masculino)
            </div>
          </div>
        </button>
      </div>

      {/* Team situation */}
      <Card padding="md">
        <div className="flex items-start gap-3">
          <div
            className="w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center text-white font-bold text-lg shrink-0"
            style={{ backgroundColor: team.primaryColor }}
          >
            {team.logo}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-[var(--color-text)]">{team.name}</h3>
            <p className="text-xs text-[var(--color-text-muted)] mb-2">
              {team.league} &middot; {team.leagueEn}
            </p>
            <div className="flex gap-2 flex-wrap mb-2">
              <Badge variant="error">
                <TrendingDown size={12} className="mr-1" />
                {team.position}
              </Badge>
              <Badge variant="warning">{team.record}</Badge>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {team.situation}
            </p>
            <p className="text-sm text-[var(--color-primary)] mt-1 italic">
              {team.situationEn}
            </p>
          </div>
        </div>
      </Card>

      {/* Recent results */}
      <Card padding="md">
        <h3 className="font-bold text-[var(--color-text)] mb-3 flex items-center gap-2">
          <Calendar size={16} className="text-[var(--color-primary)]" />
          Resultados recientes / Recent results
        </h3>
        <div className="space-y-2">
          {team.results.map((result, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)]"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs text-[var(--color-text-muted)] w-8 shrink-0">
                  {result.matchday}
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-[var(--color-text)] truncate">
                    {result.home}{" "}
                    <span className="text-[var(--color-text-muted)]">vs</span>{" "}
                    {result.away}
                  </div>
                  <div className="text-xs text-[var(--color-text-muted)]">
                    {result.date}
                    {result.isHome ? "" : " (away / fuera)"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {!result.pending && (
                  <span className="font-mono font-bold text-[var(--color-text)]">
                    {result.scoreHome}-{result.scoreAway}
                  </span>
                )}
                {getResultBadge(result)}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Next match */}
      <Card padding="md">
        <h3 className="font-bold text-[var(--color-text)] mb-2 flex items-center gap-2">
          <Target size={16} className="text-[var(--color-primary)]" />
          Próximo partido / Next match
        </h3>
        <div className="flex items-center justify-between p-3 rounded-[var(--radius-md)] border-2 border-dashed border-[var(--color-border)]">
          <div>
            <p className="font-medium text-[var(--color-text)]">
              {team.nextMatch.isHome ? team.name : team.nextMatch.opponent}{" "}
              <span className="text-[var(--color-text-muted)]">vs</span>{" "}
              {team.nextMatch.isHome ? team.nextMatch.opponent : team.name}
            </p>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {team.nextMatch.date} &middot;{" "}
              {team.nextMatch.isHome ? "En casa / Home" : "Fuera / Away"}
            </p>
          </div>
        </div>
      </Card>

      {/* Vocabulary section - the learning part */}
      <Card padding="md">
        <h3 className="font-bold text-[var(--color-text)] mb-1 flex items-center gap-2">
          <span className="text-lg">📚</span>
          Aprende vocabulario / Learn vocabulary
        </h3>
        <p className="text-xs text-[var(--color-text-muted)] mb-3">
          Palabras de {team.sport} para tu próxima sesión
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {team.vocabulary.map((word, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)]"
            >
              <span className="font-medium text-[var(--color-primary)] text-sm">
                {word.en}
              </span>
              <span className="text-sm text-[var(--color-text-secondary)]">
                {word.es}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <ProgressBar
            value={3}
            max={team.vocabulary.length}
            size="sm"
            label={`3/${team.vocabulary.length} words learned`}
          />
        </div>
      </Card>
    </div>
  );
}
