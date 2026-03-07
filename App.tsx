
import React, { useState, useEffect } from 'react';
import { AppScreen, UserRole, Expert, Resource, Circle, Story, Member } from './types';
import { auth, db } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import SplashView from './views/SplashView';
import LandingView from './views/LandingView';
import UserDashboard from './views/UserDashboard';
import CommunityFeed from './views/CommunityFeed';
import ExpertDiscovery from './views/ExpertDiscovery';
import AiGuide from './views/AiGuide';
import Homii from './views/Homii';
import RedBox from './views/RedBox';
import ActivityRestore from './views/ActivityRestore';
import ExpertDashboard from './views/ExpertDashboard';
import SupportCircles from './views/SupportCircles';
import ExpertOnboarding from './views/ExpertOnboarding';
import ExpertSignup_Info from './views/ExpertSignup_Info';
import ExpertSignup_Verification from './views/ExpertSignup_Verification';
import ExpertSignup_Focus from './views/ExpertSignup_Focus';
import ExpertReviewStatus from './views/ExpertReviewStatus';
import ExpertVerificationApproved from './views/ExpertVerificationApproved';
import ExpertBooking from './views/ExpertBooking';
import AuthView from './views/AuthView';
import PermissionRequest from './views/PermissionRequest';
import PasswordRecovery from './views/PasswordRecovery';
import PasswordUpdateForm from './views/PasswordUpdateForm';
import PasswordUpdatedSuccess from './views/PasswordUpdatedSuccess';
import SecurityPrivacy from './views/SecurityPrivacy';
import TfaSetupMethod from './views/TfaSetupMethod';
import TfaSetupVerify from './views/TfaSetupVerify';
import TfaSuccess from './views/TfaSuccess';
import BackupCodesCard from './views/BackupCodesCard';
import ShareWellnessReport from './views/ShareWellnessReport';
import ExpertWellnessReportReceived from './views/ExpertWellnessReportReceived';
import ExpertFullReport from './views/ExpertFullReport';
import AssignActionPlan from './views/AssignActionPlan';
import ActionPlanTracker from './views/ActionPlanTracker';
import GoalCelebration from './views/GoalCelebration';
import MilestoneAchievement from './views/MilestoneAchievement';
import TopSupporterBadge from './views/TopSupporterBadge';
import HallOfFameCelebration from './views/HallOfFameCelebration';
import ExpertProfile from './views/ExpertProfile';
import EditUserProfile from './views/EditUserProfile';
import SearchResults from './views/SearchResults';
import TrendingTopics from './views/TrendingTopics';
import DailySpotlight from './views/DailySpotlight';
import LiveAudioRoom from './views/LiveAudioRoom';
import ScheduleAudioRoom from './views/ScheduleAudioRoom';
import UpcomingEvents from './views/UpcomingEvents';
import ExpertPublicProfile from './views/ExpertPublicProfile';
import ExpertConfessionReview from './views/ExpertConfessionReview';
import ExpertCheckinChat from './views/ExpertCheckinChat';
import Onboarding_1 from './views/Onboarding_1';
import Onboarding_2 from './views/Onboarding_2';
import OnboardingIntro from './views/OnboardingIntro';
import ExpertSchedule from './views/ExpertSchedule';
import ConsultationRoom from './views/ConsultationRoom';
import SessionSummary from './views/SessionSummary';
import ExpertSessionRecap from './views/ExpertSessionRecap';
import ResourceLibrary from './views/ResourceLibrary';
import ResourceDetails from './views/ResourceDetails';
import PrivateChat from './views/PrivateChat';
import EmergencySupport from './views/EmergencySupport';
import CommunityCircles from './views/CommunityCircles';
import CircleDiscussion from './views/CircleDiscussion';
import LiveQa from './views/LiveQa';
import UserProfile from './views/UserProfile';
import CreatePost from './views/CreatePost';
import Connections from './views/Connections';
import StoryViewer from './views/StoryViewer';
import DiscoverConnections from './views/DiscoverConnections';
import RecordingArchive from './views/RecordingArchive';
import ProfitOverview from './views/ProfitOverview';
import AiCaseReport from './views/AiCaseReport';
import ReferralHandoff from './views/ReferralHandoff';
import VideoRecorder from './views/VideoRecorder';
import ManagementDashboard from './views/ManagementDashboard';
import ManagementReviewDetail from './views/ManagementReviewDetail';
import InboxView from './views/InboxView';
import SecurePortal from './views/SecurePortal';
import SpecialistSelector from './views/SpecialistSelector';
import NotificationsView from './views/NotificationsView';
import BoardAdminPanel from './views/BoardAdminPanel';
import FounderAdminPanel from './views/FounderAdminPanel';

const DEFAULT_EXPERT: Expert = {
  id: 'exp_self',
  name: 'Dr. Aris Varma',
  title: 'Clinical Psychologist',
  experience: '12 yrs exp',
  rating: 4.9,
  reviews: 142,
  image: 'https://picsum.photos/seed/expert/200/200',
  expertise: ['Anxiety', 'Grounding', 'CBT'],
  certifications: [
    { id: '1', name: 'American Psychological Association (APA)', link: 'https://apa.org' },
    { id: '2', name: 'Board Certified Telehealth Specialist', link: 'https://telehealth.org' }
  ]
};

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.SPLASH);
  const [userRole, setUserRole] = useState<UserRole>('USER');
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [session, setSession] = useState<any>(null);

  // Persistent Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('urkio-mood');
    return saved === 'dark';
  });

  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [activeStories, setActiveStories] = useState<Story[]>([]);
  const [initialStoryIndex, setInitialStoryIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Function to fetch role from Firebase 'profiles' collection
  const fetchUserProfile = async (userId: string) => {
    try {
      const docRef = doc(db, 'profiles', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserRole(data.role as UserRole);
        console.log("Authenticated as role:", data.role);
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  // Handle Firebase Auth Session
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setSession({ user });
        fetchUserProfile(user.uid);
      } else {
        setSession(null);
        setUserRole('USER');

        // If user logs out and is on a protected screen, redirect to Landing
        const publicScreens = [AppScreen.SPLASH, AppScreen.LANDING, AppScreen.AUTH, AppScreen.PASSWORD_RECOVERY];
        if (!publicScreens.includes(currentScreen)) {
          setCurrentScreen(AppScreen.LANDING);
        }
      }
    });

    return () => unsubscribe();
  }, [currentScreen]);

  // Synchronize Dark Mode Class and Storage
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    document.body.classList.toggle('dark', isDarkMode);
    localStorage.setItem('urkio-mood', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Synchronize Language and Direction
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const navigate = (
    screen: AppScreen,
    expert?: Expert,
    query?: string,
    resource?: Resource,
    circle?: Circle,
    stories?: Story[],
    storyIndex?: number,
    member?: Member
  ) => {
    if (expert) setSelectedExpert(expert);
    if (resource) setSelectedResource(resource);
    if (circle) setSelectedCircle(circle);
    if (member) setSelectedMember(member);
    else if (screen !== AppScreen.USER_PROFILE) setSelectedMember(null);

    if (stories) setActiveStories(stories);
    if (storyIndex !== undefined) setInitialStoryIndex(storyIndex);
    if (query !== undefined) setSearchQuery(query);
    setCurrentScreen(screen);
    window.scrollTo(0, 0);
  };

  const renderScreen = () => {
    const commonProps = {
      navigate,
      language,
      setLanguage,
      isDarkMode,
      toggleDarkMode,
      userRole
    };

    // If user is logged in and at starting login/landing screens, push to dashboard
    // But ONLY if they aren't already in an onboarding or setup flow
    const onboardingScreens = [
      AppScreen.ONBOARDING_INTRO, AppScreen.ONBOARDING_1, AppScreen.ONBOARDING_2,
      AppScreen.EXPERT_ONBOARDING, AppScreen.EXPERT_SIGNUP_INFO, AppScreen.EXPERT_SIGNUP_VERIFICATION,
      AppScreen.EXPERT_SIGNUP_FOCUS, AppScreen.EXPERT_REVIEW_STATUS
    ];

    if (session && !onboardingScreens.includes(currentScreen) && (currentScreen === AppScreen.LANDING || currentScreen === AppScreen.AUTH)) {
      if (userRole === 'MANAGEMENT' || userRole === 'BOARD' || userRole === 'FOUNDER') {
        return <ManagementDashboard {...commonProps} role={userRole} />;
      }
      if (userRole === 'EXPERT') {
        return <ExpertDashboard {...commonProps} />;
      }
      return <UserDashboard {...commonProps} />;
    }

    switch (currentScreen) {
      case AppScreen.SPLASH:
        return <SplashView onComplete={() => {
          if (session) {
            if (userRole === 'EXPERT') navigate(AppScreen.EXPERT_DASHBOARD);
            else if (userRole === 'MANAGEMENT' || userRole === 'BOARD' || userRole === 'FOUNDER') navigate(AppScreen.MANAGEMENT_DASHBOARD);
            else navigate(AppScreen.USER_DASHBOARD);
          }
          else navigate(AppScreen.LANDING);
        }} />;

      case AppScreen.LANDING:
        return <LandingView {...commonProps} onJoin={(role) => {
          setUserRole(role);
          if (role === 'EXPERT') navigate(AppScreen.EXPERT_ONBOARDING);
          else navigate(AppScreen.AUTH);
        }} />;

      case AppScreen.SECURE_PORTAL:
        return <SecurePortal {...commonProps} onAuthenticated={(role) => {
          setUserRole(role);
          if (role === 'FOUNDER') navigate(AppScreen.FOUNDER_ADMIN_PANEL);
          else if (role === 'BOARD') navigate(AppScreen.BOARD_ADMIN_PANEL);
          else navigate(AppScreen.MANAGEMENT_DASHBOARD);
        }} />;

      case AppScreen.AUTH:
        return <AuthView
          {...commonProps}
          userRole={userRole}
          onAuthSuccess={(roleOverride) => {
            if (roleOverride) {
              setUserRole(roleOverride);
              if (roleOverride === 'BOARD' || roleOverride === 'MANAGEMENT' || roleOverride === 'FOUNDER') {
                navigate(AppScreen.MANAGEMENT_DASHBOARD);
                return;
              }
            }
            navigate(AppScreen.ONBOARDING_INTRO);
          }}
        />;

      case AppScreen.PERMISSION_REQUEST:
        return <PermissionRequest {...commonProps} onComplete={() => navigate(AppScreen.ONBOARDING_INTRO)} />;

      case AppScreen.PASSWORD_RECOVERY:
        return <PasswordRecovery {...commonProps} />;

      case AppScreen.PASSWORD_UPDATE_FORM:
        return <PasswordUpdateForm {...commonProps} />;

      case AppScreen.PASSWORD_UPDATED_SUCCESS:
        return <PasswordUpdatedSuccess {...commonProps} />;

      case AppScreen.SECURITY_PRIVACY:
        return <SecurityPrivacy {...commonProps} />;

      case AppScreen.TFA_SETUP_METHOD:
        return <TfaSetupMethod {...commonProps} />;

      case AppScreen.TFA_SETUP_VERIFY:
        return <TfaSetupVerify {...commonProps} />;

      case AppScreen.TFA_SUCCESS:
        return <TfaSuccess {...commonProps} />;

      case AppScreen.BACKUP_CODES_CARD:
        return <BackupCodesCard {...commonProps} />;

      case AppScreen.SHARE_WELLNESS_REPORT:
        return <ShareWellnessReport {...commonProps} />;

      case AppScreen.EXPERT_REPORT_RECEIVED:
        return <ExpertWellnessReportReceived {...commonProps} />;

      case AppScreen.EXPERT_FULL_REPORT:
        return <ExpertFullReport {...commonProps} />;

      case AppScreen.ASSIGN_ACTION_PLAN:
        return <AssignActionPlan {...commonProps} />;

      case AppScreen.GOAL_CELEBRATION:
        return <GoalCelebration {...commonProps} />;

      case AppScreen.MILESTONE_30_DAY:
        return <MilestoneAchievement {...commonProps} />;

      case AppScreen.TOP_SUPPORTER_BADGE:
        return <TopSupporterBadge {...commonProps} />;

      case AppScreen.HALL_OF_FAME:
        return <HallOfFameCelebration {...commonProps} />;

      case AppScreen.ONBOARDING_INTRO:
        return <OnboardingIntro {...commonProps} />;

      case AppScreen.ONBOARDING_1:
        return <Onboarding_1 {...commonProps} />;

      case AppScreen.ONBOARDING_2:
        return <Onboarding_2 {...commonProps} />;

      case AppScreen.EXPERT_ONBOARDING:
        return <ExpertOnboarding {...commonProps} />;

      case AppScreen.EXPERT_SIGNUP_INFO:
        return <ExpertSignup_Info {...commonProps} language={language} />;

      case AppScreen.EXPERT_SIGNUP_VERIFICATION:
        return <ExpertSignup_Verification {...commonProps} />;

      case AppScreen.EXPERT_SIGNUP_FOCUS:
        return <ExpertSignup_Focus {...commonProps} language={language} />;

      case AppScreen.EXPERT_REVIEW_STATUS:
        return <ExpertReviewStatus {...commonProps} />;

      case AppScreen.EXPERT_VERIFICATION_APPROVED:
        return <ExpertVerificationApproved {...commonProps} />;

      case AppScreen.USER_DASHBOARD:
        return <UserDashboard {...commonProps} />;

      case AppScreen.COMMUNITY_FEED:
        return <CommunityFeed {...commonProps} />;

      case AppScreen.EXPERT_DISCOVERY:
        return <ExpertDiscovery {...commonProps} />;

      case AppScreen.EXPERT_BOOKING:
        return <ExpertBooking {...commonProps} expert={selectedExpert} />;

      case AppScreen.AI_GUIDE:
        return <AiGuide {...commonProps} />;

      case AppScreen.HOMII:
        return <Homii {...commonProps} />;

      case AppScreen.RED_BOX:
        return <RedBox {...commonProps} />;

      case AppScreen.ACTIVITY_RESTORE:
        return <ActivityRestore {...commonProps} />;

      case AppScreen.EXPERT_DASHBOARD:
        return <ExpertDashboard {...commonProps} />;

      case AppScreen.EXPERT_PROFILE:
        return <ExpertProfile {...commonProps} />;

      case AppScreen.EDIT_USER_PROFILE:
        return <EditUserProfile {...commonProps} />;

      case AppScreen.SUPPORT_CIRCLES:
        return <SupportCircles {...commonProps} />;

      case AppScreen.SEARCH_RESULTS:
        return <SearchResults {...commonProps} initialQuery={searchQuery} />;

      case AppScreen.TRENDING_TOPICS:
        return <TrendingTopics {...commonProps} />;

      case AppScreen.DAILY_SPOTLIGHT:
        return <DailySpotlight {...commonProps} />;

      case AppScreen.LIVE_AUDIO_ROOM:
        return <LiveAudioRoom {...commonProps} />;

      case AppScreen.SCHEDULE_AUDIO_ROOM:
        return <ScheduleAudioRoom {...commonProps} />;

      case AppScreen.UPCOMING_EVENTS:
        return <UpcomingEvents {...commonProps} />;

      case AppScreen.EXPERT_PUBLIC_PROFILE:
        const isSelf = userRole === 'EXPERT' && (!selectedExpert || selectedExpert.id === 'exp_self');
        return <ExpertPublicProfile
          {...commonProps}
          expert={isSelf ? DEFAULT_EXPERT : selectedExpert}
          isOwnProfile={isSelf}
        />;

      case AppScreen.EXPERT_CONFESSION_REVIEW:
        return <ExpertConfessionReview {...commonProps} />;

      case AppScreen.EXPERT_CHECKIN_CHAT:
        return <ExpertCheckinChat {...commonProps} />;

      case AppScreen.EXPERT_SCHEDULE:
        return <ExpertSchedule {...commonProps} />;

      case AppScreen.CONSULTATION_ROOM:
        return <ConsultationRoom {...commonProps} role={userRole} />;

      case AppScreen.SESSION_SUMMARY:
        return <SessionSummary {...commonProps} expert={selectedExpert} />;

      case AppScreen.EXPERT_SESSION_RECAP:
        return <ExpertSessionRecap {...commonProps} />;

      case AppScreen.RESOURCE_LIBRARY:
        return <ResourceLibrary {...commonProps} />;

      case AppScreen.RESOURCE_DETAILS:
        return <ResourceDetails {...commonProps} resource={selectedResource} />;

      case AppScreen.PRIVATE_CHAT:
        return <PrivateChat {...commonProps} expert={selectedExpert} />;

      case AppScreen.EMERGENCY_SUPPORT:
        return <EmergencySupport {...commonProps} />;

      case AppScreen.COMMUNITY_CIRCLES:
        return <CommunityCircles {...commonProps} />;

      case AppScreen.CIRCLE_DISCUSSION:
        return <CircleDiscussion {...commonProps} circle={selectedCircle} />;

      case AppScreen.LIVE_QA:
        return <LiveQa {...commonProps} />;

      case AppScreen.USER_PROFILE:
        return <UserProfile {...commonProps} member={selectedMember} />;

      case AppScreen.CREATE_POST:
        return <CreatePost {...commonProps} language={language} />;

      case AppScreen.CONNECTIONS:
        return <Connections {...commonProps} />;

      case AppScreen.STORY_VIEWER:
        return <StoryViewer {...commonProps} stories={activeStories} initialIndex={initialStoryIndex} />;

      case AppScreen.DISCOVER_CONNECTIONS:
        return <DiscoverConnections {...commonProps} />;

      case AppScreen.RECORDING_ARCHIVE:
        return <RecordingArchive {...commonProps} />;

      case AppScreen.PROFIT_OVERVIEW:
        return <ProfitOverview {...commonProps} />;

      case AppScreen.AI_CASE_REPORT:
        return <AiCaseReport {...commonProps} />;

      case AppScreen.REFERRAL_HANDOFF:
        return <ReferralHandoff {...commonProps} />;

      case AppScreen.VIDEO_RECORDER:
        return <VideoRecorder {...commonProps} />;

      case AppScreen.MANAGEMENT_DASHBOARD:
        return <ManagementDashboard {...commonProps} role={userRole} />;

      case AppScreen.MANAGEMENT_REVIEW_DETAIL:
        return <ManagementReviewDetail {...commonProps} expert={selectedExpert} />;

      case AppScreen.INBOX:
        return <InboxView {...commonProps} />;

      case AppScreen.SPECIALIST_SELECTOR:
        return <SpecialistSelector {...commonProps} />;

      case AppScreen.NOTIFICATIONS:
        return <NotificationsView {...commonProps} />;

      case AppScreen.BOARD_ADMIN_PANEL:
        return <BoardAdminPanel {...commonProps} />;

      case AppScreen.FOUNDER_ADMIN_PANEL:
        return <FounderAdminPanel {...commonProps} />;

      default:
        return <UserDashboard {...commonProps} />;
    }
  };

  return (
    <div className={`min-h-screen flex justify-center transition-colors duration-500 ${isDarkMode ? 'bg-background-dark' : 'bg-gray-50'}`}>
      {renderScreen()}
    </div>
  );
};

export default App;
