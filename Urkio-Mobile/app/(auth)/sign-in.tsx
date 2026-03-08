import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Platform,
    useWindowDimensions
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UrkioLogo } from '../../components/universal/UrkioLogo';
import { UrkioGradient } from '../../components/universal/UrkioGradient';
import { auth, db } from '../../services/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function SignInScreen() {
    const { role } = useLocalSearchParams<{ role: 'member' | 'expert' }>();
    const router = useRouter();
    const { width } = useWindowDimensions();

    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showRegSuccess, setShowRegSuccess] = useState(false);

    const isExpertPath = role === 'expert';
    const isLuxe = isExpertPath; // Keep the 'luxe' variant for experts

    // Responsive design thresholds
    const isDesktop = width >= 768;

    const [regData, setRegData] = useState({
        firstName: '',
        familyName: '',
        age: '',
        location: '',
        phone: '',
        gender: '',
        occupation: isExpertPath ? 'Expert Practitioner' : '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const passwordsMatch = useMemo(() => {
        return regData.password && regData.confirmPassword && regData.password === regData.confirmPassword;
    }, [regData.password, regData.confirmPassword]);

    const isFormValid = useMemo(() => {
        if (isLogin) return regData.email && regData.password;
        return (
            regData.firstName &&
            regData.familyName &&
            regData.age &&
            regData.location &&
            regData.phone &&
            regData.gender &&
            regData.occupation &&
            regData.email &&
            passwordsMatch &&
            regData.password.length >= 8
        );
    }, [isLogin, regData, passwordsMatch]);

    const handleSubmit = async () => {
        setError(null);
        setLoading(true);

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, regData.email, regData.password);
                router.replace('/(tabs)' as any); // Assuming '(tabs)' is the main app
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, regData.email, regData.password);

                if (userCredential.user) {
                    await setDoc(doc(db, 'profiles', userCredential.user.uid), {
                        id: userCredential.user.uid,
                        first_name: regData.firstName,
                        family_name: regData.familyName,
                        age: regData.age,
                        location: regData.location,
                        phone: regData.phone,
                        gender: regData.gender,
                        occupation: regData.occupation,
                        role: role ? role.toUpperCase() : 'MEMBER'
                    });

                    try {
                        const actionCodeSettings = {
                            url: Platform.OS === 'web' ? window.location.origin : 'https://urkio.com',
                            handleCodeInApp: true,
                        };
                        await sendEmailVerification(userCredential.user, actionCodeSettings);
                    } catch (emailErr) {
                        console.error("Error sending verification email:", emailErr);
                    }

                    setShowRegSuccess(true);
                    setTimeout(() => {
                        setShowRegSuccess(false);
                        router.replace('/(tabs)' as any);
                    }, 3000);
                }
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred during the session handshake.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <UrkioGradient isLuxe={isLuxe} style={styles.container}>
            <SafeAreaView style={styles.safeArea}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={[styles.backButton, isLuxe ? styles.backButtonLuxe : styles.backButtonCalm]}
                    >
                        <MaterialIcons name="arrow-back-ios" size={20} color={isLuxe ? '#A855F7' : '#6366F1'} />
                    </TouchableOpacity>

                    <View style={[styles.badge, isLuxe ? styles.badgeLuxe : styles.badgeCalm]}>
                        <MaterialIcons
                            name={isLuxe ? "medical-services" : "lock"}
                            size={14}
                            color={isLuxe ? '#A855F7' : '#10B981'}
                        />
                        <Text style={[styles.badgeText, isLuxe ? styles.badgeTextLuxe : styles.badgeTextCalm]}>
                            {isLuxe ? 'EXPERT PORTAL' : 'SECURE MEMBER ACCESS'}
                        </Text>
                    </View>
                </View>

                {/* Content */}
                <ScrollView
                    contentContainerStyle={[styles.scrollContent, isDesktop && styles.scrollContentDesktop]}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.logoContainer}>
                        <UrkioLogo size={isDesktop ? 100 : 80} variant={isLuxe ? 'luxe' : 'calm'} />
                        <Text style={[styles.title, isDesktop && styles.titleDesktop]}>
                            {isLogin
                                ? (isLuxe ? 'Expert Sign In' : 'Member Sign In')
                                : (isLuxe ? 'Join Expert Circle' : 'Join the Circle')
                            }
                        </Text>
                        <Text style={styles.subtitle}>
                            {isLogin
                                ? 'Authorized access to clinical workspaces.'
                                : 'Complete your professional profile to begin.'
                            }
                        </Text>
                    </View>

                    {error && (
                        <View style={styles.errorContainer}>
                            <MaterialIcons name="error" size={20} color="#EF4444" />
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}

                    <View style={styles.formContainer}>
                        {!isLogin && (
                            <View style={styles.registrationFields}>
                                <View style={styles.row}>
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>FIRST NAME</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={regData.firstName}
                                            onChangeText={(text) => setRegData({ ...regData, firstName: text })}
                                            placeholder="Alex"
                                            placeholderTextColor="#9ca3af"
                                        />
                                    </View>
                                    <View style={[styles.inputGroup, { marginLeft: 10 }]}>
                                        <Text style={styles.label}>FAMILY NAME</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={regData.familyName}
                                            onChangeText={(text) => setRegData({ ...regData, familyName: text })}
                                            placeholder="Johnson"
                                            placeholderTextColor="#9ca3af"
                                        />
                                    </View>
                                </View>

                                <View style={styles.row}>
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>AGE</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={regData.age}
                                            onChangeText={(text) => setRegData({ ...regData, age: text })}
                                            placeholder="24"
                                            keyboardType="numeric"
                                            placeholderTextColor="#9ca3af"
                                        />
                                    </View>
                                    <View style={[styles.inputGroup, { marginLeft: 10 }]}>
                                        <Text style={styles.label}>LOCATION</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={regData.location}
                                            onChangeText={(text) => setRegData({ ...regData, location: text })}
                                            placeholder="City, Country"
                                            placeholderTextColor="#9ca3af"
                                        />
                                    </View>
                                </View>

                                <View style={styles.inputGroupFull}>
                                    <Text style={styles.label}>CONTACT PHONE</Text>
                                    <View style={styles.inputWithIcon}>
                                        <MaterialIcons name="call" size={20} color="#9ca3af" style={styles.inputIcon} />
                                        <TextInput
                                            style={[styles.input, styles.inputWithPadding]}
                                            value={regData.phone}
                                            onChangeText={(text) => setRegData({ ...regData, phone: text })}
                                            placeholder="+00 000 0000"
                                            keyboardType="phone-pad"
                                            placeholderTextColor="#9ca3af"
                                        />
                                    </View>
                                </View>

                                <View style={styles.row}>
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>GENDER IDENTITY</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={regData.gender}
                                            onChangeText={(text) => setRegData({ ...regData, gender: text })}
                                            placeholder="Male/Female/Other"
                                            placeholderTextColor="#9ca3af"
                                        />
                                    </View>
                                    <View style={[styles.inputGroup, { marginLeft: 10 }]}>
                                        <Text style={styles.label}>OCCUPATION</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={regData.occupation}
                                            onChangeText={(text) => setRegData({ ...regData, occupation: text })}
                                            placeholder="e.g. Designer"
                                            placeholderTextColor="#9ca3af"
                                        />
                                    </View>
                                </View>
                            </View>
                        )}

                        <View style={styles.inputGroupFull}>
                            <Text style={styles.label}>IDENTITY EMAIL</Text>
                            <View style={styles.inputWithIcon}>
                                <MaterialIcons name="alternate-email" size={20} color="#9ca3af" style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, styles.inputWithPadding]}
                                    value={regData.email}
                                    onChangeText={(text) => setRegData({ ...regData, email: text })}
                                    placeholder="identity@urkio.com"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    placeholderTextColor="#9ca3af"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroupFull}>
                            <View style={styles.labelRow}>
                                <Text style={styles.label}>VAULT KEY (PASSWORD)</Text>
                                {isLogin && (
                                    <TouchableOpacity>
                                        <Text style={[styles.forgotText, isLuxe ? { color: '#A855F7' } : { color: '#6366F1' }]}>FORGOT?</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                            <View style={styles.inputWithIcon}>
                                <MaterialIcons name="lock" size={20} color="#9ca3af" style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, styles.inputWithPadding]}
                                    value={regData.password}
                                    onChangeText={(text) => setRegData({ ...regData, password: text })}
                                    placeholder="••••••••"
                                    secureTextEntry
                                    placeholderTextColor="#9ca3af"
                                />
                            </View>
                        </View>

                        {!isLogin && (
                            <View style={styles.inputGroupFull}>
                                <Text style={styles.label}>CONFIRM VAULT KEY</Text>
                                <View style={styles.inputWithIcon}>
                                    <MaterialIcons
                                        name={passwordsMatch ? "verified" : "lock-reset"}
                                        size={20}
                                        color={passwordsMatch ? "#10B981" : "#9ca3af"}
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        style={[
                                            styles.input,
                                            styles.inputWithPadding,
                                            passwordsMatch && styles.inputSuccess
                                        ]}
                                        value={regData.confirmPassword}
                                        onChangeText={(text) => setRegData({ ...regData, confirmPassword: text })}
                                        placeholder="••••••••"
                                        secureTextEntry
                                        placeholderTextColor="#9ca3af"
                                    />
                                </View>
                            </View>
                        )}

                        {!isLogin && !isFormValid && (regData.email || regData.password) && (
                            <View style={styles.warningContainer}>
                                <Text style={styles.warningText}>
                                    PROFILE STAGING INCOMPLETE. ENSURE ALL FIELDS AND 8+ CHAR PASSWORD ARE FILLED.
                                </Text>
                            </View>
                        )}

                        <TouchableOpacity
                            style={[
                                styles.submitButton,
                                isLuxe ? styles.submitButtonLuxe : styles.submitButtonCalm,
                                (!isFormValid || loading) && styles.submitButtonDisabled
                            ]}
                            onPress={handleSubmit}
                            disabled={loading || !isFormValid}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <>
                                    <Text style={styles.submitButtonText}>
                                        {isLogin ? 'INITIALIZE SESSION' : 'COMMIT REGISTRATION'}
                                    </Text>
                                    <MaterialIcons name="arrow-forward" size={20} color="#FFF" />
                                </>
                            )}
                        </TouchableOpacity>

                        {/* Developer Bypass */}
                        <TouchableOpacity
                            style={[styles.bypassButton, isLuxe ? { borderColor: 'rgba(168, 85, 247, 0.2)' } : { borderColor: 'rgba(99, 102, 241, 0.2)' }]}
                            onPress={() => router.replace('/(tabs)')}
                        >
                            <Text style={[styles.bypassText, isLuxe ? { color: '#A855F7' } : { color: '#6366F1' }]}>
                                DEVELOPER AUTH BYPASS
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>
                                {isLogin ? 'New to the platform?' : 'Already registered?'}
                            </Text>
                            <TouchableOpacity onPress={() => { setIsLogin(!isLogin); setError(null); }}>
                                <Text style={[styles.switchLink, isLuxe ? { color: '#A855F7' } : { color: '#6366F1' }]}>
                                    {isLogin ? 'REGISTER NOW' : 'GO TO SIGN IN'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>

                {showRegSuccess && (
                    <View style={styles.successOverlay}>
                        <View style={styles.successCard}>
                            <View style={[styles.successIconContainer, isLuxe ? styles.submitButtonLuxe : styles.submitButtonCalm]}>
                                <MaterialIcons name="person-add" size={40} color="#FFF" />
                            </View>
                            <Text style={styles.successTitle}>Verification Link Sent</Text>
                            <Text style={styles.successSubtitle}>
                                {regData.firstName}, your identity has been staged. Check your email.
                            </Text>
                        </View>
                    </View>
                )}
            </SafeAreaView>
        </UrkioGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        zIndex: 10,
    },
    backButton: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        ...Platform.select({
            web: { backdropFilter: 'blur(10px)' },
        }),
    },
    backButtonCalm: {
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderColor: 'rgba(99, 102, 241, 0.2)',
    },
    backButtonLuxe: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
    },
    badgeCalm: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderColor: 'rgba(16, 185, 129, 0.2)',
    },
    badgeLuxe: {
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        borderColor: 'rgba(168, 85, 247, 0.2)',
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1.5,
        marginLeft: 6,
    },
    badgeTextCalm: {
        color: '#059669',
    },
    badgeTextLuxe: {
        color: '#A855F7',
    },
    scrollContent: {
        paddingHorizontal: 30,
        paddingBottom: 50,
        paddingTop: 20,
    },
    scrollContentDesktop: {
        maxWidth: 600,
        alignSelf: 'center',
        width: '100%',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: '#0F172A',
        marginTop: -10,
        marginBottom: 8,
    },
    titleDesktop: {
        fontSize: 36,
    },
    subtitle: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '500',
        textAlign: 'center',
    },
    errorContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderColor: 'rgba(239, 68, 68, 0.2)',
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        marginBottom: 20,
    },
    errorText: {
        color: '#EF4444',
        fontSize: 10,
        fontWeight: 'bold',
        marginLeft: 10,
        flex: 1,
    },
    formContainer: {
        gap: 16,
    },
    registrationFields: {
        gap: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputGroup: {
        flex: 1,
    },
    inputGroupFull: {
        width: '100%',
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    label: {
        fontSize: 10,
        fontWeight: '900',
        color: '#94A3B8',
        letterSpacing: 2,
        marginBottom: 6,
        marginLeft: 4,
    },
    forgotText: {
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1,
    },
    input: {
        height: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderWidth: 1,
        borderColor: 'rgba(226, 232, 240, 0.5)',
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 14,
        fontWeight: '500',
        color: '#0F172A',
    },
    inputWithIcon: {
        position: 'relative',
        justifyContent: 'center',
    },
    inputIcon: {
        position: 'absolute',
        left: 16,
        zIndex: 1,
    },
    inputWithPadding: {
        paddingLeft: 48,
    },
    inputSuccess: {
        borderColor: 'rgba(16, 185, 129, 0.3)',
    },
    warningContainer: {
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderColor: 'rgba(245, 158, 11, 0.2)',
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
    },
    warningText: {
        color: '#F59E0B',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
        lineHeight: 14,
    },
    submitButton: {
        flexDirection: 'row',
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 8,
    },
    submitButtonDisabled: {
        opacity: 0.5,
    },
    submitButtonCalm: {
        backgroundColor: '#6366F1', // We should use a gradient component if we want, but sticking to solid for quick port
    },
    submitButtonLuxe: {
        backgroundColor: '#A855F7',
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 2,
        marginRight: 10,
    },
    bypassButton: {
        height: 48,
        borderRadius: 12,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginTop: 10,
    },
    bypassText: {
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 2,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
    },
    footerText: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '500',
    },
    switchLink: {
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 1.5,
        marginLeft: 8,
    },
    successOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
        ...Platform.select({
            web: { backdropFilter: 'blur(10px)' },
        }),
    },
    successCard: {
        alignItems: 'center',
        padding: 40,
    },
    successIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        shadowColor: 'rgba(16, 185, 129, 0.5)',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#FFF',
        marginBottom: 10,
    },
    successSubtitle: {
        fontSize: 14,
        color: '#94A3B8',
        fontWeight: '500',
        textAlign: 'center',
        maxWidth: 250,
    }
});
