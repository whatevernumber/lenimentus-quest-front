<script>
    import Actions from "$lib/components/Actions.svelte";
    import { fly } from 'svelte/transition';
    let { imageLoaded, stages, fetchAction, options, stage, specialAction = $bindable(), action = $bindable() } = $props();

    let test = $state(true);
</script>


{#if imageLoaded && options && options.length && test}
    <div class="options" transition:fly={{ x:200, duration: 500 }}>
        <Actions bind:action={action} {specialAction} {options} {stage} {fetchAction} {stages} />
    </div>
{/if}

<style>
    .options {
        width: 80%;
        margin: auto;
        padding: 20px;
    }
</style>