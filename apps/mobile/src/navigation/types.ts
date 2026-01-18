/**
 * Navigation Types
 * Defines all navigation routes and their parameters
 */

export type RootTabParamList = {
  Home: undefined;
  Favorites: undefined;
  Live: undefined;
  Leagues: undefined;
  Feed: undefined;
};

export type TabRoute = keyof RootTabParamList;

export interface TabConfig {
  name: TabRoute;
  label: string;
  icon: string;
}
