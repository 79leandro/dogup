import { writable } from 'svelte/store';

export type SidebarState = 'expanded' | 'collapsed' | 'mobile';

export const sidebarState = writable<SidebarState>('expanded');