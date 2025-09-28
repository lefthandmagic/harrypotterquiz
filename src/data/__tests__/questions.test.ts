import { getAllQuestions, bookQuestions, getQuestionsForBookAndChapter, getQuestionsForBook, getAvailableBooks, getChapterTitles, isChapterUnlocked } from '../../utils/questionUtils';
import { Question } from '../../types';

describe('Questions Data', () => {
  describe('Data Structure Validation', () => {
    it('should have questions array', () => {
      const questions = getAllQuestions();
      expect(Array.isArray(questions)).toBe(true);
      expect(questions.length).toBeGreaterThan(0);
    });

    it('should have valid question structure for each question', () => {
      const questions = getAllQuestions();
      questions.forEach((question: Question) => {
        expect(question).toHaveProperty('id');
        expect(question).toHaveProperty('text');
        expect(question).toHaveProperty('options');
        expect(question).toHaveProperty('correctAnswer');
        expect(question).toHaveProperty('year');
        expect(question).toHaveProperty('chapter');
        expect(question).toHaveProperty('difficulty');
        expect(question).toHaveProperty('category');

        // Validate types
        expect(typeof question.id).toBe('string');
        expect(typeof question.text).toBe('string');
        expect(Array.isArray(question.options)).toBe(true);
        expect(typeof question.correctAnswer).toBe('number');
        expect(typeof question.year).toBe('number');
        expect(typeof question.chapter).toBe('number');
        expect(typeof question.difficulty).toBe('string');
        expect(typeof question.category).toBe('string');
      });
    });

    it('should have exactly 4 options for each question', () => {
      const questions = getAllQuestions();
      questions.forEach((question: Question) => {
        expect(question.options).toHaveLength(4);
        question.options.forEach(option => {
          expect(typeof option).toBe('string');
          expect(option.length).toBeGreaterThan(0);
        });
      });
    });

    it('should have valid correctAnswer index for each question', () => {
      const questions = getAllQuestions();
      questions.forEach((question: Question) => {
        expect(question.correctAnswer).toBeGreaterThanOrEqual(0);
        expect(question.correctAnswer).toBeLessThan(question.options.length);
      });
    });

    it('should have valid difficulty levels', () => {
      const questions = getAllQuestions();
      const validDifficulties = ['easy', 'medium', 'hard'];
      questions.forEach((question: Question) => {
        expect(validDifficulties).toContain(question.difficulty);
      });
    });

    it('should have valid book and chapter ranges', () => {
      const questions = getAllQuestions();
      questions.forEach((question: Question) => {
        expect(question.year).toBeGreaterThanOrEqual(1);
        expect(question.year).toBeLessThanOrEqual(7);
        expect(question.chapter).toBeGreaterThanOrEqual(1);
        // Book 1 has 17 chapters, other books have 8 chapters
        const maxChapters = question.year === 1 ? 17 : 8;
        expect(question.chapter).toBeLessThanOrEqual(maxChapters);
      });
    });
  });

  describe('Content Coverage', () => {
    it('should have questions for Book 1 Chapter 1', () => {
      const questions = getAllQuestions();
      const book1Chapter1 = questions.filter(q => q.year === 1 && q.chapter === 1);
      expect(book1Chapter1.length).toBeGreaterThan(0);
    });

    it('should have questions for Book 1 Chapter 2', () => {
      const questions = getAllQuestions();
      const book1Chapter2 = questions.filter(q => q.year === 1 && q.chapter === 2);
      expect(book1Chapter2.length).toBeGreaterThan(0);
    });

    it('should have questions for all 7 books', () => {
      const questions = getAllQuestions();
      for (let book = 1; book <= 7; book++) {
        const bookQuestions = questions.filter(q => q.year === book);
        expect(bookQuestions.length).toBeGreaterThan(0);
      }
    });

    it('should have unique question IDs', () => {
      const questions = getAllQuestions();
      const ids = questions.map(q => q.id);
      const uniqueIds = [...new Set(ids)];
      expect(ids.length).toBe(uniqueIds.length);
    });

    it('should have explanations for questions', () => {
      const questions = getAllQuestions();
      questions.forEach((question: Question) => {
        if (question.explanation) {
          expect(typeof question.explanation).toBe('string');
          expect(question.explanation.length).toBeGreaterThan(0);
        }
      });
    });
  });

  describe('Question Quality', () => {
    it('should have non-empty question text', () => {
      const questions = getAllQuestions();
      questions.forEach((question: Question) => {
        expect(question.text.trim().length).toBeGreaterThan(0);
      });
    });

    it('should have diverse categories', () => {
      const questions = getAllQuestions();
      const categories = [...new Set(questions.map(q => q.category))];
      expect(categories.length).toBeGreaterThan(1);
    });

    it('should have balanced difficulty distribution', () => {
      const questions = getAllQuestions();
      const difficulties = questions.reduce((acc, q) => {
        acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      expect(difficulties.easy).toBeGreaterThan(0);
      expect(difficulties.medium).toBeGreaterThan(0);
      // Hard questions are optional but should be counted if present
    });
  });

  describe('Quiz Functionality', () => {
    it('should be able to filter questions by book and chapter', () => {
      const questions = getAllQuestions();
      const book1Chapter1 = questions.filter(q => q.year === 1 && q.chapter === 1);
      expect(book1Chapter1.length).toBeGreaterThan(0);
      
      book1Chapter1.forEach(q => {
        expect(q.year).toBe(1);
        expect(q.chapter).toBe(1);
      });
    });

    it('should support creating a quiz with limited questions', () => {
      const questions = getAllQuestions();
      const book1Chapter1 = questions.filter(q => q.year === 1 && q.chapter === 1);
      const limitedQuiz = book1Chapter1.slice(0, 10);
      
      expect(limitedQuiz.length).toBeLessThanOrEqual(10);
      expect(limitedQuiz.length).toBeGreaterThan(0);
    });
  });

  describe('Helper Functions', () => {
    it('should export individual book questions', () => {
      expect(bookQuestions.book1).toBeDefined();
      expect(bookQuestions.book2).toBeDefined();
      expect(bookQuestions.book3).toBeDefined();
      expect(bookQuestions.book4).toBeDefined();
      expect(bookQuestions.book5).toBeDefined();
      expect(bookQuestions.book6).toBeDefined();
      expect(bookQuestions.book7).toBeDefined();
    });

    it('should get questions for specific book and chapter', () => {
      const book1Chapter1 = getQuestionsForBookAndChapter(1, 1);
      expect(book1Chapter1.length).toBeGreaterThan(0);
      
      book1Chapter1.forEach(q => {
        expect(q.year).toBe(1);
        expect(q.chapter).toBe(1);
      });
    });

    it('should get all questions for a specific book', () => {
      const book1Questions = getQuestionsForBook(1);
      expect(book1Questions.length).toBeGreaterThan(0);
      
      book1Questions.forEach(q => {
        expect(q.year).toBe(1);
      });
    });

    it('should get available books based on progress', () => {
      // Test starting progress
      const availableBooks1 = getAvailableBooks(1, 1);
      expect(availableBooks1).toEqual([1]);

      // Test mid-book progress
      const availableBooks2 = getAvailableBooks(1, 4);
      expect(availableBooks2).toEqual([1]);

      // Test completed book
      const availableBooks3 = getAvailableBooks(1, 8);
      expect(availableBooks3).toEqual([1, 2]);

      // Test multiple completed books
      const availableBooks4 = getAvailableBooks(3, 8);
      expect(availableBooks4).toEqual([1, 2, 3, 4]);

      // Test final book
      const availableBooks5 = getAvailableBooks(7, 8);
      expect(availableBooks5).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });

    it('should get chapter titles for each book', () => {
      for (let book = 1; book <= 7; book++) {
        const chapters = getChapterTitles(book);
        expect(chapters.length).toBeGreaterThan(0);
        // Book 1 has 17 chapters, other books have 8 chapters
        const maxChapters = book === 1 ? 17 : 8;
        expect(chapters.length).toBeLessThanOrEqual(maxChapters);
        
        chapters.forEach(chapter => {
          expect(chapter.chapter).toBeGreaterThanOrEqual(1);
          expect(chapter.chapter).toBeLessThanOrEqual(maxChapters);
          expect(typeof chapter.title).toBe('string');
          expect(chapter.title.length).toBeGreaterThan(0);
        });
      }
    });

    it('should correctly determine chapter unlock status', () => {
      // User in Book 1, Chapter 3
      expect(isChapterUnlocked(1, 3, 1, 1)).toBe(true);  // Book 1, Chapter 1 - unlocked
      expect(isChapterUnlocked(1, 3, 1, 3)).toBe(true);  // Book 1, Chapter 3 - unlocked
      expect(isChapterUnlocked(1, 3, 1, 4)).toBe(false); // Book 1, Chapter 4 - locked
      expect(isChapterUnlocked(1, 3, 2, 1)).toBe(false); // Book 2, Chapter 1 - locked
      
      // User in Book 2, Chapter 5
      expect(isChapterUnlocked(2, 5, 1, 8)).toBe(true);  // Book 1, Chapter 8 - unlocked (previous book)
      expect(isChapterUnlocked(2, 5, 2, 3)).toBe(true);  // Book 2, Chapter 3 - unlocked
      expect(isChapterUnlocked(2, 5, 2, 6)).toBe(false); // Book 2, Chapter 6 - locked
      expect(isChapterUnlocked(2, 5, 3, 1)).toBe(false); // Book 3, Chapter 1 - locked
    });
  });
});
