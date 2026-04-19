import { writable, derived } from 'svelte/store';

export interface SearchResult {
	id: string;
	type: 'cliente' | 'obrigacao' | 'parcelamento';
	titulo: string;
	subtitulo: string;
	href: string;
}

function createSearchStore() {
	const { subscribe, set, update } = writable<{
		query: string;
		isOpen: boolean;
		results: SearchResult[];
		isLoading: boolean;
	}>({
		query: '',
		isOpen: false,
		results: [],
		isLoading: false
	});

	let debounceTimer: ReturnType<typeof setTimeout>;

	return {
		subscribe,
		setQuery(query: string) {
			update(state => ({ ...state, query }));

			clearTimeout(debounceTimer);
			if (query.length < 2) {
				update(state => ({ ...state, results: [], isLoading: false }));
				return;
			}

			update(state => ({ ...state, isLoading: true }));

			debounceTimer = setTimeout(async () => {
				try {
					const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
					if (res.ok) {
						const data = await res.json();
						update(state => ({ ...state, results: data.results || [], isLoading: false }));
					} else {
						update(state => ({ ...state, results: [], isLoading: false }));
					}
				} catch {
					update(state => ({ ...state, results: [], isLoading: false }));
				}
			}, 300);
		},
		open() {
			update(state => ({ ...state, isOpen: true }));
		},
		close() {
			update(state => ({ ...state, isOpen: false, query: '', results: [] }));
		},
		clear() {
			set({ query: '', isOpen: false, results: [], isLoading: false });
		}
	};
}

export const searchStore = createSearchStore();