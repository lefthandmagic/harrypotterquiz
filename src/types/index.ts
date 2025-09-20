export interface User {
  id: string;
  name: string;
  house: House;
  currentYear: number;
  currentChapter: number;
  totalPoints: number;
  wand?: Wand;
  patronus?: Patronus;
  badges: Badge[];
  chocolateFrogCards: ChocolateFrogCard[];
  streak: number;
  lastDailyProphetDate?: string;
}

export type House = 'Gryffindor' | 'Hufflepuff' | 'Ravenclaw' | 'Slytherin';

export interface Wand {
  wood: string;
  core: string;
  length: number;
  flexibility: string;
}

export interface Patronus {
  animal: string;
  description: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export interface ChocolateFrogCard {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  image?: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  year: number;
  chapter: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  image?: string;
}

export interface Quiz {
  id: string;
  title: string;
  year: number;
  chapter: number;
  questions: Question[];
  requiredScore: number;
  unlocked: boolean;
  completed: boolean;
  score?: number;
}

export interface HousePoints {
  house: House;
  points: number;
}

export interface DailyProphetQuiz {
  id: string;
  date: string;
  questions: Question[];
  completed: boolean;
  streak: number;
}

export interface SortingQuestion {
  id: string;
  text: string;
  options: {
    text: string;
    gryffindor: number;
    hufflepuff: number;
    ravenclaw: number;
    slytherin: number;
  }[];
}

export interface SortingResult {
  gryffindor: number;
  hufflepuff: number;
  ravenclaw: number;
  slytherin: number;
}

