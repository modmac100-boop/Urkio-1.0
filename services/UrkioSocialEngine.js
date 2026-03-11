
import { auth, db, rtdb } from './firebase';
import { ref, onValue, set, onDisconnect, serverTimestamp } from 'firebase/database';
import { doc, updateDoc, serverTimestamp as firestoreTimestamp, collection, query, where, getDocs } from 'firebase/firestore';

/**
 * Urkio Social Engine
 * Handles real-time presence, networking, and social synchronization.
 */

export const UrkioSocialEngine = {
    /**
     * Initialize presence tracking for the current user.
     * Sets status to 'online' in RTDB and syncs to Firestore.
     */
    initPresence: (uid) => {
        if (!uid) return;

        const userStatusDatabaseRef = ref(rtdb, `/status/${uid}`);
        const userStatusFirestoreRef = doc(db, 'users', uid);

        const isOfflineForDatabase = {
            state: 'offline',
            last_changed: serverTimestamp(),
        };

        const isOnlineForDatabase = {
            state: 'online',
            last_changed: serverTimestamp(),
        };

        // Reference to the special '.info/connected' path in RTDB
        const connectedRef = ref(rtdb, '.info/connected');

        onValue(connectedRef, (snapshot) => {
            if (snapshot.val() === false) {
                // If we lose connection, we don't need to do anything immediately
                // The onDisconnect will handle the status change
                return;
            }

            // When we are connected, set up onDisconnect
            onDisconnect(userStatusDatabaseRef)
                .set(isOfflineForDatabase)
                .then(() => {
                    // Set current status to online
                    set(userStatusDatabaseRef, isOnlineForDatabase);
                    
                    // Sync to Firestore for easier querying
                    updateDoc(userStatusFirestoreRef, {
                        status: 'online',
                        lastSeen: firestoreTimestamp()
                    }).catch(err => console.error("Firestore presence sync error:", err));
                });
        });

        // Set up a listener to update Firestore when RTDB status changes to offline
        // This is a safety measure if onDisconnect doesn't trigger a Firestore update directly
        onValue(userStatusDatabaseRef, (snapshot) => {
            const status = snapshot.val();
            if (status && status.state === 'offline') {
                updateDoc(userStatusFirestoreRef, {
                    status: 'offline',
                    lastSeen: firestoreTimestamp()
                }).catch(err => console.error("Firestore offline sync error:", err));
            }
        });
    },

    /**
     * Monitor online status of a specific user.
     */
    monitorUserPresence: (uid, callback) => {
        const userStatusRef = ref(rtdb, `/status/${uid}`);
        return onValue(userStatusRef, (snapshot) => {
            callback(snapshot.val());
        });
    },

    /**
     * Send a connection request to another user/expert.
     */
    sendConnectionRequest: async (senderId, receiverId, type = 'user') => {
        try {
            const networkingRef = doc(db, 'networking', `${senderId}_${receiverId}`);
            await set(networkingRef, {
                senderId,
                receiverId,
                status: 'pending',
                type, // 'user' or 'expert'
                timestamp: firestoreTimestamp()
            });
            console.log("Connection request sent.");
        } catch (err) {
            console.error("Error sending connection request:", err);
            throw err;
        }
    },

    /**
     * Accept a pending connection request.
     */
    acceptConnectionRequest: async (requestId) => {
        try {
            const networkingRef = doc(db, 'networking', requestId);
            await updateDoc(networkingRef, {
                status: 'connected',
                connectedAt: firestoreTimestamp()
            });
            console.log("Connection request accepted.");
        } catch (err) {
            console.error("Error accepting connection request:", err);
            throw err;
        }
    },

    /**
     * Follow an expert.
     */
    followExpert: async (userId, expertId) => {
        try {
            const followRef = doc(db, 'following', `${userId}_${expertId}`);
            await set(followRef, {
                userId,
                expertId,
                timestamp: firestoreTimestamp()
            });
            
            // Also update the expert's follower count (optional but good practice)
            const expertRef = doc(db, 'experts', expertId);
            // Note: Incrementing usually requires a transaction or field value increment
            // but for simplicity we'll just log it here.
            console.log("Following expert:", expertId);
        } catch (err) {
            console.error("Error following expert:", err);
            throw err;
        }
    },

    /**
     * Get the networking list (friends/experts) for a user.
     */
    getNetworkingList: async (uid) => {
        try {
            const q = query(
                collection(db, 'networking'),
                where('status', '==', 'connected'),
                where('senderId', '==', uid)
            );
            const snapshot = await getDocs(q);
            const list = [];
            snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
            
            // Also check where user is the receiver
            const q2 = query(
                collection(db, 'networking'),
                where('status', '==', 'connected'),
                where('receiverId', '==', uid)
            );
            const snapshot2 = await getDocs(q2);
            snapshot2.forEach(doc => list.push({ id: doc.id, ...doc.data() }));

            return list;
        } catch (err) {
            console.error("Error fetching networking list:", err);
            return [];
        }
    }
};

export default UrkioSocialEngine;
