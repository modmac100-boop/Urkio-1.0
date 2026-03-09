const { onDocumentUpdated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

admin.initializeApp();

exports.notifySpecialistOnShare = onDocumentUpdated(
    "users/{userId}/reflections/{reflectionId}",
    async (event) => {
        const beforeData = event.data.before.data();
        const afterData = event.data.after.data();

        // Only run if the status was changed specifically to 'shared'
        if (beforeData.status !== "shared" && afterData.status === "shared") {
            const userId = event.params.userId;
            const reflectionText = afterData.text;

            console.log(`User ${userId} shared a Homii reflection.`);

            // Logic to find the assigned specialist (Example: looking up a 'specialistId' field)
            // For now, we will log it. You can integrate Email or Push Notifications here.

            const notificationPayload = {
                notification: {
                    title: "New Reflection Shared",
                    body: `A user has shared a new 'Homii' entry with you.`,
                },
                topic: "specialists", // Or a specific specialist's token
            };

            try {
                await admin.messaging().send(notificationPayload);
                console.log("Notification sent successfully");
            } catch (error) {
                console.error("Error sending notification:", error);
            }
        }

        return null;
    }
);
