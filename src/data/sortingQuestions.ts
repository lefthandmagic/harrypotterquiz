import { SortingQuestion } from '../types';

export const sortingQuestions: SortingQuestion[] = [
  {
    id: '1',
    text: 'You find a cursed artifact in a dusty corner of the castle. What is your first instinct?',
    options: [
      { text: 'Inform a professor to ensure safety.', gryffindor: 1, hufflepuff: 5, ravenclaw: 2, slytherin: 0 },
      { text: 'Face the danger and destroy it.', gryffindor: 5, hufflepuff: 1, ravenclaw: 0, slytherin: 2 },
      { text: 'Study it to understand its magic.', gryffindor: 0, hufflepuff: 2, ravenclaw: 5, slytherin: 3 },
      { text: 'Attempt to control its power.', gryffindor: 2, hufflepuff: 0, ravenclaw: 3, slytherin: 5 },
    ],
  },
  {
    id: '2',
    text: 'A magical crossroads offers four paths. Which do you take?',
    options: [
      { text: 'The path towards a grand adventure.', gryffindor: 4, hufflepuff: 2, ravenclaw: 1, slytherin: 1 },
      { text: 'The path towards a friendly village.', gryffindor: 1, hufflepuff: 4, ravenclaw: 2, slytherin: 1 },
      { text: 'The path towards an ancient library.', gryffindor: 1, hufflepuff: 1, ravenclaw: 4, slytherin: 2 },
      { text: 'The path towards a secret cave.', gryffindor: 2, hufflepuff: 1, ravenclaw: 3, slytherin: 4 },
    ],
  },
  {
    id: '3',
    text: 'What desire would the Mirror of Erised most likely show you?',
    options: [
      { text: 'Accomplishing a heroic deed.', gryffindor: 5, hufflepuff: 0, ravenclaw: 0, slytherin: 0 },
      { text: 'Being with happy friends and family.', gryffindor: 0, hufflepuff: 5, ravenclaw: 0, slytherin: 0 },
      { text: 'Solving a great magical mystery.', gryffindor: 0, hufflepuff: 0, ravenclaw: 5, slytherin: 0 },
      { text: 'Achieving ultimate power and influence.', gryffindor: 0, hufflepuff: 0, ravenclaw: 0, slytherin: 5 },
    ],
  },
  {
    id: '4',
    text: 'Which magical school subject would you excel at naturally?',
    options: [
      { text: 'Defence Against the Dark Arts, for its practical action.', gryffindor: 5, hufflepuff: 1, ravenclaw: 1, slytherin: 2 },
      { text: 'Herbology, for its nurturing and patience.', gryffindor: 1, hufflepuff: 5, ravenclaw: 2, slytherin: 1 },
      { text: 'Ancient Runes, for deciphering forgotten secrets.', gryffindor: 1, hufflepuff: 2, ravenclaw: 5, slytherin: 3 },
      { text: 'Potions, for its subtle power and precision.', gryffindor: 2, hufflepuff: 1, ravenclaw: 3, slytherin: 5 },
    ],
  },
  {
    id: '5',
    text: 'You are offered a choice of four magical goblets to drink from. Which do you choose?',
    options: [
      { text: 'The golden goblet of victory.', gryffindor: 4, hufflepuff: 2, ravenclaw: 1, slytherin: 3 },
      { text: 'The wooden cup of shared joy.', gryffindor: 2, hufflepuff: 4, ravenclaw: 2, slytherin: 1 },
      { text: 'The crystal goblet of wisdom.', gryffindor: 1, hufflepuff: 1, ravenclaw: 4, slytherin: 2 },
      { text: 'The silver goblet of ambition.', gryffindor: 3, hufflepuff: 1, ravenclaw: 2, slytherin: 4 },
    ],
  },
  {
    id: '6',
    text: 'A troll is blocking your path to the library. How do you get past it?',
    options: [
      { text: 'Distract it with a brave dash.', gryffindor: 4, hufflepuff: 1, ravenclaw: 2, slytherin: 2 },
      { text: 'Find something to trade for passage.', gryffindor: 1, hufflepuff: 4, ravenclaw: 3, slytherin: 1 },
      { text: 'Exploit a weakness you read about.', gryffindor: 2, hufflepuff: 2, ravenclaw: 4, slytherin: 3 },
      { text: 'Trick it into clearing the path.', gryffindor: 2, hufflepuff: 1, ravenclaw: 3, slytherin: 4 },
    ],
  },
  {
    id: '7',
    text: 'On a quiet afternoon at Hogwarts, where would we most likely find you?',
    options: [
      { text: 'Flying on the Quidditch pitch.', gryffindor: 4, hufflepuff: 2, ravenclaw: 1, slytherin: 3 },
      { text: 'In the kitchens with the house-elves.', gryffindor: 1, hufflepuff: 4, ravenclaw: 2, slytherin: 1 },
      { text: 'In the library with a rare book.', gryffindor: 1, hufflepuff: 3, ravenclaw: 4, slytherin: 2 },
      { text: 'In the common room, planning ahead.', gryffindor: 2, hufflepuff: 1, ravenclaw: 2, slytherin: 4 },
    ],
  },
];