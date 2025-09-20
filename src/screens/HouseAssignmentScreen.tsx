import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface HouseAssignmentScreenProps {
  house: string;
  onContinue: () => void;
}

const HouseAssignmentScreen: React.FC<HouseAssignmentScreenProps> = ({ house, onContinue }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  const getHouseDetails = (houseName: string) => {
    switch (houseName.toLowerCase()) {
      case 'gryffindor':
        return {
          colors: ['#7F0909', '#D3A625', '#EEBA30'],
          emblem: '🦁',
          name: 'Gryffindor',
          description: 'You belong in Gryffindor, where dwell the brave at heart! Their daring, nerve, and chivalry set Gryffindors apart.',
          traits: ['Brave', 'Daring', 'Chivalrous', 'Courageous'],
          quote: '"Their daring, nerve, and chivalry set Gryffindors apart."',
          element: 'Fire',
          head: 'McGonagall',
        };
      case 'hufflepuff':
        return {
          colors: ['#FFDB00', '#606060', '#373737'],
          emblem: '🦡',
          name: 'Hufflepuff',
          description: 'You belong in Hufflepuff, where they are just and loyal! Those patient Hufflepuffs are true and unafraid of toil.',
          traits: ['Loyal', 'Patient', 'Kind', 'Hard-working'],
          quote: '"Those patient Hufflepuffs are true and unafraid of toil."',
          element: 'Earth',
          head: 'Sprout',
        };
      case 'ravenclaw':
        return {
          colors: ['#0E1A40', '#946B2D', '#5D5D5D'],
          emblem: '🦅',
          name: 'Ravenclaw',
          description: 'You belong in Ravenclaw, if you\'ve a ready mind! Where those of wit and learning will always find their kind.',
          traits: ['Intelligent', 'Creative', 'Wise', 'Witty'],
          quote: '"Where those of wit and learning will always find their kind."',
          element: 'Air',
          head: 'Flitwick',
        };
      case 'slytherin':
        return {
          colors: ['#1A472A', '#AAAAAA', '#5D5D5D'],
          emblem: '🐍',
          name: 'Slytherin',
          description: 'You belong in Slytherin, you\'ll make your real friends! Those cunning folk use any means to achieve their ends.',
          traits: ['Ambitious', 'Cunning', 'Leadership', 'Resourcefulness'],
          quote: '"Those cunning folk use any means to achieve their ends."',
          element: 'Water',
          head: 'Snape',
        };
      default:
        return {
          colors: ['#8B4513', '#D2B48C', '#A0522D'],
          emblem: '❓',
          name: 'Unknown House',
          description: 'The Sorting Hat is still deciding your fate...',
          traits: ['Mysterious', 'Unique'],
          quote: '"A mystery you are."',
          element: 'Spirit',
          head: 'Dumbledore',
        };
    }
  };

  const houseDetails = getHouseDetails(house);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={houseDetails.colors}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Background Pattern */}
        <View style={styles.backgroundPattern}>
          <Text style={styles.patternEmoji}>✨</Text>
          <Text style={styles.patternEmoji}>🪄</Text>
          <Text style={styles.patternEmoji}>⭐</Text>
        </View>

        {/* Main Content - ScrollView for better layout */}
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.mainContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Animated Header */}
          <Animated.View 
            style={[
              styles.headerSection,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <View style={styles.sortingHatContainer}>
              <Text style={styles.sortingHatEmoji}>🎩</Text>
            </View>
            
            <Text style={styles.congratulationsText}>🎉 CONGRATULATIONS! 🎉</Text>
            <Text style={styles.sortingCompleteText}>The Sorting Hat has spoken!</Text>
          </Animated.View>

          {/* House Announcement Card */}
          <Animated.View 
            style={[
              styles.houseCard,
              { opacity: fadeAnim }
            ]}
          >
            <View style={[styles.houseEmblemContainer, { backgroundColor: houseDetails.colors[0] }]}>
              <Text style={styles.houseEmblem}>{houseDetails.emblem}</Text>
            </View>
            <Text style={[styles.houseName, { color: houseDetails.colors[0] }]}>{houseDetails.name}</Text>
            <Text style={styles.houseQuote}>{houseDetails.quote}</Text>
            
            <Text style={styles.houseDescription}>{houseDetails.description}</Text>

            {/* Compact Info Row */}
            <View style={styles.compactInfo}>
              <Text style={styles.compactInfoText}>
                <Text style={[styles.infoLabel, { color: houseDetails.colors[0] }]}>Element:</Text> {houseDetails.element} • 
                <Text style={[styles.infoLabel, { color: houseDetails.colors[0] }]}> Head:</Text> {houseDetails.head}
              </Text>
            </View>

            {/* Traits Chips */}
            <View style={styles.traitsSection}>
              <Text style={styles.traitsTitle}>Key Traits:</Text>
              <View style={styles.traitChips}>
                {houseDetails.traits.map((trait, index) => (
                  <View key={index} style={[styles.traitChip, { backgroundColor: houseDetails.colors[1] + '20', borderColor: houseDetails.colors[1] }]}>
                    <Text style={[styles.traitText, { color: houseDetails.colors[0] }]}>{trait}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Call to Action */}
            <View style={styles.ctaSection}>
              <Text style={styles.ctaTitle}>Ready to Begin?</Text>
              <Text style={styles.ctaSubtitle}>
                Your adventure at Hogwarts starts now!
              </Text>
              
              <TouchableOpacity
                style={[styles.continueButton, { backgroundColor: houseDetails.colors[0] }]}
                onPress={() => {
                  console.log('🎉 Continue button pressed!');
                  onContinue();
                }}
              >
                <Text style={styles.continueButtonText}>Begin My Hogwarts Journey</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </Animated.View>
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
    opacity: 0.08,
  },
  patternEmoji: {
    fontSize: 24,
    color: '#FFFFFF',
    margin: 30,
  },
  scrollView: {
    flex: 1,
  },
  mainContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    alignItems: 'center',
    minHeight: height * 0.85,
    justifyContent: 'space-between',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 8,
  },
  sortingHatContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  sortingHatEmoji: {
    fontSize: 36,
  },
  congratulationsText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  sortingCompleteText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500',
  },
  houseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 'auto',
    maxWidth: 400,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 20,
    alignItems: 'center',
    alignSelf: 'center',
    flex: 1,
  },
  houseEmblemContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 12,
  },
  houseEmblem: {
    fontSize: 42,
  },
  houseName: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
  },
  houseQuote: {
    fontSize: 15,
    fontStyle: 'italic',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 20,
  },
  houseDescription: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
  },
  compactInfo: {
    width: '100%',
    marginBottom: 12,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
  },
  compactInfoText: {
    fontSize: 13,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 16,
  },
  infoLabel: {
    fontWeight: '600',
  },
  traitsSection: {
    width: '100%',
    marginBottom: 12,
    alignItems: 'center',
  },
  traitsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  traitChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
  },
  traitChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  traitText: {
    fontSize: 13,
    fontWeight: '600',
  },
  ctaSection: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    marginTop: 'auto',
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 6,
  },
  ctaSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 12,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 28,
    width: '100%',
    minHeight: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    gap: 6,
  },
  continueButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});

export default HouseAssignmentScreen;