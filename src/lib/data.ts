import type { User, Post, Comment, Book, Lecture } from './types';

export const users: User[] = [
  { id: 'user-1', name: 'Dr. Evelyn Reed', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: 'user-2', name: 'Marcus Grant', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: 'user-3', name: 'Clara Foster', avatarUrl: 'https://placehold.co/100x100.png' },
];

export const comments: Comment[] = [
  { id: 'comment-1', text: 'A fascinating read! The parallels drawn are thought-provoking.', author: users[1], createdAt: '2 days ago' },
  { id: 'comment-2', text: 'I would love to see a follow-up on the modern implications of this research.', author: users[2], createdAt: '1 day ago' },
];

export const books: Book[] = [
  { id: 'book-1', title: 'The Structure of Scientific Revolutions', author: 'Thomas S. Kuhn', imageUrl: 'https://placehold.co/300x400.png' },
  { id: 'book-2', title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', imageUrl: 'https://placehold.co/300x400.png' },
];

export const lectures: Lecture[] = [
  { id: 'lecture-1', title: 'Introduction to Quantum Mechanics', type: 'video', embedUrl: '#', thumbnailUrl: 'https://placehold.co/400x225.png' },
  { id: 'lecture-2', title: 'The Philosophy of Science', type: 'slides', embedUrl: '#', thumbnailUrl: 'https://placehold.co/400x225.png' },
];

export const posts: Post[] = [
  {
    id: '1',
    title: 'The Symbiosis of Art and Science in the Renaissance',
    content: 'The Renaissance was a period of profound cultural and intellectual transformation, characterized by a remarkable fusion of art and science. This era, spanning roughly from the 14th to the 17th century, saw artists like Leonardo da Vinci and Michelangelo not merely as creators of aesthetic beauty, but as rigorous investigators of the natural world. Leonardo\'s anatomical studies, for instance, were not just preparatory sketches for his paintings but were scientific inquiries in their own right, revealing a deep understanding of human physiology. His work on perspective was deeply rooted in mathematics, transforming the canvas into a three-dimensional space. This synergy was not a one-way street. Scientific advancements in optics and geometry provided artists with new tools and frameworks, while the artists\' pursuit of realism pushed the boundaries of anatomical and botanical knowledge. The period’s emphasis on humanism placed humanity at the center of the universe, encouraging a holistic approach to knowledge where art and science were two sides of the same coin, both aiming to understand and represent the world in its full complexity. This long post delves into the intricate relationship between these two domains, exploring how their collaboration led to some of the most significant achievements in human history.',
    author: users[0],
    createdAt: 'October 26, 2023',
    category: 'Art History',
    tags: ['Renaissance', 'Art', 'Science', 'Leonardo da Vinci'],
    excerpt: 'Explore the profound fusion of art and science during the Renaissance, where masters like Leonardo da Vinci became both great artists and rigorous investigators.',
    coverImage: 'https://placehold.co/1200x630.png',
    comments: comments,
    recommendedBooks: books,
    lectures: lectures,
  },
  {
    id: '2',
    title: 'A Short Poem on Time',
    content: `A fleeting guest, a river’s flow,
Where moments come and moments go.
A silent thief, a healer’s balm,
It brings the storm, and then the calm.

It marches on, a steady beat,
With bittersweet and hurried feet.
So grasp the now, before it’s past,
For in its grip, nothing can last.`,
    author: users[1],
    createdAt: 'November 5, 2023',
    category: 'Poetry',
    tags: ['Time', 'Life', 'Reflection'],
    excerpt: 'A brief, reflective poem on the ceaseless and multifaceted nature of time.',
    coverImage: 'https://placehold.co/1200x630.png',
    comments: [],
    recommendedBooks: [],
    lectures: [],
  },
  {
    id: '3',
    title: 'Quantum Entanglement: Spooky Action at a Distance',
    content: 'Quantum entanglement is one of the most bizarre and fascinating phenomena in physics. Described by Einstein as "spooky action at a distance," it occurs when two or more quantum particles become linked in such a way that their fates are intertwined, regardless of the distance separating them. This means that measuring a property of one particle, such as its spin, instantaneously influences the corresponding property of the other particle(s). This connection defies classical intuition and the principle of locality, which states that an object is only directly influenced by its immediate surroundings. The implications of entanglement are profound, forming the bedrock of emerging technologies like quantum computing and quantum cryptography. Quantum computers leverage entanglement to perform complex calculations far beyond the reach of classical computers, while quantum cryptography uses it to create unbreakable communication channels. Despite its strangeness, entanglement has been repeatedly verified by experiments, challenging our fundamental understanding of reality and opening up new frontiers for technological innovation.',
    author: users[2],
    createdAt: 'November 12, 2023',
    category: 'Physics',
    tags: ['Quantum Mechanics', 'Physics', 'Technology'],
    excerpt: 'Delve into the mysterious world of quantum entanglement, Einstein\'s "spooky action at a distance," and its revolutionary impact on computing and cryptography.',
    coverImage: 'https://placehold.co/1200x630.png',
    comments: [],
    recommendedBooks: [books[0]],
    lectures: [lectures[0]],
  },
];
