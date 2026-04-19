<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<div class="flex items-center justify-center min-h-[60vh]">
	<div class="text-center">
		<div class="animate-spin w-8 h-8 border-2 border-semantic-accent border-t-transparent rounded-full mx-auto mb-4"></div>
		<p class="text-slate-500">Saindo...</p>
	</div>
</div>

<form method="POST" use:enhance class="hidden">
	<button type="submit">Logout</button>
</form>
