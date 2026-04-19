<script lang="ts">
	import { onMount } from 'svelte';
	import { notifications } from '$lib/stores/notifications';

	interface Obrigacao {
		id: string;
		tipo: string;
		ano: number;
		mes: number;
		status: string;
		cliente: {
			id: string;
			cnpj: string;
			nomeRazao: string;
		};
	}

	let currentDate = $state(new Date());
	let obrigacoes = $state<Obrigacao[]>([]);
	let isLoading = $state(true);

	const currentMonth = $derived(currentDate.getMonth());
	const currentYear = $derived(currentDate.getFullYear());

	const monthNames = [
		'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
		'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
	];

	const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

	// DCTFWeb is due on the 2nd business day of the following month
	function getDCTFWebDeadline(year: number, month: number): Date {
		// Get the 1st of the next month
		let nextMonth = month === 11 ? 1 : month + 1;
		let nextYear = month === 11 ? year + 1 : year;

		const firstDay = new Date(nextYear, nextMonth, 1);

		// Find the 2nd business day
		let businessDay = 0;
		let day = firstDay;

		while (businessDay < 2) {
			const dayOfWeek = day.getDay();
			if (dayOfWeek !== 0 && dayOfWeek !== 6) {
				businessDay++;
			}
			if (businessDay < 2) {
				day = new Date(day.getTime() + 24 * 60 * 60 * 1000);
			}
		}

		return day;
	}

	interface CalendarDay {
		date: Date;
		isCurrentMonth: boolean;
		isToday: boolean;
		isDeadline: boolean;
		deadlines: {
			tipo: string;
			descricao: string;
			dia: number;
		}[];
	}

	const calendarDays = $derived.by(() => {
		const year = currentYear;
		const month = currentMonth;

		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);

		const days: CalendarDay[] = [];

		// Days from previous month
		const firstDayOfWeek = firstDay.getDay();
		const prevMonthLastDay = new Date(year, month, 0).getDate();

		for (let i = firstDayOfWeek - 1; i >= 0; i--) {
			const date = new Date(year, month - 1, prevMonthLastDay - i);
			days.push({
				date,
				isCurrentMonth: false,
				isToday: false,
				isDeadline: false,
				deadlines: []
			});
		}

		// Days of current month
		const today = new Date();
		const DCTFDeadline = getDCTFWebDeadline(year, month);

		for (let day = 1; day <= lastDay.getDate(); day++) {
			const date = new Date(year, month, day);
			const isToday = date.toDateString() === today.toDateString();
			const isDeadline = date.toDateString() === DCTFDeadline.toDateString();

			const deadlines: CalendarDay['deadlines'] = [];

			// Add DCTFWeb deadline (2nd business day of next month is deadline for current month)
			if (isDeadline) {
				deadlines.push({
					tipo: 'DCTFWEB',
					descricao: 'DCTFWeb',
					dia: day
				});
			}

			days.push({
				date,
				isCurrentMonth: true,
				isToday,
				isDeadline,
				deadlines
			});
		}

		// Days from next month
		const remainingDays = 42 - days.length;
		for (let i = 1; i <= remainingDays; i++) {
			const date = new Date(year, month + 1, i);
			days.push({
				date,
				isCurrentMonth: false,
				isToday: false,
				isDeadline: false,
				deadlines: []
			});
		}

		return days;
	});

	function prevMonth() {
		currentDate = new Date(currentYear, currentMonth - 1, 1);
	}

	function nextMonth() {
		currentDate = new Date(currentYear, currentMonth + 1, 1);
	}

	function goToToday() {
		currentDate = new Date();
	}

	function getStatusBadge(status: string): { class: string; label: string } {
		const badges: Record<string, { class: string; label: string }> = {
			ENTREGUE: { class: 'status-success', label: 'Entregue' },
			NAO_ENTREGUE: { class: 'status-critical', label: 'Não Entregue' },
			INCONSISTENCIA: { class: 'status-warning', label: 'Inconsistência' },
			EM_PROCESSAMENTO: { class: 'status-warning', label: 'Em Processamento' }
		};
		return badges[status] || { class: '', label: status };
	}

	function getObrigacoesDoMes(): Obrigacao[] {
		return obrigacoes.filter(o => o.ano === currentYear && o.mes === currentMonth);
	}

	onMount(async () => {
		try {
			const response = await fetch('/api/obrigacoes');
			const data = await response.json();
			if (response.ok) {
				obrigacoes = data.obrigacoes || [];
			}
		} catch (error) {
			// Silently fail
		}
	});
</script>

<div class="space-y-6 animate-fade-in">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="font-display text-2xl font-bold text-slate-800">Calendário de Prazos</h1>
			<p class="text-slate-400">Obrigações acessórias e deadlines fiscais</p>
		</div>

		<div class="flex items-center gap-2">
			<button onclick={goToToday} class="btn btn-ghost text-sm">
				Hoje
			</button>
			<div class="flex items-center border border-slate-200 rounded-lg overflow-hidden">
				<button onclick={prevMonth} class="p-2 hover:bg-slate-100 transition-colors" aria-label="Mês anterior">
					<svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
					</svg>
				</button>
				<span class="px-4 text-slate-800 font-medium min-w-[140px] text-center">
					{monthNames[currentMonth]} {currentYear}
				</span>
				<button onclick={nextMonth} class="p-2 hover:bg-slate-100 transition-colors" aria-label="Próximo mês">
					<svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
					</svg>
				</button>
			</div>
		</div>
	</div>

	<!-- Legend -->
	<div class="flex items-center gap-6 text-sm">
		<div class="flex items-center gap-2">
			<div class="w-3 h-3 rounded bg-semantic-critical"></div>
			<span class="text-slate-500">Prazo de Entrega</span>
		</div>
		<div class="flex items-center gap-2">
			<div class="w-3 h-3 rounded bg-semantic-success"></div>
			<span class="text-slate-500">Entregue</span>
		</div>
		<div class="flex items-center gap-2">
			<div class="w-3 h-3 rounded bg-semantic-warning"></div>
			<span class="text-slate-500">Pendente</span>
		</div>
	</div>

	<!-- Calendar Grid -->
	<div class="card overflow-hidden">
		<!-- Week days header -->
		<div class="grid grid-cols-7 bg-white/50">
			{#each weekDays as day}
				<div class="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
					{day}
				</div>
			{/each}
		</div>

		<!-- Calendar days -->
		<div class="grid grid-cols-7">
			{#each calendarDays as day}
				<div
					class="min-h-[100px] p-2 border-t border-r border-slate-200/50
						{!day.isCurrentMonth ? 'bg-white/30' : ''}
						{day.isToday ? 'bg-semantic-accent/5' : ''}"
				>
					<div class="flex items-center justify-between mb-1">
						<span
							class="text-sm font-medium
								{day.isToday ? 'w-7 h-7 rounded-full bg-semantic-accent text-white flex items-center justify-center' : 'text-slate-600'}
								{!day.isCurrentMonth ? 'text-slate-300' : ''}"
						>
							{day.date.getDate()}
						</span>

						{#if day.isDeadline}
							<span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-semantic-critical text-white">
								DCTFWeb
							</span>
						{/if}
					</div>

					{#if day.deadlines.length > 0}
						<div class="space-y-1">
							{#each day.deadlines as deadline}
								<div
									class="px-2 py-1 rounded text-[10px] font-medium bg-semantic-critical/20 text-semantic-critical truncate"
									title={deadline.descricao}
								>
									{deadline.descricao}
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>

	<!-- Upcoming Deadlines -->
	<div class="card p-6">
		<h2 class="font-semibold text-slate-800 mb-4">Próximos Prazos em {monthNames[currentMonth]}</h2>

		{#if getObrigacoesDoMes().filter(o => o.status !== 'ENTREGUE').length === 0}
			<p class="text-slate-400 text-sm">Nenhuma obrigação pendente para este mês.</p>
		{:else}
			<div class="space-y-3">
				{#each getObrigacoesDoMes().filter(o => o.status !== 'ENTREGUE') as obr (obr.id)}
					{@const badge = getStatusBadge(obr.status)}
					<div class="flex items-center justify-between py-2 border-b border-slate-200/50 last:border-0">
						<div class="flex items-center gap-3">
							<div class="w-10 h-10 rounded-lg bg-semantic-warning/10 flex items-center justify-center">
								<span class="text-sm font-bold text-semantic-warning">
									{obr.mes.toString().padStart(2, '0')}
								</span>
							</div>
							<div>
								<p class="text-slate-800 font-medium text-sm">{obr.cliente.nomeRazao}</p>
								<p class="text-slate-400 text-xs">{obr.tipo}</p>
							</div>
						</div>
						<span class="badge {badge.class}">{badge.label}</span>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
