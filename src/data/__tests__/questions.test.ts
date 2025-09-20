import { questions } from '../questions';
import { Question } from '../../types';

describe('Questions Data', () => {
  describe('Data Structure Validation', () => {
    it('should have questions array', () => {
      expect(Array.isArray(questions)).toBe(true);
      expect(questions.length).toBeGreaterThan(0);
    });

    it('should have valid question structure for each question', () => {
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
      questions.forEach((question: Question) => {
        expect(question.options).toHaveLength(4);
        question.options.forEach(option => {
          expect(typeof option).toBe('string');
          expect(option.length).toBeGreaterThan(0);
        });
      });
    });

    it('should have valid correctAnswer index for each question', () => {
      questions.forEach((question: Question) => {
        expect(question.correctAnswer).toBeGreaterThanOrEqual(0);
        expect(question.correctAnswer).toBeLessThan(question.options.length);
      });
    });

    it('should have valid difficulty levels', () => {
      const validDifficulties = ['easy', 'medium', 'hard'];
      questions.forEach((question: Question) => {
        expect(validDifficulties).toContain(question.difficulty);
      });
    });

    it('should have valid year and chapter ranges', () => {
      questions.forEach((question: Question) => {
        expect(question.year).toBeGreaterThanOrEqual(1);
        expect(question.year).toBeLessThanOrEqual(7);
        expect(question.chapter).toBeGreaterThanOrEqual(1);
        expect(question.chapter).toBeLessThanOrEqual(8);
      });
    });
  });

  describe('Content Coverage', () => {
    it('should have questions for Year 1 Chapter 1', () => {
      const year1Chapter1 = questions.filter(q => q.year === 1 && q.chapter === 1);
      expect(year1Chapter1.length).toBeGreaterThan(0);
    });

    it('should have questions for Year 1 Chapter 2', () => {
      const year1Chapter2 = questions.filter(q => q.year === 1 && q.chapter === 2);
      expect(year1Chapter2.length).toBeGreaterThan(0);
    });

    it('should have unique question IDs', () => {
      const ids = questions.map(q => q.id);
      const uniqueIds = [...new Set(ids)];
      expect(ids.length).toBe(uniqueIds.length);
    });

    it('should have explanations for questions', () => {
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
      questions.forEach((question: Question) => {
        expect(question.text.trim().length).toBeGreaterThan(0);
      });
    });

    it('should have diverse categories', () => {
      const categories = [...new Set(questions.map(q => q.category))];
      expect(categories.length).toBeGreaterThan(1);
    });

    it('should have balanced difficulty distribution', () => {
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
    it('should be able to filter questions by year and chapter', () => {
      const year1Chapter1 = questions.filter(q => q.year === 1 && q.chapter === 1);
      expect(year1Chapter1.length).toBeGreaterThan(0);
      
      year1Chapter1.forEach(q => {
        expect(q.year).toBe(1);
        expect(q.chapter).toBe(1);
      });
    });

    it('should support creating a quiz with limited questions', () => {
      const year1Chapter1 = questions.filter(q => q.year === 1 && q.chapter === 1);
      const limitedQuiz = year1Chapter1.slice(0, 10);
      
      expect(limitedQuiz.length).toBeLessThanOrEqual(10);
      expect(limitedQuiz.length).toBeGreaterThan(0);
    });
  });
});
