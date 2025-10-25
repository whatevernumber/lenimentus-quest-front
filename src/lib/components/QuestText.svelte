<script>
    import { fade } from 'svelte/transition';

    let { text, imageLoaded } = $props();
    let textAppear = $derived(text && text.length > 0);
    let filteredText = $derived(text.replaceAll('/n', '<br> <br>'));
    let textContainer = $state();

    $effect(() => {
        if (text) {
            textContainer.scrollTop = 0;
        }
    });

    function typewriter(node, { speed = 1 }) {
        const text = node.innerText;
        const duration = text.length / (speed * 0.01);

        return {
            duration,
            tick: (t) => {
                const i = ~~(text.length * t);
                node.innerText = text.slice(0, i);
            }
        };
    }
</script>


<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Jura:wght@300..700&family=Lobster&display=swap" rel="stylesheet">
</svelte:head>
<div class={(imageLoaded && textAppear ? 'loaded_text_frame' : '') + ' content'}>
    <div class="main_wrapper">
        <div class={(imageLoaded && textAppear ? 'loader_overflow' : '') + ' loader_text'} bind:this={textContainer}>
            {#if textAppear && imageLoaded}
                <div transition:fade|global={{ delay: 250, duration: 300 }} class="text_wrapper">
                    {#key filteredText}
                        <p in:typewriter={{ speed: 12}}>
                            {@html filteredText}
                        </p>
                    {/key}
                </div>
            {:else if imageLoaded && !textAppear }
                <div class="loading">
                    <div class="circle"></div>
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    .circle {
        width: 50px;
        height: 50px;
        background-image: url("/img/loading.png");
        background-size: cover;
        animation: 1s infinite loading;
    }

    .main_wrapper {
        display: flex;
        flex-direction: column;
        row-gap: 50px;
        font-family: 'Jura', serif;
        font-style: normal;
        font-weight: 600;
        font-size: 18px;
        line-height: 30px;
        color: #B9D28C;
        text-shadow: 3px 4px 4px rgba(0, 0, 0, 0.25);
    }

    @keyframes loading {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    .content {
        height: 50vh;
        width: 400px;
        margin: auto;
        padding: 20px;
        box-sizing: border-box;
    }

    .loaded_text_frame {
        background: rgba(138, 203, 213, 0.2);
        border: 3px solid #8ACBD5;
        border-radius: 20px;
    }

    .main_wrapper {
        margin: auto;
    }

    @media (max-width: 1024px) {
        .content {
            width: 90vw;
            height: 40vh;
        }

        .loader_overflow {
            height: 35vh;
        }
    }

    .loader_text {
        display: flex;
        flex-direction: column;
        row-gap: 10px;
    }

    .loader_overflow {
        height: 46vh;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: #c5cd9ede transparent;
    }

    @media(max-width: 758px) {
        .content {
            min-height: 200px;
            height: 35vh;
        }

        .loader_overflow {
            height: 30vh;
        }
    }

    @media(max-width: 500px) {
        .content {
            width: 100%;
        }
    }
</style>