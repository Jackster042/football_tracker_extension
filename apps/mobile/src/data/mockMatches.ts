/**
 * Mock Data for Matches and Leagues
 * Sample data based on design reference score-dashboard.png
 */

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  time: string;
  status: 'FT' | 'HT' | 'LIVE' | 'SCHEDULED';
  homeTeamLogo?: string;
  awayTeamLogo?: string;
}

export interface League {
  id: string;
  country: string;
  leagueName: string;
  flagEmoji?: string;
  matches: Match[];
  isFavorite?: boolean;
}

export const mockLeagues: League[] = [
  // Favorite Competitions
  {
    id: 'turkey-super-lig',
    country: 'TURKIYE',
    leagueName: 'Super Lig',
    flagEmoji: '🇹🇷',
    isFavorite: true,
    matches: [
      {
        id: 'match-1',
        homeTeam: 'Galatasaray',
        awayTeam: 'Fenerbahçe',
        homeScore: 2,
        awayScore: 1,
        time: '01:00',
        status: 'FT',
        homeTeamLogo: '⚽',
        awayTeamLogo: '⚽',
      },
    ],
  },
  {
    id: 'england-premier-league',
    country: 'ENGLAND',
    leagueName: 'Premier League',
    flagEmoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    isFavorite: true,
    matches: [
      {
        id: 'match-2',
        homeTeam: 'Hull City',
        awayTeam: 'Leeds United',
        homeScore: 0,
        awayScore: 0,
        time: '01:00',
        status: 'FT',
        homeTeamLogo: '🦁',
        awayTeamLogo: '⚪',
      },
      {
        id: 'match-3',
        homeTeam: 'Chelsea',
        awayTeam: 'Aston Villa',
        homeScore: 2,
        awayScore: 0,
        time: '01:00',
        status: 'FT',
        homeTeamLogo: '🔵',
        awayTeamLogo: '🟣',
      },
      {
        id: 'match-4',
        homeTeam: 'Arsenal',
        awayTeam: 'Leicester',
        homeScore: 1,
        awayScore: 0,
        time: '03:15',
        status: 'FT',
        homeTeamLogo: '🔴',
        awayTeamLogo: '🦊',
      },
    ],
  },
  {
    id: 'spain-la-liga',
    country: 'SPAIN',
    leagueName: 'La Liga',
    flagEmoji: '🇪🇸',
    isFavorite: true,
    matches: [
      {
        id: 'match-5',
        homeTeam: 'Málaga',
        awayTeam: 'Levante',
        homeScore: 3,
        awayScore: 1,
        time: '17:00',
        status: 'FT',
        homeTeamLogo: '⚽',
        awayTeamLogo: '⚽',
      },
    ],
  },
  
  // Other Competitions
  {
    id: 'italy-serie-a',
    country: 'ITALY',
    leagueName: 'Serie A',
    flagEmoji: '🇮🇹',
    isFavorite: false,
    matches: [
      {
        id: 'match-6',
        homeTeam: 'Inter Milan',
        awayTeam: 'AC Milan',
        homeScore: 2,
        awayScore: 2,
        time: '14:00',
        status: 'FT',
        homeTeamLogo: '⚫',
        awayTeamLogo: '🔴',
      },
    ],
  },
  {
    id: 'germany-bundesliga',
    country: 'GERMANY',
    leagueName: 'Bundesliga',
    flagEmoji: '🇩🇪',
    isFavorite: false,
    matches: [
      {
        id: 'match-7',
        homeTeam: 'Bayern Munich',
        awayTeam: 'Dortmund',
        time: '18:30',
        status: 'SCHEDULED',
        homeTeamLogo: '🔴',
        awayTeamLogo: '🟡',
      },
    ],
  },
  {
    id: 'france-ligue-1',
    country: 'FRANCE',
    leagueName: 'Ligue 1',
    flagEmoji: '🇫🇷',
    isFavorite: false,
    matches: [
      {
        id: 'match-8',
        homeTeam: 'PSG',
        awayTeam: 'Lyon',
        homeScore: 1,
        awayScore: 1,
        time: '20:00',
        status: 'HT',
        homeTeamLogo: '🔵',
        awayTeamLogo: '⚪',
      },
    ],
  },
  {
    id: 'portugal-primeira-liga',
    country: 'PORTUGAL',
    leagueName: 'Primeira Liga',
    flagEmoji: '🇵🇹',
    isFavorite: false,
    matches: [
      {
        id: 'match-9',
        homeTeam: 'Benfica',
        awayTeam: 'Porto',
        time: '21:00',
        status: 'SCHEDULED',
        homeTeamLogo: '🔴',
        awayTeamLogo: '🔵',
      },
    ],
  },
  {
    id: 'netherlands-eredivisie',
    country: 'NETHERLANDS',
    leagueName: 'Eredivisie',
    flagEmoji: '🇳🇱',
    isFavorite: false,
    matches: [
      {
        id: 'match-10',
        homeTeam: 'Ajax',
        awayTeam: 'PSV',
        time: '15:45',
        status: 'LIVE',
        homeScore: 1,
        awayScore: 0,
        homeTeamLogo: '🔴',
        awayTeamLogo: '🔴',
      },
    ],
  },
];

// Get favorite leagues only
export const getFavoriteLeagues = (): League[] => {
  return mockLeagues.filter(league => league.isFavorite);
};

// Get other leagues only
export const getOtherLeagues = (): League[] => {
  return mockLeagues.filter(league => !league.isFavorite);
};

// Get total match count
export const getTotalMatchCount = (): number => {
  return mockLeagues.reduce((total, league) => total + league.matches.length, 0);
};

// Get completed match count
export const getCompletedMatchCount = (): number => {
  let count = 0;
  mockLeagues.forEach(league => {
    league.matches.forEach(match => {
      if (match.status === 'FT' || match.status === 'HT') {
        count++;
      }
    });
  });
  return count;
};
