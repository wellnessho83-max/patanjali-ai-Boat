import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, storage, handleFirestoreError, OperationType } from '../lib/firebase';
import { 
  onAuthStateChanged, 
  User, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfileData: (data: { displayName?: string; photoURL?: string }) => Promise<void>;
  uploadProfilePhoto: (file: File) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Sync user profile to Firestore
        try {
          const userDocRef = doc(db, 'users', user.uid);
          let userDoc;
          try {
            userDoc = await getDoc(userDocRef);
          } catch (error) {
            handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
            return;
          }
          
          if (!userDoc.exists()) {
            try {
              await setDoc(userDocRef, {
                userId: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                createdAt: serverTimestamp(),
              });
            } catch (error) {
              handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}`);
              return;
            }
          }
        } catch (globalError) {
          console.error("Auth sync error:", globalError);
        }
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const updateProfileData = async (data: { displayName?: string; photoURL?: string }) => {
    if (!auth.currentUser) return;
    const path = `users/${auth.currentUser.uid}`;
    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(userDocRef, {
        ...data,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const uploadProfilePhoto = async (file: File) => {
    if (!auth.currentUser) throw new Error('Not authenticated');
    
    const fileName = `profile_photos/${auth.currentUser.uid}_${Date.now()}`;
    const storageRef = ref(storage, fileName);
    
    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Also update the Firestore profile automatically with the new photoURL
      await updateProfileData({ photoURL: downloadURL });
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout, updateProfileData, uploadProfilePhoto }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
