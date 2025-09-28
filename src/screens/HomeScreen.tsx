import React from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { getChapterTitles, isChapterUnlocked } from '../utils/questionUtils';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const { state } = useUser();
  const navigation = useNavigation();

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

  const startQuiz = (year: number, chapter: number) => {
    navigation.navigate('Quiz', { year, chapter });
  };

  // Sample years data
  const years = [
    { year: 1, title: "The Philosopher's Stone", color: '#DC2626' },
    { year: 2, title: 'The Chamber of Secrets', color: '#059669' },
    { year: 3, title: 'The Prisoner of Azkaban', color: '#7C3AED' },
    { year: 4, title: 'The Goblet of Fire', color: '#EA580C' },
    { year: 5, title: 'The Order of the Phoenix', color: '#DB2777' },
    { year: 6, title: 'The Half-Blood Prince', color: '#0891B2' },
    { year: 7, title: 'The Deathly Hallows', color: '#4338CA' },
  ];

  // Dynamic chapters data based on user progress and current book
  const chapters = getChapterTitles(state.user.currentYear);

  if (!state.user) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <LinearGradient colors={['#4A148C', '#7B1FA2', '#9C27B0', '#BA68C8']} style={styles.gradient}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading your magical journey...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#4A148C', '#7B1FA2', '#9C27B0', '#BA68C8']} style={styles.gradient}>
        <SafeAreaView style={styles.safeArea} edges={[]}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={[styles.houseBadgeContainer, { backgroundColor: getHouseColor(state.user.house) }]}>
              <Text style={styles.houseEmblem}>{getHouseEmblem(state.user.house)}</Text>
            </View>
            <Text style={styles.mainTitle}>Welcome back, {state.user.name}!</Text>
            <Text style={styles.tagline}>{state.user.house} • Book {state.user.currentYear}</Text>
          </View>

          {/* Main Content Card */}
          <View style={styles.contentCard}>
            {/* Progress Stats */}
            <View style={styles.statsSection}>
              <Text style={styles.sectionTitle}>📊 Your Progress</Text>
              <View style={styles.progressGrid}>
                <View style={styles.statItem}>
                  <View style={styles.statIconContainer}>
                    <Ionicons name="school" size={24} color="#8B5CF6" />
                  </View>
                  <Text style={styles.statNumber}>{state.user.currentYear}</Text>
                  <Text style={styles.statLabel}>Current Book</Text>
                </View>
                <View style={styles.statItem}>
                  <View style={styles.statIconContainer}>
                    <Ionicons name="star" size={24} color="#F59E0B" />
                  </View>
                  <Text style={styles.statNumber}>{state.user.totalPoints}</Text>
                  <Text style={styles.statLabel}>House Points</Text>
                </View>
                <View style={styles.statItem}>
                  <View style={styles.statIconContainer}>
                    <Ionicons name="flame" size={24} color="#EF4444" />
                  </View>
                  <Text style={styles.statNumber}>{state.user.streak}</Text>
                  <Text style={styles.statLabel}>Day Streak</Text>
                </View>
                <View style={styles.statItem}>
                  <View style={styles.statIconContainer}>
                    <Ionicons name="book" size={24} color="#3B82F6" />
                  </View>
                  <Text style={styles.statNumber}>{state.user.currentChapter}</Text>
                  <Text style={styles.statLabel}>Chapter</Text>
                </View>
              </View>
            </View>

            {/* Current Year Section */}
            <View style={styles.currentSection}>
              <Text style={styles.sectionTitle}>📚 Current Studies</Text>
              <View style={styles.currentYearCard}>
                <Text style={styles.yearTitle}>Book {state.user.currentYear}</Text>
                <Text style={styles.yearSubtitle}>
                  {years[state.user.currentYear - 1]?.title || 'Unknown Book'}
                </Text>
                <Text style={styles.chapterText}>
                  Chapter {state.user.currentChapter}
                </Text>
              </View>
            </View>

            {/* Available Chapters */}
            <View style={styles.chaptersSection}>
              <Text style={styles.sectionTitle}>🎯 Available Chapters</Text>
              <View style={styles.chaptersGrid}>
                {chapters.map((chapter, index) => {
                  // Chapter is unlocked based on user's current book and chapter progress
                  const isUnlocked = isChapterUnlocked(
                    state.user.currentYear, 
                    state.user.currentChapter, 
                    state.user.currentYear, 
                    chapter.chapter
                  );
                  
                  return (
                    <TouchableOpacity
                      key={chapter.chapter}
                      style={[
                        styles.chapterCard,
                        !isUnlocked && styles.lockedChapterCard
                      ]}
                      onPress={() => isUnlocked && startQuiz(state.user.currentYear, chapter.chapter)}
                      disabled={!isUnlocked}
                    >
                      <View style={styles.chapterNumber}>
                        <Text style={[
                          styles.chapterNumberText,
                          !isUnlocked && styles.lockedText
                        ]}>
                          {chapter.chapter}
                        </Text>
                      </View>
                      <Text style={[
                        styles.chapterTitle,
                        !isUnlocked && styles.lockedText
                      ]}>
                        {chapter.title}
                      </Text>
                      {isUnlocked ? (
                        <Ionicons name="play-circle" size={20} color="#3B82F6" />
                      ) : (
                        <Ionicons name="lock-closed" size={20} color="#6B7280" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* All Years Overview */}
            <View style={styles.yearsSection}>
              <Text style={styles.sectionTitle}>🏰 All Years</Text>
              {years.map((yearData) => (
                <TouchableOpacity
                  key={yearData.year}
                  style={[
                    styles.yearCard,
                    state.user.currentYear < yearData.year && styles.lockedYearCard
                  ]}
                  onPress={() => state.user.currentYear >= yearData.year && startQuiz(yearData.year, 1)}
                  disabled={state.user.currentYear < yearData.year}
                >
                  <View style={styles.yearHeader}>
                    <View style={styles.yearInfo}>
                      <Text style={styles.yearNumber}>Year {yearData.year}</Text>
                      <Text style={[
                        styles.yearTitleText,
                        state.user.currentYear < yearData.year && styles.lockedText
                      ]}>
                        {yearData.title}
                      </Text>
                    </View>
                    <View style={styles.yearStatus}>
                      {state.user.currentYear >= yearData.year ? (
                        <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                      ) : (
                        <Ionicons name="lock-closed" size={24} color="#6B7280" />
                      )}
                    </View>
                  </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#FFFFFF',
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
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  houseBadgeContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  houseEmblem: {
    fontSize: 40,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500',
  },
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  statsSection: {
    marginBottom: 24,
  },
  progressGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '47%',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 120,
    marginBottom: 12,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 14,
  },
  currentSection: {
    marginBottom: 24,
  },
  currentYearCard: {
    backgroundColor: '#F0F9FF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  yearTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 8,
  },
  yearSubtitle: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '500',
    marginBottom: 8,
  },
  chapterText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  chaptersSection: {
    marginBottom: 24,
  },
  chaptersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  chapterCard: {
    width: '47%',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    minHeight: 110,
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  lockedChapterCard: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
  },
  chapterNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  chapterNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  chapterTitle: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 13,
    paddingHorizontal: 2,
  },
  lockedText: {
    color: '#9CA3AF',
  },
  yearsSection: {
    marginBottom: 24,
  },
  yearCard: {
    backgroundColor: '#F9FAFB',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  lockedYearCard: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
  },
  yearHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  yearInfo: {
    flex: 1,
  },
  yearNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  yearTitleText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  yearStatus: {
    marginLeft: 16,
  },
});

export default HomeScreen;