import { collection, addDoc, setDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import { users, comments, books, lectures } from './data';

export async function initializeFirebaseData() {
  try {
    // Add sample posts to Firebase
    const samplePosts = [
      {
        title: 'The Symbiosis of Art and Science in the Renaissance',
        content: 'The Renaissance was a period of profound cultural and intellectual transformation, characterized by a remarkable fusion of art and science. This era, spanning roughly from the 14th to the 17th century, saw artists like Leonardo da Vinci and Michelangelo not merely as creators of aesthetic beauty, but as rigorous investigators of the natural world.',
        author: {
          id: 'kariuki-james',
          name: 'Kariuki James',
          avatarUrl: 'https://placehold.co/100x100.png'
        },
        createdAt: 'October 26, 2023',
        category: 'Art History',
        tags: ['Renaissance', 'Art', 'Science', 'Leonardo da Vinci'],
        excerpt: 'Explore the profound fusion of art and science during the Renaissance.',
        coverImage: 'https://placehold.co/1200x630.png',
        comments: comments,
        recommendedBooks: books,
        lectures: lectures,
        views: 0,
        references: []
      },
      {
        title: 'A Short Poem on Time',
        content: `A fleeting guest, a river's flow,\nWhere moments come and moments go.\nA silent thief, a healer's balm,\nIt brings the storm, and then the calm.`,
        author: {
          id: 'kariuki-james',
          name: 'Kariuki James',
          avatarUrl: 'https://placehold.co/100x100.png'
        },
        createdAt: 'November 5, 2023',
        category: 'Poetry',
        tags: ['Time', 'Life', 'Reflection'],
        excerpt: 'A brief, reflective poem on the ceaseless and multifaceted nature of time.',
        coverImage: 'https://placehold.co/1200x630.png',
        comments: [],
        recommendedBooks: [],
        lectures: [],
        views: 0,
        references: []
      }
    ];

    for (const post of samplePosts) {
      await addDoc(collection(db, 'posts'), post);
    }

    // Initialize analytics data
    const analyticsData = {
      overview: {
        totalPosts: samplePosts.length,
        totalUsers: users.length,
        totalViews: 0,
        totalComments: comments.length
      },
      userAnalytics: {
        timeRange: 'week',
        data: [],
        newUsers: users.length,
        activeUsers: Math.floor(users.length * 0.7)
      },
      contentAnalytics: {
        timeRange: 'week',
        data: [],
        topPosts: samplePosts.map(post => ({
          id: post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          title: post.title,
          views: 0,
          comments: post.comments.length
        })),
        engagement: {
          totalViews: 0,
          totalComments: comments.length
        }
      }
    };

    await setDoc(doc(db, 'analytics', 'overview'), analyticsData);
    console.log('Firebase initialized with sample data and analytics');
  } catch (error) {
    console.error('Error initializing Firebase:', error);
  }
}