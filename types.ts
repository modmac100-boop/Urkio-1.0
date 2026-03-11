
export type UserRole = 'USER' | 'EXPERT' | 'MANAGEMENT' | 'CASE_MANAGER' | 'BOARD' | 'FOUNDER' | 'SPECIALIST' | 'DOCTOR';

export interface Certification {
  id: string;
  name: string;
  link: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  duration?: string;
}

export interface Member {
  id: string;
  name: string;
  image: string;
  type: string;
  isHallOfFame?: boolean;
  isTopSupporter?: boolean;
  isEndorsed?: boolean;
  following: number;
  followers: string;
  likesReceived: string;
  bio?: string;
  coverImage?: string;
  phone?: string;
  studyLevel?: string;
  skills?: string[];
  gender?: string;
  occupation?: string;
  age?: string;
  location?: string;
}

export interface Post {
  id: string;
  authorName: string;
  authorType: string;
  authorImage: string;
  content: string;
  time: string;
  isExpert?: boolean;
  isAnonymous?: boolean;
  likes: number;
  comments: number;
  reposts: number;
  views: number;
  tags?: string[];
  image?: string;
  videoUrl?: string;
  fileLink?: {
    name: string;
    type: string;
    url: string;
  };
  isPinned?: boolean;
  isMilestone?: boolean;
  isTopSupporter?: boolean;
  isHallOfFame?: boolean;
  isEndorsed?: boolean;
  milestoneStats?: { label: string, value: string, icon: string }[];
}

export interface Expert {
  id: string;
  name: string;
  title: string;
  experience: string;
  rating: number;
  reviews: number;
  image: string;
  expertise: string[];
  applicationLetter?: string;
  studyLevel?: string;
  certifications?: Certification[];
  website?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  services?: Service[];
  gender?: string;
  occupation?: string;
  age?: string;
  location?: string;
}

export interface Circle {
  id: string;
  name: string;
  category: string;
  members: number;
  image: string;
  expertModerator: string;
  expertAvatar: string;
  activeNow: number;
  tags: string[];
  isJoined?: boolean;
  description?: string;
}

export type ResourceType = 'article' | 'video' | 'podcast';

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  expertName: string;
  expertAvatar: string;
  category: string;
  image: string;
  duration: string;
  reads?: string;
  tags: string[];
  content?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  time: string;
  isSystemAction?: boolean;
  actionType?: 'estimation' | 'handoff';
  analysisData?: any;
}

export interface Story {
  id: string;
  userName: string;
  userImage: string;
  isExpert: boolean;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  timestamp: string;
  ctaText?: string;
}

export enum AppScreen {
  SPLASH,
  LANDING,
  AUTH,
  PERMISSION_REQUEST,
  SECURE_PORTAL,
  PASSWORD_RECOVERY,
  PASSWORD_UPDATE_FORM,
  PASSWORD_UPDATED_SUCCESS,
  SECURITY_PRIVACY,
  TFA_SETUP_METHOD,
  TFA_SETUP_VERIFY,
  TFA_SUCCESS,
  BACKUP_CODES_CARD,
  SHARE_WELLNESS_REPORT,
  EXPERT_REPORT_RECEIVED,
  EXPERT_FULL_REPORT,
  ASSIGN_ACTION_PLAN,
  ACTION_PLAN_TRACKER,
  GOAL_CELEBRATION,
  MILESTONE_30_DAY,
  TOP_SUPPORTER_BADGE,
  HALL_OF_FAME,
  ONBOARDING_INTRO,
  ONBOARDING_1,
  ONBOARDING_2,
  EXPERT_ONBOARDING,
  EXPERT_SIGNUP_INFO,
  EXPERT_SIGNUP_VERIFICATION,
  EXPERT_SIGNUP_FOCUS,
  EXPERT_REVIEW_STATUS,
  EXPERT_VERIFICATION_APPROVED,
  USER_DASHBOARD,
  COMMUNITY_FEED,
  EXPERT_DISCOVERY,
  EXPERT_PROFILE,
  EDIT_USER_PROFILE,
  EXPERT_BOOKING,
  SUPPORT_CIRCLES,
  AI_GUIDE,
  HOMII,
  RED_BOX,
  ACTIVITY_RESTORE,
  EXPERT_DASHBOARD,
  PROFIT_OVERVIEW,
  SEARCH_RESULTS,
  TRENDING_TOPICS,
  DAILY_SPOTLIGHT,
  LIVE_AUDIO_ROOM,
  SCHEDULE_AUDIO_ROOM,
  UPCOMING_EVENTS,
  EXPERT_PUBLIC_PROFILE,
  EXPERT_CONFESSION_REVIEW,
  EXPERT_CHECKIN_CHAT,
  EXPERT_SCHEDULE,
  CONSULTATION_ROOM,
  SESSION_SUMMARY,
  EXPERT_SESSION_RECAP,
  RESOURCE_LIBRARY,
  RESOURCE_DETAILS,
  PRIVATE_CHAT,
  EMERGENCY_SUPPORT,
  COMMUNITY_CIRCLES,
  CIRCLE_DISCUSSION,
  LIVE_QA,
  USER_PROFILE,
  CREATE_POST,
  CONNECTIONS,
  STORY_VIEWER,
  DISCOVER_CONNECTIONS,
  RECORDING_ARCHIVE,
  AI_CASE_REPORT,
  REFERRAL_HANDOFF,
  VIDEO_RECORDER,
  MANAGEMENT_DASHBOARD,
  MANAGEMENT_REVIEW_DETAIL,
  INBOX,
  SPECIALIST_SELECTOR,
  NOTIFICATIONS,
  BOARD_ADMIN_PANEL,
  FOUNDER_ADMIN_PANEL,
  SPECIALIST_DASHBOARD,
  ADMIN_VERIFICATION_BOARD,
  URKIO_SOCIAL_HUB,
  HEALING_JOURNEY,
  HEALING_CIRCLE_HOME
}
