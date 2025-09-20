import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../contexts/UserContext';
import { sortingQuestions } from '../data/sortingQuestions';
import { SortingResult } from '../types';
import { useNavigation } from '@react-navigation/native';
import HouseAssignmentScreen from './HouseAssignmentScreen';

const { width, height } = Dimensions.get('window');

const SortingCeremonyScreen = () => {
  const { sortUser, showWelcome } = useUser();
  const navigation = useNavigation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [sortingResult, setSortingResult] = useState<SortingResult>({
    gryffindor: 0,
    hufflepuff: 0,
    ravenclaw: 0,
    slytherin: 0,
  });
  const [showHouseAssignment, setShowHouseAssignment] = useState(false);
  const [assignedHouse, setAssignedHouse] = useState<string>('');

  // Dynamic sizing function for sorting ceremony
  const getDynamicSizes = (question: any) => {
    const questionLength = question?.text?.length || 0;
    const maxOptionLength = Math.max(...(question?.options?.map((opt: any) => opt.text.length) || [0]));
    const totalContentLength = questionLength + (maxOptionLength * 4); // 4 options
    
    // Base sizes for iPhone 16 Pro and other devices
    const isLargeScreen = height > 800;
    const isIPhone16Pro = height >= 932; // iPhone 16 Pro height
    
    let baseMultiplier = 1.0;
    if (isIPhone16Pro) {
      baseMultiplier = 1.0; // Standard size for iPhone 16 Pro
    } else if (isLargeScreen) {
      baseMultiplier = 1.05;
    }
    
    // Calculate size reduction based on content length - more aggressive for better fit
    let sizeMultiplier = 1.0;
    if (totalContentLength > 450) {
      sizeMultiplier = 0.7; // Very long content
    } else if (totalContentLength > 300) {
      sizeMultiplier = 0.8; // Long content
    } else if (totalContentLength > 180) {
      sizeMultiplier = 0.9; // Medium content
    }
    
    const finalMultiplier = baseMultiplier * sizeMultiplier;
    
    return {
      questionFontSize: Math.max(17, Math.floor(19 * finalMultiplier)),
      optionFontSize: Math.max(14, Math.floor(16 * finalMultiplier)),
      optionPadding: Math.max(14, Math.floor(18 * finalMultiplier)),
      spacing: Math.max(10, Math.floor(14 * finalMultiplier)),
      cardPadding: Math.max(22, Math.floor(30 * finalMultiplier)),
      progressSpacing: Math.max(18, Math.floor(26 * finalMultiplier)),
    };
  };

  const handleAnswer = (answerIndex: number) => {
    const question = sortingQuestions[currentQuestion];
    const selectedAnswer = question.options[answerIndex];
    
    const newResult = {
      gryffindor: sortingResult.gryffindor + selectedAnswer.gryffindor,
      hufflepuff: sortingResult.hufflepuff + selectedAnswer.hufflepuff,
      ravenclaw: sortingResult.ravenclaw + selectedAnswer.ravenclaw,
      slytherin: sortingResult.slytherin + selectedAnswer.slytherin,
    };
    
    setSortingResult(newResult);
    
    if (currentQuestion < sortingQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Sorting complete - determine house and show assignment screen
      const sortedHouse = Object.entries(newResult).reduce((a, b) => 
        newResult[a[0] as keyof SortingResult] > newResult[b[0] as keyof SortingResult] ? a : b
      )[0] as keyof SortingResult;
      
      setAssignedHouse(sortedHouse);
      setShowHouseAssignment(true);
    }
  };

  const handleContinueFromAssignment = () => {
    // Complete the sorting process
    sortUser(sortingResult);
  };

  const getHouseColor = (house: string) => {
    switch (house.toLowerCase()) {
      case 'gryffindor':
        return '#7F0909';
      case 'hufflepuff':
        return '#FFDB00';
      case 'ravenclaw':
        return '#0E1A40';
      case 'slytherin':
        return '#1A472A';
      default:
        return '#8B4513';
    }
  };

  const getHouseEmblem = (house: string) => {
    switch (house.toLowerCase()) {
      case 'gryffindor':
        return '🦁';
      case 'hufflepuff':
        return '🦡';
      case 'ravenclaw':
        return '🦅';
      case 'slytherin':
        return '🐍';
      default:
        return '🏰';
    }
  };

  const getHouseDescription = (house: string) => {
    switch (house.toLowerCase()) {
      case 'gryffindor':
        return 'Gryffindor values bravery, courage, and chivalry. Its members are known for their daring and nerve.';
      case 'hufflepuff':
        return 'Hufflepuff values loyalty, patience, and fair play. Its members are known for their hard work and dedication.';
      case 'ravenclaw':
        return 'Ravenclaw values intelligence, wisdom, and creativity. Its members are known for their wit and learning.';
      case 'slytherin':
        return 'Slytherin values ambition, cunning, and resourcefulness. Its members are known for their leadership and determination.';
      default:
        return 'A house of magic and wonder, where friendships are forged and adventures begin.';
    }
  };

  const getHouseTraits = (house: string) => {
    switch (house.toLowerCase()) {
      case 'gryffindor':
        return ['Bravery', 'Courage', 'Chivalry', 'Nerve'];
      case 'hufflepuff':
        return ['Loyalty', 'Patience', 'Fairness', 'Hard Work'];
      case 'ravenclaw':
        return ['Intelligence', 'Wisdom', 'Creativity', 'Learning'];
      case 'slytherin':
        return ['Ambition', 'Cunning', 'Leadership', 'Resourcefulness'];
      default:
        return ['Magic', 'Wonder', 'Adventure', 'Friendship'];
    }
  };

  // Show House Assignment Screen
  if (showHouseAssignment) {
    return (
      <HouseAssignmentScreen 
        house={assignedHouse}
        onContinue={handleContinueFromAssignment}
      />
    );
  }

  if (currentQuestion >= sortingQuestions.length) {
    // Show sorting result
    const sortedHouse = Object.entries(sortingResult).reduce((a, b) => 
      sortingResult[a[0] as keyof SortingResult] > sortingResult[b[0] as keyof SortingResult] ? a : b
    )[0] as keyof SortingResult;
    
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#4A148C', '#7B1FA2', '#9C27B0', '#BA68C8']}
          style={styles.gradient}
        >
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            <View style={styles.headerSection}>
              <Text style={styles.congratsText}>Congratulations!</Text>
              <Text style={styles.sortingCompleteText}>The Sorting Hat has decided</Text>
            </View>

            <View style={styles.resultCard}>
              <View style={[styles.houseContainer, { backgroundColor: getHouseColor(sortedHouse) }]}>
                <Text style={styles.houseEmblem}>{getHouseEmblem(sortedHouse)}</Text>
              </View>
              
              <Text style={styles.houseName}>
                {sortedHouse.charAt(0).toUpperCase() + sortedHouse.slice(1)}
              </Text>
              
              <Text style={styles.houseDescription}>
                {getHouseDescription(sortedHouse)}
              </Text>
              
              <View style={styles.traitsContainer}>
                {getHouseTraits(sortedHouse).map((trait, index) => (
                  <View key={index} style={styles.traitChip}>
                    <Text style={styles.traitText}>{trait}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={styles.continueButton}
                onPress={() => sortUser(sortingResult)}
              >
                <Text style={styles.continueButtonText}>Begin Your Journey</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  const question = sortingQuestions[currentQuestion];
  const dynamicSizes = getDynamicSizes(question);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4A148C', '#7B1FA2', '#9C27B0', '#BA68C8']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Header with Back Button */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => showWelcome()}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          </View>

          {/* Sorting Hat Section */}
          <View style={styles.headerSection}>
            <View style={styles.sortingHatContainer}>
              <Text style={styles.sortingHatEmoji}>🎩</Text>
            </View>
            <Text style={styles.sortingTitle}>Sorting Ceremony</Text>
            <Text style={styles.sortingSubtitle}>
              The Sorting Hat will determine your house
            </Text>
          </View>

          {/* Main Content Card */}
          <View style={[styles.contentCard, { padding: dynamicSizes.cardPadding }]}>
            <View style={[styles.progressContainer, { marginBottom: dynamicSizes.progressSpacing }]}>
              <Text style={styles.progressText}>
                Question {currentQuestion + 1} of {sortingQuestions.length}
              </Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${((currentQuestion + 1) / sortingQuestions.length) * 100}%` }
                  ]} 
                />
              </View>
            </View>

            <View style={[styles.questionContainer, { marginBottom: dynamicSizes.spacing * 2 }]}>
              <Text style={[styles.questionText, { fontSize: dynamicSizes.questionFontSize }]}>
                {question.text}
              </Text>
            </View>

            <View style={[styles.optionsContainer, { gap: dynamicSizes.spacing }]}>
              {question.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.optionButton, { padding: dynamicSizes.optionPadding }]}
                  onPress={() => handleAnswer(index)}
                >
                  <Text style={[styles.optionText, { fontSize: dynamicSizes.optionFontSize }]}>
                    {option.text}
                  </Text>
                </TouchableOpacity>
              ))}
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  headerSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  sortingHatContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  sortingHatEmoji: {
    fontSize: 35,
  },
  sortingTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  sortingSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '400',
  },
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginHorizontal: 24,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 20,
  },
  progressContainer: {
    // marginBottom is now dynamic
  },
  progressText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 12,
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
  questionContainer: {
    // marginBottom is now dynamic
  },
  questionText: {
    fontSize: 20,
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  optionsContainer: {
    // gap is now dynamic
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionText: {
    fontSize: 16,
    color: '#1F2937',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  // Result screen styles
  congratsText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  sortingCompleteText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '400',
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    marginHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 20,
  },
  houseContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  houseEmblem: {
    fontSize: 60,
  },
  houseName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  houseDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    fontWeight: '400',
  },
  traitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 32,
  },
  traitChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  traitText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  continueButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});

export default SortingCeremonyScreen;

