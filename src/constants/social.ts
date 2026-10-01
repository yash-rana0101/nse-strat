export interface SocialLink {
  name: string;
  href: string;
  icon: string;
  label: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'X (Twitter)',
    href: 'https://x.com/thestratai',
    icon: 'twitter',
    label: 'Follow Strat Ai on X (Twitter)',
  },
  {
    name: 'GitHub',
    href: 'https://github.com/thestratai',
    icon: 'github',
    label: 'Strat Ai GitHub Repository',
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/company/thestratai',
    icon: 'linkedin',
    label: 'Follow Strat Ai on LinkedIn',
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/thestratai',
    icon: 'instagram',
    label: 'Follow Strat Ai on Instagram',
  },
];
