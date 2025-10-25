<script>
    import Actions from "$lib/components/Actions.svelte";
    import { fly } from 'svelte/transition';

    let { actionKey, imageLoaded, stages, fetchAction, options, stage, specialAction = $bindable(), action = $bindable() } = $props();

    let test = $state(true);
</script>


{#if imageLoaded && options && options.length && test}
    <div class="options" transition:fly={{ x:200, duration: 500 }}>
        <Actions bind:action={action} {specialAction} {options} {stage} {fetchAction} {stages} {actionKey} />
    </div>
{/if}

<style>
    .options {
        width: 80%;
        margin: auto;
        padding: 20px;
        height: 20vh;
    }

    @media (max-width: 1000px) {
        .options {
            width: 100vw;
            position: fixed;
            max-height: 200px;
            background-color: rgb(34 36 51);;
            padding: 0;
            left: 0;
            bottom: 0;
            height: 130px;
        }
    }
</style>