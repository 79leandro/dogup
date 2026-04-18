<script lang="ts">
	interface Column<T> {
		key: keyof T | string;
		label: string;
		sortable?: boolean;
		width?: string;
		align?: 'left' | 'center' | 'right';
	}

	interface Props<T> {
		data: T[];
		columns: Column<T>[];
		rowKey: keyof T;
		searchable?: boolean;
		searchPlaceholder?: string;
		pageSize?: number;
		onRowClick?: (row: T) => void;
		loading?: boolean;
		emptyMessage?: string;
		formatRow?: (row: T) => T;
	}

	function getNestedValue(obj: any, path: string): any {
		return path.split('.').reduce((acc, part) => acc && acc[part], obj);
	}

	let {
		data,
		columns,
		rowKey,
		searchable = false,
		searchPlaceholder = 'Buscar...',
		pageSize = 10,
		onRowClick,
		loading = false,
		emptyMessage = 'Nenhum dado encontrado',
		formatRow
	}: Props<any> = $props();

	let searchQuery = $state('');
	let sortKey = $state<string | null>(null);
	let sortDirection = $state<'asc' | 'desc'>('asc');
	let currentPage = $state(1);

	const filteredData = $derived(
		searchQuery
			? data.filter(row =>
				columns.some(col =>
					String(getNestedValue(row, String(col.key)))
						.toLowerCase()
						.includes(searchQuery.toLowerCase())
				)
			)
			: data
	);

	const sortedData = $derived(
		sortKey
			? [...filteredData].sort((a, b) => {
				const aVal = getNestedValue(a, sortKey ?? '');
				const bVal = getNestedValue(b, sortKey ?? '');
				const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
				return sortDirection === 'asc' ? cmp : -cmp;
			})
			: filteredData
	);

	const totalPages = $derived(Math.ceil(sortedData.length / pageSize));
	const paginatedData = $derived(
		sortedData
			.slice((currentPage - 1) * pageSize, currentPage * pageSize)
			.map(row => formatRow ? formatRow(row) : row)
	);

	function toggleSort(key: string) {
		if (sortKey === key) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortKey = key;
			sortDirection = 'asc';
		}
	}

	function goToPage(page: number) {
		currentPage = Math.max(1, Math.min(page, totalPages));
	}
</script>

<div class="card border-terminal-700 overflow-hidden">
	<!-- Header with Search -->
	{#if searchable}
		<div class="p-4 border-b border-terminal-700">
			<div class="relative">
				<input
					type="text"
					bind:value={searchQuery}
					placeholder={searchPlaceholder}
					class="w-full bg-terminal-700/50 border border-terminal-600 rounded-lg pl-10 pr-4 py-2.5 text-sm text-terminal-100 placeholder-terminal-500 focus:outline-none focus:ring-2 focus:ring-semantic-accent/50 focus:border-semantic-accent transition-all"
				/>
				<svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-terminal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
				</svg>
			</div>
		</div>
	{/if}

	<!-- Table -->
	<div class="overflow-x-auto">
		<table class="w-full">
			<thead class="bg-terminal-800/50">
				<tr>
					{#each columns as col}
						<th
							class="px-4 py-3 text-xs font-semibold text-terminal-400 uppercase tracking-wider
								{col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}
								{col.sortable ? 'cursor-pointer hover:text-terminal-200 select-none' : ''}"
							style={col.width ? `width: ${col.width}` : ''}
							onclick={() => col.sortable && toggleSort(String(col.key))}
						>
							<div class="flex items-center gap-2
								{col.align === 'center' ? 'justify-center' : col.align === 'right' ? 'justify-end' : ''}">
								{col.label}
								{#if col.sortable && sortKey === String(col.key)}
									<svg class="w-3 h-3 {sortDirection === 'desc' ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
									</svg>
								{/if}
							</div>
						</th>
					{/each}
				</tr>
			</thead>
			<tbody class="divide-y divide-terminal-700/50">
				{#if loading}
					{#each Array(5) as _}
						<tr>
							{#each columns as _}
								<td class="px-4 py-3">
									<div class="h-4 bg-terminal-700 rounded animate-pulse w-3/4"></div>
								</td>
							{/each}
						</tr>
					{/each}
				{:else if paginatedData.length === 0}
					<tr>
						<td colspan={columns.length} class="px-4 py-12 text-center text-terminal-500">
							{emptyMessage}
						</td>
					</tr>
				{:else}
					{#each paginatedData as row}
						<tr
							class="transition-colors hover:bg-terminal-700/30
								{onRowClick ? 'cursor-pointer' : ''}"
							onclick={() => onRowClick?.(row)}
						>
							{#each columns as col}
								<td
									class="px-4 py-3 text-sm text-terminal-200
										{col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : ''}"
								>
									{getNestedValue(row, String(col.key))}
								</td>
							{/each}
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>

	<!-- Pagination -->
	{#if totalPages > 1}
		<div class="flex items-center justify-between px-4 py-3 border-t border-terminal-700">
			<p class="text-sm text-terminal-500">
				Mostrando {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, sortedData.length)} de {sortedData.length}
			</p>
			<div class="flex items-center gap-2">
				<button
					onclick={() => goToPage(currentPage - 1)}
					disabled={currentPage === 1}
					class="p-1.5 rounded-lg border border-terminal-600 text-terminal-400 hover:text-terminal-100 hover:bg-terminal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					aria-label="Página anterior"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
					</svg>
				</button>

				{#each Array(totalPages) as _, i}
					{#if i + 1 === 1 || i + 1 === totalPages || (i + 1 >= currentPage - 1 && i + 1 <= currentPage + 1)}
						<button
							onclick={() => goToPage(i + 1)}
							class="w-8 h-8 rounded-lg text-sm font-medium transition-colors
								{i + 1 === currentPage
									? 'bg-semantic-accent text-white'
									: 'border border-terminal-600 text-terminal-400 hover:text-terminal-100 hover:bg-terminal-700'}"
						>
							{i + 1}
						</button>
					{:else if i + 1 === currentPage - 2 || i + 1 === currentPage + 2}
						<span class="text-terminal-500">...</span>
					{/if}
				{/each}

				<button
					onclick={() => goToPage(currentPage + 1)}
					disabled={currentPage === totalPages}
					class="p-1.5 rounded-lg border border-terminal-600 text-terminal-400 hover:text-terminal-100 hover:bg-terminal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					aria-label="Próxima página"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
					</svg>
				</button>
			</div>
		</div>
	{/if}
</div>