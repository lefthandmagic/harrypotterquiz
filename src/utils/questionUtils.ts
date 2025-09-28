import { Question } from '../types';
import { book1Questions } from '../data/books/book1-philosophers-stone';
import { book2Questions } from '../data/books/book2-chamber-of-secrets';
import { book3Questions } from '../data/books/book3-prisoner-of-azkaban';
import { book4Questions } from '../data/books/book4-goblet-of-fire';
import { book5Questions } from '../data/books/book5-order-of-the-phoenix';
import { book6Questions } from '../data/books/book6-half-blood-prince';
import { book7Questions } from '../data/books/book7-deathly-hallows';
import { getChapterTitlesForBook } from '../data/chapterTitles';

// Combine all book questions into a single array
export const getAllQuestions = (): Question[] => [
  ...book1Questions,
  ...book2Questions,
  ...book3Questions,
  ...book4Questions,
  ...book5Questions,
  ...book6Questions,
  ...book7Questions,
];

// Export individual book questions for specific access
export const bookQuestions = {
  book1: book1Questions,
  book2: book2Questions,
  book3: book3Questions,
  book4: book4Questions,
  book5: book5Questions,
  book6: book6Questions,
  book7: book7Questions,
};

// Helper function to get questions for a specific book and chapter
export const getQuestionsForBookAndChapter = (book: number, chapter: number): Question[] => {
  const allQuestions = getAllQuestions();
  return allQuestions.filter(q => q.year === book && q.chapter === chapter);
};

// Helper function to get all questions for a specific book
export const getQuestionsForBook = (book: number): Question[] => {
  const allQuestions = getAllQuestions();
  return allQuestions.filter(q => q.year === book);
};

// Helper function to get available books based on user progress
export const getAvailableBooks = (currentBook: number, currentChapter: number): number[] => {
  const availableBooks: number[] = [];
  
  // Always include books up to current book
  for (let book = 1; book <= currentBook; book++) {
    availableBooks.push(book);
  }
  
  // If current book is completed (all 8 chapters), include next book
  if (currentChapter >= 8 && currentBook < 7) {
    availableBooks.push(currentBook + 1);
  }
  
  return availableBooks;
};

// Helper function to get random questions for daily prophet
export const getRandomQuestions = (count: number = 5): Question[] => {
  const allQuestions = getAllQuestions();
  const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Helper function to get chapter titles for each book
export const getChapterTitles = (book: number): { chapter: number; title: string }[] => {
  return getChapterTitlesForBook(book);
};

// Helper function to check if a chapter is unlocked based on user progress
export const isChapterUnlocked = (userBook: number, userChapter: number, targetBook: number, targetChapter: number): boolean => {
  // If target book is before user's current book, it's unlocked
  if (targetBook < userBook) {
    return true;
  }
  
  // If target book is after user's current book, it's locked
  if (targetBook > userBook) {
    return false;
  }
  
  // If target book is the same as user's current book, check chapter
  if (targetBook === userBook) {
    return targetChapter <= userChapter;
  }
  
  return false;
};
