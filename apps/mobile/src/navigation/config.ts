/**
 * Navigation Configuration
 * Defines tab bar configuration based on design reference
 */

import { TabConfig } from './types';

export const TAB_CONFIG: TabConfig[] = [
  {
    name: 'Home',
    label: 'Home',
    icon: 'home', // We'll use simple text icons for now
  },
  {
    name: 'Favorites',
    label: 'Favorites',
    icon: 'star',
  },
  {
    name: 'Live',
    label: 'Live',
    icon: 'broadcast',
  },
  {
    name: 'Leagues',
    label: 'Leagues',
    icon: 'trophy',
  },
  {
    name: 'Feed',
    label: 'Feed',
    icon: 'grid',
  },
];
