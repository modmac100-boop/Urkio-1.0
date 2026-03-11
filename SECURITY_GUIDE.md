# Urkio Security Guide 🔒

This guide explains the security enhancements made to your project and provides instructions for advanced security features that require manual setup.

## 1. Enhancements Made

### Firestore & Storage Rules
We have implemented the **Principle of Least Privilege**:
- **Ownership Check**: Users can only modify their own profiles, posts, and reflections.
- **Data Validation**: Rules now check that post content is within limits and profile images are actually images (<5MB).
- **Admin Roles**: Special access for `BOARD`, `FOUNDER`, `SPECIALIST`, and `DOCTOR` is strictly defined.

### Secret Management
- Updated `.gitignore` to ensure `.env` files are never uploaded to GitHub, preventing API key exposure.

---

## 2. Advanced Security (Action Required)

### A. Firebase App Check
App Check prevents "bot" attacks and unauthorized traffic from accessing your Firebase services.

1.  **Go to Firebase Console** > **App Check**.
2.  **Register your Apps**:
    - **Web**: Use **reCAPTCHA Enterprise** or v3.
    - **iOS**: Use **App Attest**.
    - **Android**: Use **Play Integrity**.
3.  **Enforcement**: Once verified, click "Enforce" for Firestore and Storage.

### B. Multi-Factor Authentication (MFA)
MFA adds a second layer of security (like an SMS code) when logging in.

1.  **Go to Firebase Console** > **Authentication** > **Settings**.
2.  **User Actions**: Enable "Multi-factor authentication".
3.  **Implementation**: You will need to update your login UI to handle the second factor. (I can help with the code when you are ready).

### C. Email Verification
Strictly speaking, you should only allow certain actions if the user's email is verified.
- **Rules Update**: I can add `request.auth.token.email_verified == true` to your rules once you enable "Email Verification" in Auth settings.

---

## 3. Best Practices for You

1.  **Never Share `.env`**: This file contains your "keys to the kingdom".
2.  **Monitor Logs**: Check the **Firebase Console > Firestore > Usage** tab for any "Permission Denied" spikes, which could indicate an attack or a bug in the rules.
3.  **Rotate Keys**: If you ever suspect a leak, rotate your Google Cloud API keys immediately.

> [!TIP]
> Security is a process, not a destination. Regularly review who has Admin access in your `profiles` collection.
