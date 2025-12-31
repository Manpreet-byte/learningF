// Achievement catalog
// These are displayed in the Achievements page; unlocking stored via storage API

const achievements = [
  {
    id: 'first-steps',
    title: 'First Steps',
    description: 'Complete your first lesson.',
    criteria: 'Mark any lesson as completed.'
  },
  {
    id: 'speed-run',
    title: 'Speed Runner',
    description: 'Complete a lesson in under 3 minutes.',
    criteria: 'Use the timer and finish within the limit.'
  },
  {
    id: 'night-owl',
    title: 'Night Owl',
    description: 'Switch to dark theme.',
    criteria: 'Toggle dark mode from the navbar.'
  },
  {
    id: 'snippet-saver',
    title: 'Snippet Saver',
    description: 'Save a code snippet from the Playground.',
    criteria: 'Use Save Snippet in Playground.'
  },
  {
    id: 'sharing-is-caring',
    title: 'Sharing is Caring',
    description: 'Create a shareable Playground link.',
    criteria: 'Copy a share link from Playground.'
  }
];

export default achievements;
