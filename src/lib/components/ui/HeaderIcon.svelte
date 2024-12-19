<script lang="ts">
	let { src, alt }: { src: string; alt: string } = $props();
</script>

<span class="bg-white inline-flex w-10 aspect-square rounded-full p-2">
	<img {src} {alt} />
</span>
