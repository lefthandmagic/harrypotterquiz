import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../contexts/UserContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getQuestionsForBookAndChapter } from '../utils/questionUtils';

const { width, height } = Dimensions.get('window');

const QuizScreen = () => {
  const { completeQuiz } = useUser();
  const navigation = useNavigation();
  const route = useRoute();
  const { year, chapter } = route.params as { year: number; chapter: number };

  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per question

  useEffect(() => {
    // Get questions for this book and chapter
    const chapterQuestions = getQuestionsForBookAndChapter(year, chapter);
    setQuizQuestions(chapterQuestions.slice(0, 10)); // Limit to 10 questions
  }, [year, chapter]);

  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !quizCompleted) {
      handleAnswer(-1); // Auto-submit wrong answer when time runs out
    }
  }, [timeLeft, quizCompleted]);

  // Dynamic sizing function
  const getDynamicSizes = (question: any, hasExplanation: boolean = false) => {
    const questionLength = question?.text?.length || 0;
    const maxOptionLength = Math.max(...(question?.options?.map((opt: string) => opt.length) || [0]));
    const explanationLength = question?.explanation?.length || 0;
    const totalContentLength = questionLength + (maxOptionLength * 4) + (hasExplanation ? explanationLength : 0);
    
    // Base sizes for iPhone 16 Pro and other devices
    const isLargeScreen = height > 800;
    let baseMultiplier = isLargeScreen ? 1.0 : 0.9; // Reduced for better fit
    
    // More aggressive size reduction when explanation is visible
    if (hasExplanation) {
      baseMultiplier *= 0.85; // Additional reduction for explanation
    }
    
    // Calculate size reduction based on content length
    let sizeMultiplier = 1.0;
    if (totalContentLength > 800) {
      sizeMultiplier = 0.65; // Very long content with explanation
    } else if (totalContentLength > 600) {
      sizeMultiplier = 0.75; // Very long content
    } else if (totalContentLength > 400) {
      sizeMultiplier = 0.85; // Long content
    } else if (totalContentLength > 250) {
      sizeMultiplier = 0.95; // Medium content
    }
    
    const finalMultiplier = baseMultiplier * sizeMultiplier;
    
    return {
      questionFontSize: Math.max(15, Math.floor(18 * finalMultiplier)),
      optionFontSize: Math.max(13, Math.floor(15 * finalMultiplier)),
      optionPadding: Math.max(10, Math.floor(16 * finalMultiplier)),
      spacing: Math.max(8, Math.floor(12 * finalMultiplier)),
      cardPadding: Math.max(16, Math.floor(24 * finalMultiplier)),
      progressSpacing: Math.max(12, Math.floor(20 * finalMultiplier)),
    };
  };

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      nextQuestion(isCorrect);
    }, 2000); // Show explanation for 2 seconds
  };

  const nextQuestion = (lastAnswerCorrect?: boolean) => {
    if (currentQuestionIndex + 1 < quizQuestions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setTimeLeft(30); // Reset timer
    } else {
      // Quiz completed - calculate final score properly
      const finalScore = lastAnswerCorrect !== undefined 
        ? (lastAnswerCorrect ? score + 1 : score)
        : (selectedAnswer === quizQuestions[currentQuestionIndex].correctAnswer ? score + 1 : score);
      
      const percentage = finalScore / quizQuestions.length;
      const passed = percentage >= 0.7;
      
      console.log(`Final score calculation: base score=${score}, last answer correct=${lastAnswerCorrect}, final=${finalScore}`);
      setQuizPassed(passed);
      completeQuiz(year, chapter, finalScore, quizQuestions.length);
      setQuizCompleted(true);
    }
  };

  const getGrade = (finalScore: number) => {
    const percentage = (finalScore / quizQuestions.length) * 100;
    if (percentage >= 90) return 'Outstanding';
    if (percentage >= 80) return 'Exceeds Expectations';
    if (percentage >= 70) return 'Acceptable';
    if (percentage >= 60) return 'Poor';
    return 'Dreadful';
  };

  if (quizQuestions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#4A148C', '#7B1FA2', '#9C27B0', '#BA68C8']} style={styles.gradient}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading questions...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (quizCompleted) {
    const finalScore = score;
    const percentage = Math.round((finalScore / quizQuestions.length) * 100);
    const grade = getGrade(finalScore);

    return (
      <View style={styles.container}>
        <LinearGradient colors={['#4A148C', '#7B1FA2', '#9C27B0', '#BA68C8']} style={styles.gradient}>
          <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.resultContainer}>
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>Quiz Complete!</Text>
              <Text style={styles.resultScore}>{percentage}%</Text>
              <Text style={styles.resultGrade}>{grade}</Text>
              <Text style={styles.resultMessage}>
                You scored {finalScore} out of {quizQuestions.length} questions correctly.
                {quizPassed ? ' Great job! You\'ve unlocked the next chapter!' : ' You need 70% to unlock the next chapter.'}
              </Text>
              <TouchableOpacity
                style={[styles.resultButton, !quizPassed && styles.failedResultButton]}
                onPress={() => navigation.goBack()}
              >
                <Ionicons 
                  name={quizPassed ? "checkmark-circle" : "refresh"} 
                  size={20} 
                  color="#FFFFFF" 
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.resultButtonText}>
                  {quizPassed ? 'Chapter Unlocked!' : 'Try Again'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          </SafeAreaView>
        </LinearGradient>
      </View>
    );
  }

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const hasExplanation = selectedAnswer !== null && currentQuestion.explanation;
  const dynamicSizes = getDynamicSizes(currentQuestion, hasExplanation);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#4A148C', '#7B1FA2', '#9C27B0', '#BA68C8']} style={styles.gradient}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Timer */}
          <View style={styles.timerHeader}>
            <View style={styles.timerContainer}>
              <Ionicons name="time-outline" size={20} color="#FFFFFF" />
              <Text style={styles.timerText}>{timeLeft}s remaining</Text>
            </View>
          </View>

          {/* Main Content Card */}
          <View style={[styles.contentCard, { padding: dynamicSizes.cardPadding }]}>
            {/* Progress */}
            <View style={[styles.progressContainer, { marginBottom: dynamicSizes.progressSpacing }]}>
              <Text style={[styles.progressText, { fontSize: Math.max(14, dynamicSizes.optionFontSize) }]}>
                Question {currentQuestionIndex + 1} of {quizQuestions.length}
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }
                  ]}
                />
              </View>
            </View>

            {/* Question */}
            <View style={[styles.questionContainer, { marginBottom: dynamicSizes.spacing * 1.5 }]}>
              <Text style={[styles.questionText, { fontSize: dynamicSizes.questionFontSize, lineHeight: dynamicSizes.questionFontSize * 1.3 }]}>
                {currentQuestion.text}
              </Text>
            </View>

            {/* Options */}
            <View style={[styles.optionsContainer, { gap: dynamicSizes.spacing }]}>
              {currentQuestion.options.map((option, index) => {
                let buttonStyle = styles.optionButton;
                let textStyle = styles.optionText;

                if (selectedAnswer !== null) {
                  if (index === currentQuestion.correctAnswer) {
                    buttonStyle = styles.correctOptionButton;
                    textStyle = styles.correctOptionText;
                  } else if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
                    buttonStyle = styles.incorrectOptionButton;
                    textStyle = styles.incorrectOptionText;
                  }
                }

                return (
                  <TouchableOpacity
                    key={index}
                    style={[buttonStyle, { padding: dynamicSizes.optionPadding }]}
                    onPress={() => handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                  >
                    <Text style={[textStyle, { fontSize: dynamicSizes.optionFontSize }]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Explanation */}
            {selectedAnswer !== null && currentQuestion.explanation && (
              <View style={[styles.explanationContainer, { 
                marginTop: dynamicSizes.spacing,
                padding: Math.max(12, dynamicSizes.spacing + 2)
              }]}>
                <Text style={[styles.explanationText, { 
                  fontSize: Math.max(12, dynamicSizes.optionFontSize - 2),
                  lineHeight: Math.max(16, (dynamicSizes.optionFontSize - 2) * 1.3)
                }]}>
                  {currentQuestion.explanation}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4A148C',
  },
  gradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 15,
  },
  timerHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    marginBottom: 12,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    gap: 6,
  },
  timerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  progressContainer: {
    // marginBottom is now dynamic
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '500',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  questionContainer: {
    // marginBottom is now dynamic
  },
  questionText: {
    fontSize: 20,
    color: '#111827',
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '600',
  },
  optionsContainer: {
    marginBottom: 0,
  },
  optionButton: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 22,
  },
  correctOptionButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    borderColor: '#4CAF50',
    borderRadius: 16,
    borderWidth: 2,
  },
  correctOptionText: {
    color: '#FFFFFF',
  },
  incorrectOptionButton: {
    backgroundColor: 'rgba(244, 67, 54, 0.9)',
    borderColor: '#F44336',
    borderRadius: 16,
    borderWidth: 2,
  },
  incorrectOptionText: {
    color: '#FFFFFF',
  },
  explanationContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  explanationText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  // Result screen styles
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 20,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  resultScore: {
    fontSize: 48,
    fontWeight: '800',
    color: '#3B82F6',
    marginBottom: 16,
  },
  resultGrade: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 24,
  },
  resultMessage: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  resultButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  failedResultButton: {
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
  },
  resultButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});

export default QuizScreen;