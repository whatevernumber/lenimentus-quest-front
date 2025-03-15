<script>
    import {fade, fly} from "svelte/transition";

    let { stage, imageLoaded, width, specialAction, options } = $props();

    const specialCoverStages = [
        '2.4.2', '000', '3.3'
    ];

    let src = $derived.by(() => {
        let path = '/img/quest/stage';
        if (!imageLoaded) {
            path += '.png';
        } else {
            let prefix = '';
            if (specialCoverStages.some((el) => el === stage)) {

                const savedAction = stage === '3.3' ?
                    (options.length < 2 ? 'a' : 'b') :
                    (localStorage.getItem('special') ?? 'a');

                prefix += '_' + (specialAction ?? savedAction);
            }

            path += '_' + stage + prefix + '.png';
        }

        return path;
    });
</script>

<div class="{ (imageLoaded ? 'frame' : '') + ' image'}">
    {#key src}
        <img {width} class="main_cover" {src} alt="Обложка главы" out:fly={ {duration:500, opacity: 25} } in:fade={ {duration: 1000} }>
    {/key}
</div>

<style>

    .frame.image {
        overflow: hidden;
    }

    .image {
        width: 505px;
        height: 500px;
        transition: width 0.2s;
    }

    .frame {
        box-sizing: border-box;
        border: 3px solid #8ACBD5;
        border-radius: 20px;
    }

    .main_cover {
        height: 102%;
        object-fit: cover;
        transition: all 5s ease;
        border-radius: 20px;
        animation: move 60s cubic-bezier(1, 0.14, 0.75, 0.67) 2s both infinite;
    }

    @media (max-width: 500px) {
        .image, img {
            width: 100%;
        }
    }

    @keyframes move {
        0% {
            transform: translate(0);
        }

        20% {
            transform: translate(-2px, -2px);
        }

        40% {
            transform: translate(-1px, -1px);
        }

        60% {
            transform: translate(1px, 1px);
        }

        80% {
            transform: translate(2px, 2px);
            scale: 1.7;
        }

        to {
            transform: translate(0);
        }
    }
</style>