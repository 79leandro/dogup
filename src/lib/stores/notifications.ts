import { writable } from 'svelte/store';

export interface Notification {
	id: number;
	type: 'success' | 'error' | 'warning' | 'info';
	title: string;
	message?: string;
	duration?: number;
}

function createNotificationStore() {
	const { subscribe, update } = writable<Notification[]>([]);
	let nextId = 1;

	return {
		subscribe,
		add(notification: Omit<Notification, 'id'>) {
			const id = nextId++;
			const duration = notification.duration ?? 5000;

			update((notifications) => [...notifications, { ...notification, id }]);

			if (duration > 0) {
				setTimeout(() => {
					this.remove(id);
				}, duration);
			}

			return id;
		},
		remove(id: number) {
			update((notifications) => notifications.filter((n) => n.id !== id));
		},
		success(title: string, message?: string) {
			return this.add({ type: 'success', title, message });
		},
		error(title: string, message?: string) {
			return this.add({ type: 'error', title, message, duration: 8000 });
		},
		warning(title: string, message?: string) {
			return this.add({ type: 'warning', title, message });
		},
		info(title: string, message?: string) {
			return this.add({ type: 'info', title, message });
		},
		clear() {
			update(() => []);
		}
	};
}

export const notifications = createNotificationStore();
