import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';
import { getRandomQuestions } from '../utils/questionUtils';
import { Question } from '../types';

const { width } = Dimensions.get('window');

const DailyProphetScreen = () => {
  const { state, updateStreak, addPoints } = useUser();
  const navigation = useNavigation();
  const [dailyQuestions, setDailyQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isCompleted, setIsCompleted] = useState(false);
  const [animationTrigger, setAnimationTrigger] = useState(false);
  const scaleAnims = useRef<Animated.Value[]>([]).current;
  const backgroundColorAnims = useRef<Animated.Value[]>([]).current;
  const borderColorAnims = useRef<Animated.Value[]>([]).current;

  useEffect(() => {
    generateDailyQuestions();
  }, []);

  useEffect(() => {
    // Initialize animations when current question changes
    if (dailyQuestions.length > 0 && dailyQuestions[currentQuestionIndex]) {
      const optionsCount = dailyQuestions[currentQuestionIndex].options.length;
      
      // Clear existing animations
      scaleAnims.length = 0;
      backgroundColorAnims.length = 0;
      borderColorAnims.length = 0;
      
      // Initialize new animations
      for (let i = 0; i < optionsCount; i++) {
        scaleAnims.push(new Animated.Value(1));
        backgroundColorAnims.push(new Animated.Value(0));
        borderColorAnims.push(new Animated.Value(0));
      }
    }
  }, [currentQuestionIndex, dailyQuestions]);

  useEffect(() => {
    if (timeLeft > 0 && !showResult && !isCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult && !isCompleted) {
      handleAnswer(-1); // Time's up
    }
  }, [timeLeft, showResult, isCompleted]);

  const generateDailyQuestions = () => {
    // Generate 5 random questions from different books and chapters
    const randomQuestions = getRandomQuestions(5);
    setDailyQuestions(randomQuestions);
  };

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === dailyQuestions[currentQuestionIndex].correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
    }

    // Trigger animations
    setAnimationTrigger(true);
    
    // Animate selected option
    if (scaleAnims[answerIndex] && backgroundColorAnims[answerIndex] && borderColorAnims[answerIndex]) {
      // Scale animation (native driver)
      Animated.sequence([
        Animated.spring(scaleAnims[answerIndex], {
          toValue: 1.05,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnims[answerIndex], {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Color animations (JS driver)
      Animated.parallel([
        Animated.timing(backgroundColorAnims[answerIndex], {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(borderColorAnims[answerIndex], {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }

    // Animate correct answer if different from selected
    if (!isCorrect) {
      const correctIndex = dailyQuestions[currentQuestionIndex].correctAnswer;
      setTimeout(() => {
        if (scaleAnims[correctIndex] && backgroundColorAnims[correctIndex] && borderColorAnims[correctIndex]) {
          // Scale animation (native driver)
          Animated.sequence([
            Animated.spring(scaleAnims[correctIndex], {
              toValue: 1.05,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.spring(scaleAnims[correctIndex], {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();

          // Color animations (JS driver)
          Animated.parallel([
            Animated.timing(backgroundColorAnims[correctIndex], {
              toValue: 1,
              duration: 300,
              useNativeDriver: false,
            }),
            Animated.timing(borderColorAnims[correctIndex], {
              toValue: 1,
              duration: 300,
              useNativeDriver: false,
            }),
          ]).start();
        }
      }, 300);
    }

    setTimeout(() => {
      if (currentQuestionIndex < dailyQuestions.length - 1) {
        // Reset animations for next question
        scaleAnims.forEach(anim => anim.setValue(1));
        backgroundColorAnims.forEach(anim => anim.setValue(0));
        borderColorAnims.forEach(anim => anim.setValue(0));
        setAnimationTrigger(false);
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setTimeLeft(20);
      } else {
        finishDailyQuiz();
      }
    }, 2000);
  };

  const finishDailyQuiz = () => {
    const finalScore = score / dailyQuestions.length;
    setShowResult(true);
    setIsCompleted(true);
    
    // Add points
    const points = Math.floor(finalScore * dailyQuestions.length * 15); // Bonus points for daily quiz
    addPoints(points);
    
    // Update streak
    const today = new Date().toDateString();
    if (state.user?.lastDailyProphetDate !== today) {
      const newStreak = state.user?.lastDailyProphetDate === 
        new Date(Date.now() - 86400000).toDateString() 
        ? (state.user.streak + 1) 
        : 1;
      updateStreak(newStreak);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return '#4CAF50';
    if (score >= 0.6) return '#FF9800';
    return '#F44336';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 0.9) return 'Outstanding!';
    if (score >= 0.8) return 'Exceeds Expectations!';
    if (score >= 0.6) return 'Acceptable!';
    return 'Needs Improvement';
  };

  const getStreakReward = (streak: number) => {
    if (streak >= 7) return { bonus: 50, message: 'Weekly Warrior!' };
    if (streak >= 3) return { bonus: 25, message: 'Getting Started!' };
    return { bonus: 10, message: 'Keep Going!' };
  };

  if (dailyQuestions.length === 0) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#4A148C', '#7B1FA2', '#9C27B0', '#BA68C8']} style={styles.gradient}>
          <SafeAreaView style={styles.safeArea} edges={[]}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Preparing today's edition...</Text>
          </View>
          </SafeAreaView>
        </LinearGradient>
      </View>
    );
  }

  if (showResult) {
    const finalScore = score / dailyQuestions.length;
    const streakReward = getStreakReward(state.user?.streak || 0);
    
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#4A148C', '#7B1FA2', '#9C27B0', '#BA68C8']} style={styles.gradient}>
          <SafeAreaView style={styles.safeArea} edges={[]}>
          <View style={styles.resultsContainer}>
            {/* Compact Header */}
            <View style={styles.compactHeader}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
              <View style={styles.headerTitleContainer}>
                <Text style={styles.headerTitle}>Daily Prophet</Text>
                <Text style={styles.headerSubtitle}>Quiz Results</Text>
              </View>
            </View>

            {/* Compact Results Card */}
            <View style={styles.compactResultsCard}>
              <Text style={styles.compactResultTitle}>🎉 Quiz Complete!</Text>
              
              <View style={styles.compactScoreContainer}>
                <Text style={styles.compactScoreText}>
                  {score} / {dailyQuestions.length}
                </Text>
                <Text style={[styles.compactScorePercentage, { color: getScoreColor(finalScore) }]}>
                  {Math.round(finalScore * 100)}%
                </Text>
                <Text style={[styles.compactScoreMessage, { color: getScoreColor(finalScore) }]}>
                  {getScoreMessage(finalScore)}
                </Text>
              </View>

              <View style={styles.compactPointsContainer}>
                <View style={styles.compactPointsItem}>
                  <Ionicons name="star" size={16} color="#F59E0B" />
                  <Text style={styles.compactPointsText}>
                    +{Math.floor(finalScore * dailyQuestions.length * 15)} Daily Points
                  </Text>
                </View>
                <View style={styles.compactPointsItem}>
                  <Ionicons name="flame" size={16} color="#EF4444" />
                  <Text style={styles.compactBonusText}>
                    +{streakReward.bonus} Streak Bonus ({streakReward.message})
                  </Text>
                </View>
              </View>

              <View style={styles.compactStreakContainer}>
                <Ionicons name="flame" size={18} color="#EF4444" />
                <Text style={styles.compactStreakText}>
                  {state.user?.streak || 0} Day Streak
                </Text>
              </View>

              <TouchableOpacity
                style={styles.compactContinueButton}
                onPress={() => {
                  setShowResult(false);
                  setCurrentQuestionIndex(0);
                  setSelectedAnswer(null);
                  setScore(0);
                  setTimeLeft(20);
                  setIsCompleted(false);
                  generateDailyQuestions();
                }}
              >
                <Text style={styles.compactContinueButtonText}>Tomorrow's Edition</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
          </SafeAreaView>
        </LinearGradient>
      </View>
    );
  }

  const currentQuestion = dailyQuestions[currentQuestionIndex];

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#4A148C', '#7B1FA2', '#9C27B0', '#BA68C8']} style={styles.gradient}>
        <SafeAreaView style={styles.safeArea} edges={[]}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoEmoji}>📰</Text>
            </View>
            <Text style={styles.mainTitle}>Daily Prophet</Text>
            <Text style={styles.tagline}>Test your wizarding knowledge</Text>
          </View>

          {/* Main Content Card */}
          <View style={styles.contentCard}>
            {/* Streak Info */}
            <View style={styles.streakInfo}>
              <View style={styles.streakItem}>
                <Ionicons name="flame" size={16} color="#EF4444" />
                <Text style={styles.streakText}>
                  {state.user?.streak || 0} Day Streak
                </Text>
              </View>
              <View style={styles.streakItem}>
                <Ionicons name="star" size={16} color="#F59E0B" />
                <Text style={styles.streakText}>
                  Daily Challenge
                </Text>
              </View>
            </View>

            {/* Progress */}
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>
                Question {currentQuestionIndex + 1} of {dailyQuestions.length}
              </Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${((currentQuestionIndex + 1) / dailyQuestions.length) * 100}%` }
                  ]} 
                />
              </View>
            </View>

            {/* Timer */}
            <View style={styles.timerContainer}>
              <Ionicons name="time-outline" size={16} color="#3B82F6" />
              <Text style={styles.timerText}>{timeLeft}s remaining</Text>
            </View>

            {/* Question */}
            <View style={styles.questionContainer}>
              <Text style={styles.questionText}>{currentQuestion.text}</Text>
            </View>

            {/* Options */}
            <View style={styles.optionsContainer}>
              {currentQuestion.options.map((option, index) => {
                const isCorrect = index === currentQuestion.correctAnswer;
                const isSelected = index === selectedAnswer;
                const showResult = selectedAnswer !== null;
                
                // Determine background color based on state
                let backgroundColor = '#F9FAFB';
                let borderColor = '#E5E7EB';
                let textColor = '#374151';
                
                if (showResult && isCorrect) {
                  backgroundColor = '#10B981'; // Emerald green
                  borderColor = '#059669';
                  textColor = '#FFFFFF';
                } else if (showResult && isSelected && !isCorrect) {
                  backgroundColor = '#EF4444'; // Red
                  borderColor = '#DC2626';
                  textColor = '#FFFFFF';
                }

                const animatedBackgroundColor = backgroundColorAnims[index] ? backgroundColorAnims[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: ['#F9FAFB', backgroundColor],
                }) : '#F9FAFB';

                const animatedBorderColor = borderColorAnims[index] ? borderColorAnims[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: ['#E5E7EB', borderColor],
                }) : '#E5E7EB';

                return (
                  <Animated.View
                    key={index}
                    style={[
                      styles.optionButton,
                      {
                        transform: scaleAnims[index] ? [{ scale: scaleAnims[index] }] : [{ scale: 1 }],
                      },
                    ]}
                  >
                    <Animated.View
                      style={[
                        styles.optionColorContainer,
                        {
                          backgroundColor: showResult ? animatedBackgroundColor : '#F9FAFB',
                          borderColor: showResult ? animatedBorderColor : '#E5E7EB',
                        },
                      ]}
                    >
                      <TouchableOpacity
                        style={styles.optionTouchable}
                        onPress={() => handleAnswer(index)}
                        disabled={selectedAnswer !== null}
                        activeOpacity={0.7}
                      >
                        <Text 
                          style={[
                            styles.optionText,
                            {
                              color: showResult && (isCorrect || (isSelected && !isCorrect)) ? textColor : '#374151',
                              fontWeight: showResult && (isCorrect || (isSelected && !isCorrect)) ? '700' : '500',
                            }
                          ]}
                        >
                          {option}
                        </Text>
                      </TouchableOpacity>
                    </Animated.View>
                  </Animated.View>
                );
              })}
            </View>

            {/* Explanation */}
            {selectedAnswer !== null && currentQuestion.explanation && (
              <View style={styles.explanationContainer}>
                <Text style={styles.explanationTitle}>Prophet Analysis:</Text>
                <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
              </View>
            )}

            {/* Daily Tips */}
            <View style={styles.tipsContainer}>
              <Text style={styles.tipsTitle}>💡 Daily Tips</Text>
              <View style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>
                  Complete daily quizzes to maintain your streak
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>
                  Higher streaks earn bonus house points
                </Text>
              </View>
            </View>
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
  resultsContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    gap: 16,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoEmoji: {
    fontSize: 30,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500',
  },
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 15,
  },
  compactResultsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
    flex: 1,
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#F5E6D3',
  },
  newspaperHeader: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  newspaperTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F5E6D3',
    textAlign: 'center',
    marginBottom: 5,
    letterSpacing: 2,
  },
  newspaperSubtitle: {
    fontSize: 16,
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 5,
  },
  newspaperDate: {
    fontSize: 14,
    color: '#F5E6D3',
    textAlign: 'center',
    opacity: 0.8,
  },
  streakInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  streakItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flex: 1,
    minWidth: 0,
  },
  streakText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
    flexShrink: 1,
  },
  quizHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  quizTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F5E6D3',
    textAlign: 'center',
    marginBottom: 5,
  },
  quizSubtitle: {
    fontSize: 14,
    color: '#F5E6D3',
    textAlign: 'center',
    opacity: 0.8,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '500',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F9FF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  timerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 17,
    color: '#111827',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '600',
  },
  optionsContainer: {
    gap: 10,
    marginBottom: 16,
  },
  optionButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionColorContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  optionTouchable: {
    padding: 14,
    width: '100%',
  },
  optionText: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 18,
  },
  explanationContainer: {
    backgroundColor: '#F3F4F6',
    padding: 14,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 6,
  },
  explanationText: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  tipsContainer: {
    backgroundColor: '#F0F9FF',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    marginTop: 12,
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 10,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 10,
  },
  tipBullet: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: 'bold',
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    color: '#374151',
    lineHeight: 16,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 24,
    textAlign: 'center',
  },
  compactResultTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  compactScoreContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  compactScoreText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 6,
  },
  scorePercentage: {
    fontSize: 48,
    fontWeight: '800',
    marginBottom: 8,
  },
  compactScorePercentage: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 6,
  },
  scoreMessage: {
    fontSize: 20,
    fontWeight: '600',
  },
  compactScoreMessage: {
    fontSize: 16,
    fontWeight: '600',
  },
  pointsContainer: {
    width: '100%',
    marginBottom: 24,
    gap: 12,
  },
  compactPointsContainer: {
    width: '100%',
    marginBottom: 16,
    gap: 8,
  },
  pointsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  compactPointsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  pointsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  compactPointsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  bonusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  compactBonusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 32,
    gap: 8,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  compactStreakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 16,
    gap: 6,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  streakText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#991B1B',
  },
  compactStreakText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#991B1B',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  compactContinueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  compactContinueButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default DailyProphetScreen;

