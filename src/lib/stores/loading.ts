import { writable } from 'svelte/store';

interface LoadingState {
	visible: boolean;
	message: string;
}

function createLoadingStore() {
	const { subscribe, set, update } = writable<LoadingState>({
		visible: false,
		message: ''
	});

	return {
		subscribe,
		show: (message: string = 'Carregando...') => {
			set({ visible: true, message });
		},
		hide: () => {
			set({ visible: false, message: '' });
		},
		updateMessage: (message: string) => {
			update(state => ({ ...state, message }));
		}
	};
}

export const loading = createLoadingStore();