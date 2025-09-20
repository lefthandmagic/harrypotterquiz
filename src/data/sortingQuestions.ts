import { SortingQuestion } from '../types';

export const sortingQuestions: SortingQuestion[] = [
  {
    id: '1',
    text: 'What would you most despise being called?',
    options: [
      { text: 'Ordinary', gryffindor: 0, hufflepuff: 0, ravenclaw: 0, slytherin: 5 },
      { text: 'Ignorant', gryffindor: 0, hufflepuff: 0, ravenclaw: 5, slytherin: 0 },
      { text: 'Cowardly', gryffindor: 5, hufflepuff: 0, ravenclaw: 0, slytherin: 0 },
      { text: 'Selfish', gryffindor: 0, hufflepuff: 5, ravenclaw: 0, slytherin: 0 },
    ],
  },
  {
    id: '2',
    text: 'Which magical creature fascinates you most?',
    options: [
      { text: 'Noble centaurs and their ancient wisdom', gryffindor: 3, hufflepuff: 2, ravenclaw: 4, slytherin: 1 },
      { text: 'Cunning goblins and their intricate societies', gryffindor: 1, hufflepuff: 2, ravenclaw: 3, slytherin: 4 },
      { text: 'Mysterious ghosts and their unfinished stories', gryffindor: 2, hufflepuff: 4, ravenclaw: 3, slytherin: 1 },
      { text: 'Powerful trolls and their raw strength', gryffindor: 4, hufflepuff: 1, ravenclaw: 2, slytherin: 3 },
    ],
  },
  {
    id: '3',
    text: 'You discover an enchanted garden. What captures your attention first?',
    options: [
      { text: 'Silver-leafed tree bearing gleaming golden fruit', gryffindor: 4, hufflepuff: 2, ravenclaw: 3, slytherin: 1 },
      { text: 'Plump red toadstools whispering secrets to each other', gryffindor: 1, hufflepuff: 4, ravenclaw: 2, slytherin: 3 },
      { text: 'Shimmering pool with luminous mysteries swirling beneath', gryffindor: 2, hufflepuff: 3, ravenclaw: 4, slytherin: 1 },
      { text: 'Ancient wizard statue with eyes that seem to follow you', gryffindor: 3, hufflepuff: 1, ravenclaw: 2, slytherin: 4 },
    ],
  },
  {
    id: '4',
    text: 'Four enchanted boxes await. Which calls to you?',
    options: [
      { text: 'Delicate tortoiseshell box with gold inlay, from which tiny squeaks emerge', gryffindor: 2, hufflepuff: 4, ravenclaw: 1, slytherin: 3 },
      { text: 'Obsidian box bearing Merlin\'s silver rune and an ancient lock', gryffindor: 3, hufflepuff: 1, ravenclaw: 4, slytherin: 2 },
      { text: 'Golden casket on clawed feet warning of forbidden knowledge within', gryffindor: 4, hufflepuff: 2, ravenclaw: 3, slytherin: 1 },
      { text: 'Humble pewter box marked "I open only for the worthy"', gryffindor: 1, hufflepuff: 3, ravenclaw: 2, slytherin: 4 },
    ],
  },
  {
    id: '5',
    text: 'Which magical instrument stirs your soul?',
    options: [
      { text: 'Enchanted piano with keys that glow as they play', gryffindor: 1, hufflepuff: 3, ravenclaw: 4, slytherin: 2 },
      { text: 'Thunderous war drums that echo with ancient power', gryffindor: 4, hufflepuff: 2, ravenclaw: 1, slytherin: 3 },
      { text: 'Ethereal violin that weaves melodies from moonbeams', gryffindor: 2, hufflepuff: 4, ravenclaw: 3, slytherin: 1 },
      { text: 'Commanding trumpet that calls heroes to destiny', gryffindor: 3, hufflepuff: 1, ravenclaw: 2, slytherin: 4 },
    ],
  },
  {
    id: '6',
    text: 'What would test your endurance most severely?',
    options: [
      { text: 'Gnawing hunger that weakens your resolve', gryffindor: 2, hufflepuff: 4, ravenclaw: 1, slytherin: 3 },
      { text: 'Bitter cold that chills you to the bone', gryffindor: 3, hufflepuff: 2, ravenclaw: 4, slytherin: 1 },
      { text: 'Crushing loneliness that isolates your spirit', gryffindor: 1, hufflepuff: 3, ravenclaw: 2, slytherin: 4 },
      { text: 'Mind-numbing tedium that stifles your ambition', gryffindor: 4, hufflepuff: 1, ravenclaw: 3, slytherin: 2 },
    ],
  },
  {
    id: '7',
    text: 'The legendary Flutterby bush blooms once per century, its flowers mimicking the scent that most enchants each person. What would it smell like to lure you?',
    options: [
      { text: 'Roaring fireplace on a winter\'s night', gryffindor: 4, hufflepuff: 2, ravenclaw: 1, slytherin: 3 },
      { text: 'Wild ocean spray and endless horizons', gryffindor: 2, hufflepuff: 3, ravenclaw: 4, slytherin: 1 },
      { text: 'Fresh ink and crisp parchment ready for writing', gryffindor: 1, hufflepuff: 2, ravenclaw: 4, slytherin: 3 },
      { text: 'The warmth and comfort of home', gryffindor: 3, hufflepuff: 4, ravenclaw: 2, slytherin: 1 },
    ],
  },
];

