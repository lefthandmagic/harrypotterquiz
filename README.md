# Wizarding World Quiz 🧙‍♂️

A magical Harry Potter trivia app built with React Native and Expo, featuring the complete seven-year journey through Hogwarts!

## Features ✨

### Core Features
- **Sorting Ceremony**: Personality-based quiz to sort users into Hogwarts houses
- **Seven-Year Journey**: Progressive quiz system through all seven Harry Potter books
- **House Cup Competition**: Real-time leaderboard with house points system
- **Daily Prophet**: Daily quiz challenges with streak rewards
- **User Profiles**: Track progress, badges, and collectibles
- **Offline Support**: All data stored locally using AsyncStorage

### House System
- **Gryffindor** 🦁: Bravery, courage, chivalry, nerve
- **Hufflepuff** 🦡: Loyalty, patience, fairness, hard work  
- **Ravenclaw** 🦅: Intelligence, wisdom, creativity, learning
- **Slytherin** 🐍: Ambition, cunning, leadership, resourcefulness

### Quiz Features
- Multiple choice questions with explanations
- Progressive difficulty through years and chapters
- Timer-based challenges (30s per question)
- Score tracking and house points
- Achievement badges and chocolate frog cards
- Daily streak rewards

## Getting Started 🚀

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI
- iOS Simulator or Android Emulator (or Expo Go app)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd harrypotterquiz
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
```bash
# iOS
npm run ios

# Android  
npm run android

# Web
npm run web
```

## Project Structure 📁

```
src/
├── components/          # Reusable UI components
├── contexts/           # React context providers
│   └── UserContext.tsx # User state management
├── data/              # Static data and questions
│   ├── questions.ts   # Quiz questions database
│   └── sortingQuestions.ts # Sorting ceremony questions
├── navigation/         # Navigation configuration
│   └── AppNavigator.tsx
├── screens/           # App screens
│   ├── SortingCeremonyScreen.tsx
│   ├── HomeScreen.tsx
│   ├── QuizScreen.tsx
│   ├── ProfileScreen.tsx
│   ├── LeaderboardScreen.tsx
│   └── DailyProphetScreen.tsx
├── types/             # TypeScript type definitions
│   └── index.ts
└── utils/             # Utility functions
```

## Features Overview 🎯

### Sorting Ceremony
- 7 personality-based questions
- Algorithm calculates house affinity scores
- Beautiful sorting hat animation
- Immediate house assignment

### Seven-Year Journey
- 8 chapters per year (Year 1 implemented)
- Progressive unlocking system
- 70% pass rate required to advance
- House points earned for correct answers

### Daily Prophet
- 5 random questions daily
- 20-second timer per question
- Streak bonus rewards
- Fresh content every day

### User Profile
- House information and traits
- Progress tracking
- Badge collection
- Chocolate frog card gallery
- Wand and patronus (future features)

### House Cup Leaderboard
- Real-time house rankings
- Individual contribution tracking
- House information and mottos
- Competition rules and tips

## Data Storage 💾

The app uses AsyncStorage for local data persistence:
- User profile and progress
- House points and achievements
- Daily quiz completion status
- Streak tracking

## Styling & UI 🎨

- **Color Scheme**: Harry Potter themed colors
  - Gryffindor: #7F0909 (Scarlet)
  - Hufflepuff: #FFDB00 (Yellow)
  - Ravenclaw: #0E1A40 (Blue)
  - Slytherin: #1A472A (Green)
  - Gold accents: #FFD700
  - Parchment: #F5E6D3

- **Typography**: Gothic-inspired fonts
- **Animations**: Smooth transitions and magical effects
- **Icons**: Ionicons with custom magical styling

## Future Enhancements 🔮

### Planned Features
- **Duelling Club**: Player vs player trivia battles
- **O.W.L.s & N.E.W.T.s**: Major exams at Year 5 & 7
- **Wand & Patronus**: Unlock through special quizzes
- **Push Notifications**: Daily Prophet reminders
- **Social Features**: Friend challenges and sharing
- **More Years**: Complete Years 2-7 with full question sets

### Technical Improvements
- **Backend Integration**: Firebase for multiplayer features
- **Analytics**: User progress and engagement tracking
- **Accessibility**: Screen reader support and high contrast
- **Performance**: Image optimization and lazy loading
- **Testing**: Unit and integration tests

## Contributing 🤝

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments 🙏

- J.K. Rowling for creating the magical world of Harry Potter
- The Harry Potter fandom for inspiration
- React Native and Expo communities
- All contributors and testers

---

*"It is our choices, Harry, that show what we truly are, far more than our abilities."* - Albus Dumbledore

Made with ❤️ for Harry Potter fans worldwide! 🪄

