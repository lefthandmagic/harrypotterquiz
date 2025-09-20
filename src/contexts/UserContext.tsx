import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, House, SortingResult } from '../types';

interface UserState {
  user: User | null;
  isLoading: boolean;
  isFirstTime: boolean;
  showWelcome: boolean;
}

type UserAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_FIRST_TIME'; payload: boolean }
  | { type: 'SET_SHOW_WELCOME'; payload: boolean }
  | { type: 'UPDATE_PROGRESS'; payload: { year: number; chapter: number } }
  | { type: 'ADD_POINTS'; payload: number }
  | { type: 'ADD_BADGE'; payload: any }
  | { type: 'ADD_CHOCOLATE_FROG_CARD'; payload: any }
  | { type: 'UPDATE_STREAK'; payload: number }
  | { type: 'SET_WAND'; payload: any }
  | { type: 'SET_PATRONUS'; payload: any };

const initialState: UserState = {
  user: null,
  isLoading: true,
  isFirstTime: true,
  showWelcome: true,
};

const UserContext = createContext<{
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
  sortUser: (result: SortingResult) => void;
  completeQuiz: (year: number, chapter: number, score: number, totalQuestions?: number) => void;
  addPoints: (points: number) => void;
  addBadge: (badge: any) => void;
  addChocolateFrogCard: (card: any) => void;
  updateStreak: (streak: number) => void;
  setWand: (wand: any) => void;
  setPatronus: (patronus: any) => void;
  dismissWelcome: () => void;
  showWelcome: () => void;
  resetUserSession: () => Promise<void>;
} | null>(null);

const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload, isLoading: false };
    case 'SET_FIRST_TIME':
      return { ...state, isFirstTime: action.payload };
    case 'SET_SHOW_WELCOME':
      return { ...state, showWelcome: action.payload };
    case 'UPDATE_PROGRESS':
      if (!state.user) return state;
      const updatedUser = {
        ...state.user,
        currentYear: action.payload.year,
        currentChapter: action.payload.chapter,
      };
      // Save updated progress to AsyncStorage
      AsyncStorage.setItem('userData', JSON.stringify(updatedUser)).catch(error => 
        console.error('Error saving progress:', error)
      );
      return {
        ...state,
        user: updatedUser,
      };
    case 'ADD_POINTS':
      if (!state.user) return state;
      const userWithPoints = {
        ...state.user,
        totalPoints: state.user.totalPoints + action.payload,
      };
      // Save updated points to AsyncStorage
      AsyncStorage.setItem('userData', JSON.stringify(userWithPoints)).catch(error => 
        console.error('Error saving points:', error)
      );
      return {
        ...state,
        user: userWithPoints,
      };
    case 'ADD_BADGE':
      if (!state.user) return state;
      return {
        ...state,
        user: {
          ...state.user,
          badges: [...state.user.badges, action.payload],
        },
      };
    case 'ADD_CHOCOLATE_FROG_CARD':
      if (!state.user) return state;
      return {
        ...state,
        user: {
          ...state.user,
          chocolateFrogCards: [...state.user.chocolateFrogCards, action.payload],
        },
      };
    case 'UPDATE_STREAK':
      if (!state.user) return state;
      return {
        ...state,
        user: {
          ...state.user,
          streak: action.payload,
        },
      };
    case 'SET_WAND':
      if (!state.user) return state;
      return {
        ...state,
        user: {
          ...state.user,
          wand: action.payload,
        },
      };
    case 'SET_PATRONUS':
      if (!state.user) return state;
      return {
        ...state,
        user: {
          ...state.user,
          patronus: action.payload,
        },
      };
    default:
      return state;
  }
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (state.user) {
      saveUserData(state.user);
    }
  }, [state.user]);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      const isFirstTime = await AsyncStorage.getItem('isFirstTime');
      
      if (userData) {
        const user = JSON.parse(userData);
        dispatch({ type: 'SET_USER', payload: user });
        dispatch({ type: 'SET_FIRST_TIME', payload: false });
        dispatch({ type: 'SET_SHOW_WELCOME', payload: false });
      } else {
        // No user data - this is a first time or reset user
        dispatch({ type: 'SET_USER', payload: null });
        dispatch({ type: 'SET_FIRST_TIME', payload: true });
        dispatch({ type: 'SET_SHOW_WELCOME', payload: true });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const saveUserData = async (user: User) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const sortUser = (result: SortingResult) => {
    const house = Object.entries(result).reduce((a, b) => result[a[0] as keyof SortingResult] > result[b[0] as keyof SortingResult] ? a : b)[0] as House;
    
    const newUser: User = {
      id: Date.now().toString(),
      name: 'Wizard',
      house,
      currentYear: 1,
      currentChapter: 1,
      totalPoints: 0,
      badges: [],
      chocolateFrogCards: [],
      streak: 0,
    };

    dispatch({ type: 'SET_USER', payload: newUser });
    dispatch({ type: 'SET_FIRST_TIME', payload: false });
    AsyncStorage.setItem('isFirstTime', 'false');
  };

  const completeQuiz = (year: number, chapter: number, score: number, totalQuestions: number = 10) => {
    if (!state.user) return;
    
    const points = Math.floor(score * 10); // 10 points per correct answer
    dispatch({ type: 'ADD_POINTS', payload: points });
    
    const percentage = score / totalQuestions;
    console.log(`Quiz completed: ${score}/${totalQuestions} (${Math.round(percentage * 100)}%)`);
    
    if (percentage >= 0.7) { // 70% required to pass
      const nextChapter = chapter + 1;
      const nextYear = nextChapter > 8 ? year + 1 : year;
      const finalChapter = nextYear > year ? 1 : nextChapter;
      
      console.log(`Unlocking next: Year ${nextYear}, Chapter ${finalChapter}`);
      dispatch({ type: 'UPDATE_PROGRESS', payload: { year: nextYear, chapter: finalChapter } });
    } else {
      console.log('Score too low to unlock next chapter. Need 70% to pass.');
    }
  };

  const addPoints = (points: number) => {
    dispatch({ type: 'ADD_POINTS', payload: points });
  };

  const addBadge = (badge: any) => {
    dispatch({ type: 'ADD_BADGE', payload: badge });
  };

  const addChocolateFrogCard = (card: any) => {
    dispatch({ type: 'ADD_CHOCOLATE_FROG_CARD', payload: card });
  };

  const updateStreak = (streak: number) => {
    dispatch({ type: 'UPDATE_STREAK', payload: streak });
  };

  const setWand = (wand: any) => {
    dispatch({ type: 'SET_WAND', payload: wand });
  };

  const setPatronus = (patronus: any) => {
    dispatch({ type: 'SET_PATRONUS', payload: patronus });
  };

  const dismissWelcome = () => {
    dispatch({ type: 'SET_SHOW_WELCOME', payload: false });
  };

  const showWelcome = () => {
    dispatch({ type: 'SET_SHOW_WELCOME', payload: true });
  };

  const resetUserSession = async () => {
    try {
      await AsyncStorage.multiRemove(['userData', 'isFirstTime']);
      // Reset all state to initial values
      dispatch({ type: 'SET_USER', payload: null });
      dispatch({ type: 'SET_FIRST_TIME', payload: true });
      dispatch({ type: 'SET_SHOW_WELCOME', payload: true });
      console.log('🧙‍♂️ Session reset successfully!');
    } catch (error) {
      console.error('Error resetting user session:', error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        state,
        dispatch,
        sortUser,
        completeQuiz,
        addPoints,
        addBadge,
        addChocolateFrogCard,
        updateStreak,
        setWand,
        setPatronus,
        dismissWelcome,
        showWelcome,
        resetUserSession,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

