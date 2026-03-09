import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
    Platform,
    Dimensions,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import {
    ArrowLeft,
    Settings,
    LogOut,
    CheckCircle2,
    Clock,
    Shield,
    ShieldCheck,
    Edit3,
    Save,
    User,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    GraduationCap,
    Heart,
    Star,
    Award
} from 'lucide-react-native';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';
import Animated, {
    FadeIn,
    FadeInDown,
    Layout,
    useAnimatedStyle,
    withSpring,
    useSharedValue
} from 'react-native-reanimated';
import { UrkioGradient } from '../../components/universal/UrkioGradient';

const { width } = Dimensions.get('window');

interface ProfileData {
    name: string;
    bio: string;
    phone: string;
    location: string;
    occupation: string;
    studyLevel: string;
    specialties: string[];
    verificationStatus: 'unverified' | 'pending' | 'verified';
    followers: number;
    following: number;
    likes: number;
    image?: string;
    coverImage?: string;
}

const DEFAULT_PROFILE: ProfileData = {
    name: 'Alex Johnson',
    bio: 'Finding balance and exploring the gut-brain connection.',
    phone: '+1 (555) 987-6543',
    location: 'Earth',
    occupation: 'Holistic Health Explorer',
    studyLevel: 'Bachelor’s Degree',
    specialties: ['Mindfulness', 'Breathwork', 'Yoga'],
    verificationStatus: 'unverified',
    followers: 3100,
    following: 124,
    likes: 1200,
    image: 'https://picsum.photos/seed/u4/200/200',
    coverImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80',
};

export default function ProfileScreen() {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
    const [tempProfile, setTempProfile] = useState<ProfileData>(DEFAULT_PROFILE);
    const [loading, setLoading] = useState(true);

    const fabScale = useSharedValue(1);

    // Real-time listener
    useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            setLoading(false);
            return;
        }

        const docRef = doc(db, 'profiles', user.uid);
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data() as any;
                const fetchedProfile: ProfileData = {
                    ...DEFAULT_PROFILE,
                    ...data,
                    name: data.first_name ? `${data.first_name} ${data.family_name || ''}` : DEFAULT_PROFILE.name,
                };
                setProfile(fetchedProfile);
                setTempProfile(fetchedProfile);
            }
            setLoading(false);
        }, (error) => {
            console.error("Error listening to profile:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleSave = async () => {
        const user = auth.currentUser;
        if (!user) return;

        fabScale.value = withSpring(0.8, {}, () => {
            fabScale.value = withSpring(1);
        });

        try {
            const nameParts = tempProfile.name.trim().split(' ');
            const firstName = nameParts[0] || '';
            const familyName = nameParts.slice(1).join(' ') || '';

            await setDoc(doc(db, 'profiles', user.uid), {
                ...tempProfile,
                first_name: firstName,
                family_name: familyName,
                updatedAt: new Date().toISOString(),
            }, { merge: true });

            setIsEditing(false);
        } catch (error) {
            console.error("Error saving profile:", error);
        }
    };

    const toggleEdit = () => {
        if (isEditing) {
            handleSave();
        } else {
            setIsEditing(true);
        }
    };

    const updateTempField = (field: keyof ProfileData, value: any) => {
        setTempProfile(prev => ({ ...prev, [field]: value }));
    };

    const fabStyle = useAnimatedStyle(() => ({
        transform: [{ scale: fabScale.value }],
    }));

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-slate-50">
                <Text className="text-slate-400 font-bold uppercase tracking-widest">Loading Journey...</Text>
            </View>
        );
    }

    return (
        <UrkioGradient className="flex-1">
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* Header Section */}
                <View className="relative h-[480px]">
                    <Image
                        source={{ uri: profile.coverImage }}
                        className="absolute inset-0 w-full h-full opacity-70"
                        resizeMode="cover"
                    />
                    <View className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-slate-50" />

                    {/* Top Controls */}
                    <View className="absolute top-14 left-6 right-6 flex-row justify-between items-center z-20">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 items-center justify-center backdrop-blur-md"
                        >
                            <ArrowLeft color="#fff" size={24} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 items-center justify-center backdrop-blur-md"
                        >
                            <Settings color="#fff" size={24} />
                        </TouchableOpacity>
                    </View>

                    {/* Profile Identity - Glass Card */}
                    <View className="absolute bottom-0 left-0 right-0 px-6 pb-8 items-center">
                        <Animated.View
                            entering={FadeInDown.delay(200)}
                            className="w-full rounded-[48px] bg-white/30 border border-white/40 p-8 items-center backdrop-blur-xl shadow-2xl"
                        >
                            <View className="relative">
                                <Image
                                    source={{ uri: profile.image }}
                                    className="w-28 h-28 rounded-full border-4 border-white shadow-xl"
                                />
                                {profile.verificationStatus === 'verified' && (
                                    <View className="absolute bottom-0 right-0 bg-primary rounded-full p-1 border-2 border-white">
                                        <CheckCircle2 color="#fff" size={16} />
                                    </View>
                                )}
                            </View>

                            <View className="mt-4 items-center">
                                <Text className="text-3xl font-black text-slate-900 tracking-tight">{profile.name}</Text>
                                <Text className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mt-1">{profile.occupation}</Text>
                            </View>

                            {/* Stats Bar */}
                            <View className="flex-row w-full mt-8 pt-6 border-t border-white/20 justify-around">
                                <View className="items-center">
                                    <Text className="text-xl font-black text-slate-900">{profile.following}</Text>
                                    <Text className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Following</Text>
                                </View>
                                <View className="w-[1px] h-8 bg-slate-300/30" />
                                <View className="items-center">
                                    <Text className="text-xl font-black text-slate-900">{profile.followers.toLocaleString()}</Text>
                                    <Text className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Followers</Text>
                                </View>
                                <View className="w-[1px] h-8 bg-slate-300/30" />
                                <View className="items-center">
                                    <Text className="text-xl font-black text-primary">{profile.likes.toLocaleString()}</Text>
                                    <Text className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Likes</Text>
                                </View>
                            </View>
                        </Animated.View>
                    </View>
                </View>

                {/* Main Content */}
                <View className="px-6 space-y-8 mt-8">

                    {/* Bio Section */}
                    <Animated.View
                        entering={FadeInDown.delay(300)}
                        className="bg-white/60 rounded-[40px] p-8 border border-white shadow-sm"
                    >
                        <View className="flex-row items-center gap-3 mb-4">
                            <Star size={20} className="text-primary" />
                            <Text className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Philosophy & Bio</Text>
                        </View>

                        {isEditing ? (
                            <TextInput
                                multiline
                                value={tempProfile.bio}
                                onChangeText={(val) => updateTempField('bio', val)}
                                className="text-base text-slate-700 font-medium leading-relaxed bg-slate-50/50 p-4 rounded-3xl"
                                placeholder="Your philosophy..."
                            />
                        ) : (
                            <TouchableOpacity onPress={() => setIsEditing(true)}>
                                <Text className="text-base text-slate-700 font-medium leading-relaxed tracking-tight">
                                    {profile.bio}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </Animated.View>

                    {/* Progress Journey Bar Implementation */}
                    <Animated.View
                        entering={FadeInDown.delay(400)}
                        className="bg-white/60 rounded-[40px] p-8 border border-white shadow-sm"
                    >
                        <View className="flex-row items-center gap-3 mb-6">
                            <Award size={20} className="text-urkio-magenta" />
                            <Text className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Visual Progress</Text>
                        </View>

                        <View className="space-y-6">
                            <View>
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Self-Discovery</Text>
                                    <Text className="text-[10px] font-black text-primary uppercase tracking-widest">74%</Text>
                                </View>
                                <View className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <View className="h-full bg-primary w-[74%]" />
                                </View>
                            </View>

                            <View>
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Community Impact</Text>
                                    <Text className="text-[10px] font-black text-urkio-magenta uppercase tracking-widest">42%</Text>
                                </View>
                                <View className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <View className="h-full bg-urkio-magenta w-[42%]" />
                                </View>
                            </View>
                        </View>
                    </Animated.View>

                    {/* Personal Details Grid */}
                    <View className="flex-row flex-wrap justify-between gap-y-6">
                        <DetailCard
                            icon={<MapPin size={18} color="#6366f1" />}
                            label="Location"
                            value={profile.location}
                            isEditing={isEditing}
                            tempValue={tempProfile.location}
                            onUpdate={(v) => updateTempField('location', v)}
                        />
                        <DetailCard
                            icon={<GraduationCap size={18} color="#6366f1" />}
                            label="Education"
                            value={profile.studyLevel}
                            isEditing={isEditing}
                            tempValue={tempProfile.studyLevel}
                            onUpdate={(v) => updateTempField('studyLevel', v)}
                        />
                        <DetailCard
                            icon={<Phone size={18} color="#6366f1" />}
                            label="Contact"
                            value={profile.phone}
                            isEditing={isEditing}
                            tempValue={tempProfile.phone}
                            onUpdate={(v) => updateTempField('phone', v)}
                            isPrivate
                        />
                        <DetailCard
                            icon={<Briefcase size={18} color="#6366f1" />}
                            label="Specialty"
                            value={profile.specialties[0] || 'Member'}
                            isEditing={false} // Static update for now
                        />
                    </View>

                    {/* Verification Status */}
                    <Animated.View
                        entering={FadeInDown.delay(500)}
                        className={`rounded-[40px] p-8 border ${profile.verificationStatus === 'verified'
                            ? 'bg-emerald-50 border-emerald-100'
                            : 'bg-white/60 border-white'
                            }`}
                    >
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center gap-4">
                                <Shield size={24} color={profile.verificationStatus === 'verified' ? '#10b981' : '#94a3b8'} />
                                <View>
                                    <Text className="text-lg font-black text-slate-900 tracking-tight">
                                        {profile.verificationStatus === 'verified' ? 'Verified Expert' : 'Account Integrity'}
                                    </Text>
                                    <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                        {profile.verificationStatus === 'verified' ? 'Tier 4 Access Active' : 'Submit credentials for verification'}
                                    </Text>
                                </View>
                            </View>
                            {profile.verificationStatus === 'verified' && <CheckCircle2 color="#10b981" fill="#ecfdf5" size={28} />}
                        </View>
                    </Animated.View>
                </View>
            </ScrollView>

            {/* Floating Action Button (FAB) */}
            <View className="absolute bottom-10 right-8">
                <TouchableOpacity
                    onPress={toggleEdit}
                    activeOpacity={0.8}
                >
                    <Animated.View
                        style={fabStyle}
                        className={`w-16 h-16 rounded-full items-center justify-center shadow-2xl ${isEditing ? 'bg-emerald-500 shadow-emerald-200' : 'bg-primary shadow-indigo-200'
                            }`}
                    >
                        {isEditing ? (
                            <Save color="#fff" size={28} strokeWidth={3} />
                        ) : (
                            <Edit3 color="#fff" size={28} strokeWidth={3} />
                        )}
                    </Animated.View>
                </TouchableOpacity>
            </View>

            {/* Toast for saving (Simplified) */}
            {loading && <View className="absolute inset-0 bg-white/20 backdrop-blur-sm items-center justify-center z-50"><Text>Working...</Text></View>}
        </UrkioGradient>
    );
}

function DetailCard({
    icon,
    label,
    value,
    isEditing,
    tempValue,
    onUpdate,
    isPrivate
}: {
    icon: React.ReactNode,
    label: string,
    value: string,
    isEditing?: boolean,
    tempValue?: string,
    onUpdate?: (v: string) => void,
    isPrivate?: boolean
}) {
    return (
        <View className="w-[48%] bg-white/40 rounded-[32px] p-6 border border-white">
            <View className="flex-row items-center gap-3 mb-2">
                {icon}
                <Text className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</Text>
            </View>
            {isEditing ? (
                <TextInput
                    value={tempValue}
                    onChangeText={onUpdate}
                    className="text-sm font-black text-slate-900 p-0"
                    placeholder={`Enter ${label}...`}
                />
            ) : (
                <Text className="text-sm font-black text-slate-900 tracking-tight" numberOfLines={1}>
                    {isPrivate ? (value.length > 5 ? `${value.substring(0, 5)}...` : value) : value}
                </Text>
            )}
        </View>
    );
}
