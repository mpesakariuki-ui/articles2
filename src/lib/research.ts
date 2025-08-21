import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function getResearchPaper(id: string) {
  try {
    const docRef = doc(db, 'research', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching research paper:', error);
    return null;
  }
}