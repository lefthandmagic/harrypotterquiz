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

const { width, height } = Dimensions.get('window');

// Responsive sizing for different iPhone models
const isIPhone16Pro = width >= 393; // iPhone 16 Pro width
const isLargeScreen = width > 390;
const horizontalPadding = isIPhone16Pro ? 36 : isLargeScreen ? 32 : 24;
const contentCardMargin = isIPhone16Pro ? 12 : isLargeScreen ? 8 : 4;

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4A148C', '#7B1FA2', '#9C27B0', '#BA68C8']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Background Pattern */}
        <View style={styles.backgroundPattern}>
          <Text style={styles.patternEmoji}>✨</Text>
          <Text style={styles.patternEmoji}>🪄</Text>
          <Text style={styles.patternEmoji}>⚡</Text>
          <Text style={styles.patternEmoji}>🔮</Text>
          <Text style={styles.patternEmoji}>👑</Text>
          <Text style={styles.patternEmoji}>✨</Text>
        </View>

        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Content */}
          <View style={styles.topContent}>
            {/* Hero Section */}
            <View style={styles.heroSection}>
              <View style={styles.logoContainer}>
                <Text style={styles.logoEmoji}>🏰</Text>
              </View>
              <Text style={styles.mainTitle}>Wizarding World Quiz</Text>
              <Text style={styles.tagline}>Test your magical knowledge</Text>
            </View>

            {/* Main Content Card */}
            <View style={styles.contentCard}>
            <Text style={styles.welcomeText}>
              Master magic through seven years at Hogwarts. Earn house points, compete for glory, and prove your wizarding knowledge.
            </Text>

            {/* Feature Grid */}
            <View style={styles.featureGrid}>
              <View style={styles.featureItem}>
                <View style={styles.featureIconContainer}>
                  <Text style={styles.featureIcon}>📚</Text>
                </View>
                <Text style={styles.featureLabel}>Seven-Year Journey</Text>
                <Text style={styles.featureDesc}>Master all 7 books</Text>
              </View>

              <View style={styles.featureItem}>
                <View style={styles.featureIconContainer}>
                  <Text style={styles.featureIcon}>🏆</Text>
                </View>
                <Text style={styles.featureLabel}>House Competition</Text>
                <Text style={styles.featureDesc}>Win the House Cup</Text>
              </View>

              <View style={styles.featureItem}>
                <View style={styles.featureIconContainer}>
                  <Text style={styles.featureIcon}>📰</Text>
                </View>
                <Text style={styles.featureLabel}>Daily Prophet</Text>
                <Text style={styles.featureDesc}>Daily magical quizzes</Text>
              </View>

              <View style={styles.featureItem}>
                <View style={styles.featureIconContainer}>
                  <Text style={styles.featureIcon}>⚡</Text>
                </View>
                <Text style={styles.featureLabel}>House Sorting</Text>
                <Text style={styles.featureDesc}>Discover your destiny</Text>
              </View>
            </View>

            </View>
          </View>

          {/* Bottom Button Section */}
          <View style={styles.bottomSection}>
          <Text style={styles.ctaTitle}>Ready to begin?</Text>
          <Text style={styles.ctaSubtitle}>
            First, discover your Hogwarts house
          </Text>
            
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={onGetStarted}
            >
              <Text style={styles.buttonText}>Start Sorting Ceremony</Text>
            </TouchableOpacity>
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
    backgroundColor: '#4A148C', // Fallback color to prevent white flashes
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
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    opacity: 0.05,
  },
  patternEmoji: {
    fontSize: 30,
    color: '#FFFFFF',
    margin: 40,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: horizontalPadding,
    paddingTop: 10,
    paddingBottom: 20,
  },
  topContent: {
    marginBottom: 12,
  },
  bottomSection: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: contentCardMargin,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 12,
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
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 17,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '400',
  },
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: isIPhone16Pro ? 20 : isLargeScreen ? 18 : 16,
    marginVertical: 8,
    marginHorizontal: contentCardMargin,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 15,
  },
  welcomeText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '400',
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 4,
    gap: isIPhone16Pro ? 8 : 6,
  },
  featureItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: isIPhone16Pro ? 10 : 8,
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  featureIcon: {
    fontSize: 22,
  },
  featureLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 3,
  },
  featureDesc: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 17,
    fontWeight: '400',
  },
  ctaTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 6,
  },
  ctaSubtitle: {
    fontSize: 17,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
    fontWeight: '400',
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
    marginTop: 8,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});

export default WelcomeScreen;
