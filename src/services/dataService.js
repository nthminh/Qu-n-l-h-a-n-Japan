import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// Collection names
const ENGINEERS_COLLECTION = 'engineers';
const INVOICES_COLLECTION = 'invoices';

// Engineer operations
export const engineerService = {
  // Add a new engineer
  async addEngineer(engineerData) {
    try {
      const docRef = await addDoc(collection(db, ENGINEERS_COLLECTION), {
        ...engineerData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { id: docRef.id, success: true };
    } catch (error) {
      console.error('Error adding engineer:', error);
      throw error;
    }
  },

  // Get all engineers
  async getAllEngineers() {
    try {
      const q = query(collection(db, ENGINEERS_COLLECTION), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting engineers:', error);
      throw error;
    }
  },

  // Update an engineer
  async updateEngineer(id, engineerData) {
    try {
      const engineerRef = doc(db, ENGINEERS_COLLECTION, id);
      await updateDoc(engineerRef, {
        ...engineerData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating engineer:', error);
      throw error;
    }
  },

  // Delete an engineer
  async deleteEngineer(id) {
    try {
      await deleteDoc(doc(db, ENGINEERS_COLLECTION, id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting engineer:', error);
      throw error;
    }
  }
};

// Invoice operations
export const invoiceService = {
  // Add a new invoice
  async addInvoice(invoiceData) {
    try {
      const docRef = await addDoc(collection(db, INVOICES_COLLECTION), {
        ...invoiceData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { id: docRef.id, success: true };
    } catch (error) {
      console.error('Error adding invoice:', error);
      throw error;
    }
  },

  // Get all invoices
  async getAllInvoices() {
    try {
      const q = query(collection(db, INVOICES_COLLECTION), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting invoices:', error);
      throw error;
    }
  },

  // Update an invoice
  async updateInvoice(id, invoiceData) {
    try {
      const invoiceRef = doc(db, INVOICES_COLLECTION, id);
      await updateDoc(invoiceRef, {
        ...invoiceData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating invoice:', error);
      throw error;
    }
  },

  // Delete an invoice
  async deleteInvoice(id) {
    try {
      await deleteDoc(doc(db, INVOICES_COLLECTION, id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  }
};
