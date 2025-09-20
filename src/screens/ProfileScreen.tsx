import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const ProfileScreen = () => {
  const { state, resetUserSession } = useUser();
  const navigation = useNavigation();
  const [showResetModal, setShowResetModal] = useState(false);

  const handleResetSession = () => {
    setShowResetModal(true);
  };

  const confirmReset = () => {
    setShowResetModal(false);
    resetUserSession();
  };

  const cancelReset = () => {
    setShowResetModal(false);
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

  const getHouseTraits = (house: string) => {
    switch (house.toLowerCase()) {
      case 'gryffindor':
        return 'Brave • Daring • Chivalrous';
      case 'hufflepuff':
        return 'Loyal • Patient • Hardworking';
      case 'ravenclaw':
        return 'Wise • Creative • Intelligent';
      case 'slytherin':
        return 'Ambitious • Cunning • Resourceful';
      default:
        return 'Magical • Unique • Special';
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

  if (!state.user) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#4A148C', '#7B1FA2', '#9C27B0', '#BA68C8']} style={styles.gradient}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading your profile...</Text>
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
            <View style={[styles.avatarContainer, { backgroundColor: getHouseColor(state.user.house) }]}>
              <Text style={styles.avatarEmoji}>🧙‍♂️</Text>
            </View>
            <Text style={styles.mainTitle}>{state.user.name}</Text>
            <Text style={styles.tagline}>{state.user.house} • Year {state.user.currentYear}</Text>
          </View>

          {/* Main Content Card */}
          <View style={styles.contentCard}>
            {/* Stats Grid */}
            <View style={styles.statsSection}>
              <Text style={styles.sectionTitle}>📊 My Wizarding Stats</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <View style={styles.statIconContainer}>
                    <Ionicons name="star" size={20} color="#F59E0B" />
                  </View>
                  <Text style={styles.statNumber}>{state.user.totalPoints}</Text>
                  <Text style={styles.statLabel}>House Points</Text>
                </View>
                <View style={styles.statItem}>
                  <View style={styles.statIconContainer}>
                    <Ionicons name="book" size={20} color="#3B82F6" />
                  </View>
                  <Text style={styles.statNumber}>{state.user.currentChapter}</Text>
                  <Text style={styles.statLabel}>Current Chapter</Text>
                </View>
                <View style={styles.statItem}>
                  <View style={styles.statIconContainer}>
                    <Ionicons name="flame" size={20} color="#EF4444" />
                  </View>
                  <Text style={styles.statNumber}>{state.user.streak}</Text>
                  <Text style={styles.statLabel}>Day Streak</Text>
                </View>
                <View style={styles.statItem}>
                  <View style={styles.statIconContainer}>
                    <Ionicons name="school" size={20} color="#8B5CF6" />
                  </View>
                  <Text style={styles.statNumber}>{state.user.currentYear}</Text>
                  <Text style={styles.statLabel}>Current Year</Text>
                </View>
              </View>
            </View>

            {/* Progress */}
            <View style={styles.progressSection}>
              <Text style={styles.sectionTitle}>📈 Journey Progress</Text>
              <View style={styles.progressItem}>
                <Text style={styles.progressLabel}>Hogwarts Years Completed</Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${((state.user.currentYear - 1) / 7) * 100}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>
                  {state.user.currentYear - 1} / 7 years
                </Text>
              </View>
            </View>

            {/* House Info */}
            <View style={styles.houseSection}>
              <Text style={styles.sectionTitle}>🏰 House Information</Text>
              <View style={styles.houseInfoCard}>
                <View style={styles.houseHeader}>
                  <Text style={styles.houseEmoji}>{getHouseEmblem(state.user.house)}</Text>
                  <View style={styles.houseDetails}>
                    <Text style={[styles.houseName, { color: getHouseColor(state.user.house) }]}>{state.user.house}</Text>
                    <Text style={styles.houseTraits}>{getHouseTraits(state.user.house)}</Text>
                  </View>
                </View>
                <Text style={styles.houseDescription}>
                  {getHouseDescription(state.user.house)}
                </Text>
              </View>
            </View>

            {/* Settings */}
            <View style={styles.settingsSection}>
              <Text style={styles.sectionTitle}>⚙️ Profile Settings</Text>
              <TouchableOpacity style={styles.settingItem}>
                <Ionicons name="person-outline" size={24} color="#6B7280" />
                <Text style={styles.settingText}>Edit Profile</Text>
                <Ionicons name="chevron-forward" size={20} color="#6B7280" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingItem}>
                <Ionicons name="notifications-outline" size={24} color="#6B7280" />
                <Text style={styles.settingText}>Notifications</Text>
                <Ionicons name="chevron-forward" size={20} color="#6B7280" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingItem}>
                <Ionicons name="help-circle-outline" size={24} color="#6B7280" />
                <Text style={styles.settingText}>Help & Support</Text>
                <Ionicons name="chevron-forward" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Developer Section */}
            <View style={styles.developerSection}>
              <Text style={styles.sectionTitle}>🔧 Developer Options</Text>
              <TouchableOpacity 
                style={[styles.settingItem, styles.resetButton]}
                onPress={handleResetSession}
              >
                <Ionicons name="refresh-outline" size={24} color="#EF4444" />
                <Text style={[styles.settingText, styles.resetText]}>Reset Session</Text>
                <Ionicons name="warning-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
              <Text style={styles.developerNote}>
                This will clear all your progress and take you back to the sorting ceremony.
              </Text>
            </View>
          </View>
        </ScrollView>
        </SafeAreaView>
      </LinearGradient>

      {/* Reset Confirmation Modal */}
      <Modal
        visible={showResetModal}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelReset}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Ionicons name="warning" size={48} color="#EF4444" />
              <Text style={styles.modalTitle}>Reset Session</Text>
            </View>
            
            <Text style={styles.modalMessage}>
              Are you sure you want to reset your session? This will clear all your progress and take you back to the sorting ceremony.
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={cancelReset}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={confirmReset}
              >
                <Text style={styles.confirmButtonText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
  avatarEmoji: {
    fontSize: 50,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  statsSection: {
    marginBottom: 32,
  },
  statsGrid: {
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
    marginBottom: 12,
    minHeight: 120,
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
  progressSection: {
    marginBottom: 32,
  },
  progressItem: {
    backgroundColor: '#F9FAFB',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  progressLabel: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
    marginBottom: 12,
  },
  progressBar: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  houseSection: {
    marginBottom: 32,
  },
  houseInfoCard: {
    backgroundColor: '#F9FAFB',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  houseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  houseEmoji: {
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
  houseTraits: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  houseDescription: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  settingsSection: {
    marginBottom: 32,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
    marginLeft: 16,
  },
  developerSection: {
    marginBottom: 32,
  },
  resetButton: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  resetText: {
    color: '#EF4444',
  },
  developerNote: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
    marginTop: 8,
    paddingHorizontal: 16,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 20,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 16,
  },
  modalMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ProfileScreen;