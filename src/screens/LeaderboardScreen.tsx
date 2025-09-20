import React, { useState, useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '../contexts/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { House, HousePoints } from '../types';

const { width } = Dimensions.get('window');

const LeaderboardScreen = () => {
  const { state } = useUser();
  const navigation = useNavigation();
  const [housePoints, setHousePoints] = useState<HousePoints[]>([]);

  const generateRealisticLeaderboard = async () => {
    if (!state.user) return [];

    try {
      // Get persistent house data
      const savedHouseData = await AsyncStorage.getItem('houseCompetitionData');
      let houseData: { [key: string]: { points: number; lastUpdate: number } } = {};

      if (savedHouseData) {
        houseData = JSON.parse(savedHouseData);
      }

      // Get installation date for time-based progression
      let installDate = await AsyncStorage.getItem('appInstallDate');
      if (!installDate) {
        installDate = Date.now().toString();
        await AsyncStorage.setItem('appInstallDate', installDate);
      }

      const now = Date.now();
      const daysSinceInstall = Math.floor((now - parseInt(installDate)) / (1000 * 60 * 60 * 24));
      
      // House characteristics based on Harry Potter canon - growth rates per day
      const houseGrowthRates = {
        gryffindor: 28,   // Slightly faster growth (brave actions)
        slytherin: 26,    // Competitive growth (ambitious)
        ravenclaw: 24,    // Steady growth (academic consistency)
        hufflepuff: 22    // Patient but steady growth
      };

      const allHouses: House[] = ['Gryffindor', 'Slytherin', 'Ravenclaw', 'Hufflepuff'];
      
      const updatedHouseData = allHouses.map(house => {
        if (house.toLowerCase() === state.user!.house.toLowerCase()) {
          // User's house gets their actual points
          return { house, points: state.user!.totalPoints };
        } else {
          const houseKey = house.toLowerCase();
          const existingData = houseData[houseKey];
          
          if (existingData) {
            // Calculate growth since last update
            const daysSinceLastUpdate = Math.floor((now - existingData.lastUpdate) / (1000 * 60 * 60 * 24));
            const growthRate = houseGrowthRates[houseKey as keyof typeof houseGrowthRates];
            const baseGrowth = Math.max(0, daysSinceLastUpdate * growthRate);
            
            // Add some small random daily variation (±5 points) but maintain upward trend
            const dailyVariation = Math.floor(Math.random() * 11) - 5; // -5 to +5
            const newPoints = Math.max(existingData.points, existingData.points + baseGrowth + dailyVariation);
            
            // Update the data
            houseData[houseKey] = { points: newPoints, lastUpdate: now };
            return { house, points: newPoints };
          } else {
            // Initialize new house with competitive starting points
            const userBaseline = Math.max(500, state.user!.totalPoints * 0.8);
            const houseMultiplier = houseGrowthRates[houseKey as keyof typeof houseGrowthRates] / 25; // Convert to multiplier
            const startingPoints = Math.floor(userBaseline * houseMultiplier + (daysSinceInstall * houseGrowthRates[houseKey as keyof typeof houseGrowthRates]));
            
            houseData[houseKey] = { points: startingPoints, lastUpdate: now };
            return { house, points: startingPoints };
          }
        }
      });

      // Save updated house data
      await AsyncStorage.setItem('houseCompetitionData', JSON.stringify(houseData));
      
      return updatedHouseData;
    } catch (error) {
      console.error('Error generating leaderboard:', error);
      // Fallback to simple calculation if storage fails
      const allHouses: House[] = ['Gryffindor', 'Slytherin', 'Ravenclaw', 'Hufflepuff'];
      return allHouses.map(house => ({
        house,
        points: house.toLowerCase() === state.user!.house.toLowerCase() ? state.user!.totalPoints : 800
      }));
    }
  };

  useEffect(() => {
    const loadLeaderboard = async () => {
      const leaderboard = await generateRealisticLeaderboard();
      setHousePoints(leaderboard);
    };
    
    if (state.user) {
      loadLeaderboard();
    }
  }, [state.user?.totalPoints, state.user?.house]);

  // Add a function to handle competitor house responses when user gains points
  useEffect(() => {
    const handleUserPointsChange = async () => {
      if (!state.user) return;
      
      try {
        const savedHouseData = await AsyncStorage.getItem('houseCompetitionData');
        if (savedHouseData) {
          const houseData = JSON.parse(savedHouseData);
          let needsUpdate = false;
          
          // If user gained significant points, competitor houses might get a small boost too
          const allHouses = ['gryffindor', 'slytherin', 'ravenclaw', 'hufflepuff'];
          const userHouse = state.user.house.toLowerCase();
          
          allHouses.forEach(house => {
            if (house !== userHouse && houseData[house]) {
              // Small chance for competitor houses to get 1-3 points when user progresses
              if (Math.random() < 0.3) { // 30% chance
                const smallBoost = Math.floor(Math.random() * 3) + 1; // 1-3 points
                houseData[house].points += smallBoost;
                houseData[house].lastUpdate = Date.now();
                needsUpdate = true;
              }
            }
          });
          
          if (needsUpdate) {
            await AsyncStorage.setItem('houseCompetitionData', JSON.stringify(houseData));
          }
        }
      } catch (error) {
        console.error('Error updating competitor houses:', error);
      }
    };

    // Only trigger this when user actually gains points (not on initial load)
    if (state.user?.totalPoints && state.user.totalPoints > 0) {
      handleUserPointsChange();
    }
  }, [state.user?.totalPoints]);

  const getHouseColor = (house: House) => {
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

  const getHouseEmblem = (house: House) => {
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

  // Sort houses by points (descending)
  const sortedHouses = [...housePoints].sort((a, b) => b.points - a.points);
  const totalPoints = housePoints.reduce((sum, house) => sum + house.points, 0);

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '🏆';
    }
  };

  const getUserHouseRank = () => {
    if (!state.user?.house) return null;
    return sortedHouses.findIndex(house => 
      house.house.toLowerCase() === state.user?.house.toLowerCase()
    ) + 1;
  };

  // Show loading state if user is not available
  if (!state.user) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <LinearGradient colors={['#4A148C', '#7B1FA2', '#9C27B0', '#BA68C8']} style={styles.gradient}>
          <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={[styles.mainTitle, { color: '#FFFFFF' }]}>Loading House Cup...</Text>
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
            <View style={styles.logoContainer}>
              <Text style={styles.logoEmoji}>🏆</Text>
            </View>
            <Text style={styles.mainTitle}>House Cup</Text>
            <Text style={styles.tagline}>Compete for eternal glory</Text>
          </View>

          {/* Main Content Card */}
          <View style={styles.contentCard}>
            {/* Current Standings Header */}
            <View style={styles.standingsHeader}>
              <View style={styles.standingsTitle}>
                <Text style={styles.sectionTitle}>🎯 Current Standings</Text>
                {state.user?.house && (
                  <View style={styles.userRankBadge}>
                    <Text style={styles.userRankText}>
                      Your House: #{getUserHouseRank()}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Leaderboard */}
            <View style={styles.leaderboard}>
              {sortedHouses.length === 0 ? (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>Calculating house standings...</Text>
                </View>
              ) : (
                sortedHouses.map((house, index) => {
                const isUserHouse = state.user?.house.toLowerCase() === house.house.toLowerCase();
                const percentage = totalPoints > 0 ? (house.points / totalPoints) * 100 : 0;
                
                return (
                  <View 
                    key={house.house} 
                    style={[
                      styles.houseCard,
                      isUserHouse && styles.userHouseCard
                    ]}
                  >
                    <View style={styles.houseRank}>
                      <Text style={styles.rankEmoji}>{getRankIcon(index + 1)}</Text>
                      <Text style={styles.rankNumber}>#{index + 1}</Text>
                    </View>

                    <View style={styles.houseInfo}>
                      <View style={styles.houseHeader}>
                        <Text style={styles.houseEmblem}>{getHouseEmblem(house.house)}</Text>
                        <View style={styles.houseDetails}>
                          <Text style={[styles.houseName, { color: getHouseColor(house.house) }]}>
                            {house.house}
                          </Text>
                          <Text style={styles.housePercentage}>
                            {percentage.toFixed(1)}% of total points
                          </Text>
                        </View>
                      </View>

                      <View style={styles.pointsSection}>
                        <Text style={styles.housePoints}>{house.points.toLocaleString()}</Text>
                        <Text style={styles.pointsLabel}>points</Text>
                      </View>
                    </View>

                    {/* Progress Bar */}
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <View 
                          style={[
                            styles.progressFill,
                            { 
                              width: `${percentage}%`,
                              backgroundColor: getHouseColor(house.house)
                            }
                          ]} 
                        />
                      </View>
                    </View>

                    {isUserHouse && (
                      <View style={styles.userHouseBadge}>
                        <Ionicons name="star" size={16} color="#F59E0B" />
                        <Text style={styles.userHouseText}>Your House</Text>
                      </View>
                    )}
                  </View>
                );
                })
              )}
            </View>

            {/* Competition Info */}
            <View style={styles.competitionInfo}>
              <Text style={styles.sectionTitle}>📊 Competition Details</Text>
              
              <View style={styles.competitionGrid}>
                <View style={styles.competitionItem}>
                  <Ionicons name="trophy-outline" size={20} color="#F59E0B" />
                  <Text style={styles.competitionLabel}>Leading House</Text>
                  <Text style={styles.competitionValue}>{sortedHouses[0]?.house || 'Calculating...'}</Text>
                </View>
                
                <View style={styles.competitionItem}>
                  <Ionicons name="flame-outline" size={20} color="#EF4444" />
                  <Text style={styles.competitionLabel}>Total Points</Text>
                  <Text style={styles.competitionValue}>{totalPoints > 0 ? totalPoints.toLocaleString() : 'Calculating...'}</Text>
                </View>
                
                <View style={styles.competitionItem}>
                  <Ionicons name="people-outline" size={20} color="#3B82F6" />
                  <Text style={styles.competitionLabel}>Houses Competing</Text>
                  <Text style={styles.competitionValue}>4</Text>
                </View>
                
                <View style={styles.competitionItem}>
                  <Ionicons name="calendar-outline" size={20} color="#8B5CF6" />
                  <Text style={styles.competitionLabel}>Term Progress</Text>
                  <Text style={styles.competitionValue}>65%</Text>
                </View>
              </View>
            </View>

            {/* How to Earn Points */}
            <View style={styles.earnPointsSection}>
              <Text style={styles.sectionTitle}>💡 How to Earn Points</Text>
              
              <View style={styles.tipsList}>
                <View style={styles.tipItem}>
                  <Text style={styles.tipBullet}>•</Text>
                  <Text style={styles.tipText}>Complete chapter quizzes correctly</Text>
                  <Text style={styles.tipPoints}>+15 pts</Text>
                </View>
                
                <View style={styles.tipItem}>
                  <Text style={styles.tipBullet}>•</Text>
                  <Text style={styles.tipText}>Maintain daily Prophet streaks</Text>
                  <Text style={styles.tipPoints}>+25 pts</Text>
                </View>
                
                <View style={styles.tipItem}>
                  <Text style={styles.tipBullet}>•</Text>
                  <Text style={styles.tipText}>Perfect O.W.L.s and N.E.W.T.s scores</Text>
                  <Text style={styles.tipPoints}>+100 pts</Text>
                </View>
                
                <View style={styles.tipItem}>
                  <Text style={styles.tipBullet}>•</Text>
                  <Text style={styles.tipText}>Discover hidden achievements</Text>
                  <Text style={styles.tipPoints}>+50 pts</Text>
                </View>
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
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoEmoji: {
    fontSize: 40,
  },
  mainTitle: {
    fontSize: 32,
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
    borderRadius: 32,
    padding: 32,
    marginHorizontal: 24,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.2,
    shadowRadius: 35,
    elevation: 25,
  },
  standingsHeader: {
    marginBottom: 20,
  },
  standingsTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    minWidth: 180,
  },
  userRankBadge: {
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    alignSelf: 'flex-start',
  },
  userRankText: {
    fontSize: 13,
    color: '#1E40AF',
    fontWeight: '600',
  },
  leaderboard: {
    marginBottom: 32,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  houseCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  userHouseCard: {
    backgroundColor: '#F0F9FF',
    borderColor: '#3B82F6',
    borderWidth: 2,
  },
  houseRank: {
    position: 'absolute',
    top: 16,
    right: 16,
    alignItems: 'center',
    zIndex: 1,
  },
  rankEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
  },
  houseInfo: {
    marginRight: 60,
  },
  houseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  houseEmblem: {
    fontSize: 40,
    marginRight: 16,
  },
  houseDetails: {
    flex: 1,
  },
  houseName: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  housePercentage: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  pointsSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  housePoints: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  pointsLabel: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
    marginLeft: 8,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  userHouseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  userHouseText: {
    fontSize: 14,
    color: '#92400E',
    fontWeight: '600',
  },
  competitionInfo: {
    marginTop: 8,
    marginBottom: 32,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  competitionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  competitionItem: {
    width: '47%',
    backgroundColor: '#F9FAFB',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
    minHeight: 100,
  },
  competitionLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 6,
    marginBottom: 3,
    textAlign: 'center',
    lineHeight: 14,
  },
  competitionValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '700',
    textAlign: 'center',
  },
  earnPointsSection: {
    marginBottom: 32,
  },
  tipsList: {
    gap: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  tipBullet: {
    fontSize: 18,
    color: '#3B82F6',
    fontWeight: 'bold',
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  tipPoints: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '700',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
});

export default LeaderboardScreen;