import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    Platform,
    StatusBar,
    useWindowDimensions
} from 'react-native';
import { Stack } from 'expo-router';
import { Languages, LayoutList, LogIn, User, Stethoscope, Share2 } from 'lucide-react-native';
import { UrkioLogo } from '../components/universal/UrkioLogo';
import { UrkioGradient } from '../components/universal/UrkioGradient';



type Language = 'en' | 'ar' | 'fr';
type Variant = 'calm' | 'luxe';

export default function LandingPage() {
    const [language, setLanguage] = useState<Language>('en');
    const [variant, setVariant] = useState<Variant>('calm');
    const { width, height } = useWindowDimensions();
    const isLuxe = variant === 'luxe';
    const isDesktop = width > 768;
    const isLargeDesktop = width > 1200;

    const t = {
        en: {
            welcome: 'Welcome to',
            memberLabel: 'Join as Member',
            expertLabel: 'Join as Expert',
            alreadyMember: 'Already a member?',
            signIn: 'Sign In',
            calm: 'Calm',
            luxe: 'Luxe',
            journey: 'Your Journey Within'
        },
        ar: {
            welcome: 'مرحباً بكم في',
            memberLabel: 'انضم كعضو',
            expertLabel: 'انضم كخبير',
            alreadyMember: 'هل أنت عضو بالفعل؟',
            signIn: 'تسجيل الدخول',
            calm: 'هادئ',
            luxe: 'فاخر',
            journey: 'رحلتك إلى الداخل'
        },
        fr: {
            welcome: 'Bienvenue sur',
            memberLabel: 'Rejoindre en tant que membre',
            expertLabel: 'Rejoindre en tant qu\'expert',
            alreadyMember: 'Déjà membre ?',
            signIn: 'Se connecter',
            calm: 'Calme',
            luxe: 'Luxe',
            journey: 'Votre voyage intérieur'
        }
    }[language];

    const toggleLanguage = () => {
        const sequence: Language[] = ['en', 'fr', 'ar'];
        const nextIndex = (sequence.indexOf(language) + 1) % sequence.length;
        setLanguage(sequence[nextIndex]);
    };

    const handleJoin = (role: 'member' | 'expert') => {
        console.log(`Joining as ${role}`);
        if (Platform.OS === 'web') {
            window.alert(`Joining as ${role}`);
        }
    };

    const isRTL = language === 'ar';

    return (
        <UrkioGradient isLuxe={isLuxe} style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar barStyle={isLuxe ? 'light-content' : 'dark-content'} />

            <SafeAreaView style={styles.safeArea}>
                <View style={[
                    styles.content,
                    { flexDirection: isRTL ? 'row-reverse' : 'column' },
                    isDesktop && styles.contentDesktop
                ]}>

                    {/* Header Controls */}
                    <View style={[styles.header, isRTL && { flexDirection: 'row-reverse' }]}>
                        <TouchableOpacity style={styles.iconButton}>
                            <Share2 size={20} color={isLuxe ? '#fff6' : '#0006'} />
                        </TouchableOpacity>

                        <View style={[styles.rightControls, isRTL && { flexDirection: 'row-reverse' }]}>
                            <TouchableOpacity onPress={toggleLanguage} style={styles.langButton}>
                                <Text style={[styles.langText, { color: isLuxe ? '#fff' : '#000' }]}>
                                    {language.toUpperCase()}
                                </Text>
                            </TouchableOpacity>

                            <View style={styles.variantToggle}>
                                <TouchableOpacity
                                    onPress={() => setVariant('calm')}
                                    style={[styles.variantBtn, !isLuxe && styles.variantBtnActive]}
                                >
                                    <Text style={[styles.variantText, !isLuxe ? styles.variantTextActive : { color: isLuxe ? '#fff6' : '#0006' }]}>
                                        {t.calm}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setVariant('luxe')}
                                    style={[styles.variantBtn, isLuxe && styles.variantBtnActive]}
                                >
                                    <Text style={[styles.variantText, isLuxe ? styles.variantTextActive : { color: isLuxe ? '#fff6' : '#0006' }]}>
                                        {t.luxe}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Hero Section */}
                    <View style={styles.hero}>
                        <View style={styles.logoContainer}>
                            <UrkioLogo size={isLargeDesktop ? 180 : isDesktop ? 140 : width * 0.25} />
                        </View>

                        <View style={styles.textContainer}>
                            <Text style={[
                                styles.welcomeText,
                                { color: isLuxe ? '#fff' : '#1e293b' },
                                isDesktop && styles.welcomeTextDesktop
                            ]}>
                                {t.welcome}
                            </Text>
                            <Text style={[
                                styles.brandText,
                                isDesktop && styles.brandTextDesktop
                            ]}>
                                Urkio
                            </Text>
                            <Text style={[
                                styles.journeyText,
                                { color: isLuxe ? '#6366f1' : '#1e293b' },
                                isDesktop && styles.journeyTextDesktop
                            ]}>
                                {t.journey}
                            </Text>
                        </View>
                    </View>

                    {/* Action Hub */}
                    <View style={styles.actions}>
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity
                                onPress={() => handleJoin('member')}
                                style={styles.primaryButton}
                            >
                                <User size={20} color="#fff" strokeWidth={3} />
                                <Text style={styles.buttonText}>{t.memberLabel}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => handleJoin('expert')}
                                style={[styles.secondaryButton, { backgroundColor: isLuxe ? 'rgba(255,255,255,0.05)' : '#0f172a' }]}
                            >
                                <Stethoscope size={20} color="#fff" strokeWidth={3} />
                                <Text style={styles.buttonText}>{t.expertLabel}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.footer}>
                            <Text style={[styles.footerText, { color: isLuxe ? '#fff6' : '#94a3b8' }]}>
                                {t.alreadyMember} <Text style={styles.signInText}>{t.signIn}</Text>
                            </Text>
                        </View>
                    </View>

                </View>
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
    content: {
        flex: 1,
        paddingHorizontal: 24,
        alignSelf: 'center',
        width: '100%',
    },
    contentDesktop: {
        maxWidth: 1000,
        paddingHorizontal: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        zIndex: 100,
    },
    rightControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    langButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    langText: {
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1,
    },
    variantToggle: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        padding: 2,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    variantBtn: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
    },
    variantBtnActive: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    variantText: {
        fontSize: 9,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    variantTextActive: {
        color: '#6366f1',
    },
    hero: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -40,
    },
    logoContainer: {
        marginBottom: 32,
        shadowColor: '#d946ef',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    textContainer: {
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 32,
        fontWeight: '900',
        lineHeight: 32,
        letterSpacing: -1,
    },
    welcomeTextDesktop: {
        fontSize: 56,
        lineHeight: 56,
    },
    brandText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#d946ef',
        lineHeight: 48,
        letterSpacing: -2,
        marginVertical: 4,
    },
    brandTextDesktop: {
        fontSize: 84,
        lineHeight: 84,
        marginVertical: 12,
    },
    journeyText: {
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 4,
        marginTop: 8,
    },
    journeyTextDesktop: {
        fontSize: 14,
        letterSpacing: 8,
    },
    actions: {
        paddingBottom: 40,
        zIndex: 100,
    },
    buttonGroup: {
        flexDirection: 'row',
        padding: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 32,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        gap: 8,
        alignSelf: 'center',
        width: '100%',
        maxWidth: 500,
    },
    primaryButton: {
        flex: 1,
        height: 56,
        borderRadius: 24,
        backgroundColor: '#6366f1',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    secondaryButton: {
        flex: 1,
        height: 56,
        borderRadius: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    footer: {
        marginTop: 24,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 11,
        fontWeight: '700',
    },
    signInText: {
        color: '#6366f1',
        fontWeight: '900',
    },
});
