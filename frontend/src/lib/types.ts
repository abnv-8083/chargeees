export type HeroData = {
  companyName: string;
  tagline: string;
  introduction: string;
  primaryCTA: { label: string; link: string };
  secondaryCTA: { label: string; link: string };
  backgroundType: 'particles' | 'gradient' | 'image';
  backgroundImage?: string;
};

export type CoreValue = { title: string; description: string; icon: string };
export type TimelineEntry = { year: string; title: string; description: string };

export type AboutData = {
  heading: string;
  subheading: string;
  introduction: string;
  story: string;
  coreValues: CoreValue[];
  whyUs: { title: string; description: string }[];
  timeline: TimelineEntry[];
  image?: string;
};

export type VisionData = {
  heading: string;
  statement: string;
  futureGoals: { title: string; description: string }[];
  strategicDirection: string;
  image?: string;
};

export type MissionData = {
  heading: string;
  statement: string;
  commitments: { title: string; description: string }[];
  objectives: string[];
  customerFirst: string;
};

export type FounderData = {
  _id: string;
  type: 'founder' | 'cofounder';
  name: string;
  title: string;
  profileImage?: string;
  biography: string;
  experience: string;
  achievements: string[];
  education: { degree: string; institution: string; year: string }[];
  messageFromFounder: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
    website?: string;
  };
};

export type ProjectGalleryItem = {
  url: string;
  type: 'image' | 'video';
  caption?: string;
};

export type ProjectData = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  status: 'ongoing' | 'completed' | 'upcoming' | 'on-hold';
  completionDate?: string;
  coverImage?: string;
  gallery: ProjectGalleryItem[];
  tags: string[];
  client?: string;
  featured: boolean;
};

export type ServiceData = {
  _id: string;
  name: string;
  description: string;
  icon: string;
  features: string[];
  learnMoreLink: string;
};

export type GalleryItemData = {
  _id: string;
  title: string;
  url: string;
  type: 'image' | 'video' | 'pdf';
  folder: string;
  caption?: string;
  tags: string[];
};

export type SiteSettings = {
  companyName: string;
  companyTagline: string;
  companyDescription: string;
  logo?: string;
  contact: {
    email: string;
    phone: string;
    address: string;
    officeHours: string;
    googleMapsEmbed?: string;
  };
  social: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
    youtube?: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogImage?: string;
    twitterHandle?: string;
  };
  navigation: { label: string; href: string; order: number }[];
  footer: {
    copyright: string;
    privacyPolicyUrl: string;
    termsUrl: string;
    quickLinks: { label: string; href: string }[];
  };
};
