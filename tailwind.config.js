/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				// Base - Financial Terminal Dark
				terminal: {
					50: '#F8FAFC',
					100: '#F1F5F9',
					200: '#E2E8F0',
					300: '#CBD5E1',
					400: '#94A3B8',
					500: '#64748B',
					600: '#475569',
					700: '#334155',
					800: '#1E293B',
					900: '#0F172A',
					950: '#020617'
				},
				// Semantic Status Colors
				semantic: {
					success: '#10B981',    // Emerald - Regular/Conformidade
					warning: '#F59E0B',     // Amber - Atenção/Suspenso
					critical: '#EF4444',    // Red - Crítico/Atraso
					info: '#3B82F6',        // Blue - Info
					accent: '#8B5CF6'       // Violet - Interactive
				}
			},
			fontFamily: {
				display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
				body: ['DM Sans', 'system-ui', 'sans-serif']
			},
			animation: {
				'fade-in': 'fadeIn 0.5s ease-out',
				'slide-up': 'slideUp 0.4s ease-out',
				'slide-in-left': 'slideInLeft 0.3s ease-out',
				'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
				'count-up': 'countUp 1s ease-out'
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				slideUp: {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				slideInLeft: {
					'0%': { opacity: '0', transform: 'translateX(-20px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				pulseGlow: {
					'0%, 100%': { boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)' },
					'50%': { boxShadow: '0 0 40px rgba(16, 185, 129, 0.6)' }
				}
			},
			boxShadow: {
				'glow-success': '0 0 20px rgba(16, 185, 129, 0.4)',
				'glow-warning': '0 0 20px rgba(245, 158, 11, 0.4)',
				'glow-critical': '0 0 20px rgba(239, 68, 68, 0.4)',
				'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2)',
				'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)'
			}
		}
	},
	plugins: []
};
