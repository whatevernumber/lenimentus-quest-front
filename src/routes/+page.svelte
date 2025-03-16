<script>
    import Main from "$lib/components/Main.svelte";
    import {fade} from 'svelte/transition';
    import {onMount} from "svelte";

    let start = $state(false);
    let buttonText = $state('Начать');
    let glitchContinue = $state(false);

    onMount(() => {
        let userStages = JSON.parse(localStorage.getItem("stages"));
        if (userStages && userStages.length) {
            buttonText = 'Продолжить';
            glitchContinue = true;
        }
    });

</script>

{#if !start}
    <div class="begin_button_wrapper">
        <button class="begin_button glitch glitch_{glitchContinue ? 'continue' : 'start'}" onclick={() => start = true}>
            {buttonText}
        </button>
    </div>
{/if}

{#if start}
    <div class="quest_wrapper" transition:fade|global={{ delay: 100, duration: 200 }}>
        <header class="leni_header">
            <a class="book_link" href="https://www.litres.ru/el-farber/lenimentus/" target="_blank">Ссылка на книгу</a>
        </header>
        <Main/>
        <footer class="leni_footer">
            <a class="copyright" href="https://github.com/whatevernumber" target="_blank">©Эл Фарбер</a>
        </footer>
    </div>
{/if}

<style>
    .begin_button_wrapper,
    .quest_wrapper {
        margin: auto;
    }

    .begin_button {
        font-family: Jura, sans-serif;
        font-style: normal;
        font-weight: 600;
        font-size: 25px;
        padding: 30px 50px;
        line-height: 30px;
        color: #c5cd9ede;
        text-transform: uppercase;
        border: 1px dashed #c5cd9ede;
        background-color: transparent;
        cursor: pointer;
        border-left-color: transparent;
        border-right-color: transparent;
    }

    .begin_button:hover {
        color: #8ACBD5;
        border-color: #8ACBD5;
        border-bottom-color: transparent;
        border-top-color: transparent;
    }

    .begin_button.glitch {
        position: relative;
        font-size: 64px;
        font-weight: 700;
        line-height: 1.2;
        color: transparent;
        letter-spacing: 4px;
        z-index: 1;
    }

    .glitch:before,
    .glitch:after {
        display: block;
        position: absolute;
        left: 50px;
        top: 30px;
        opacity: 0.8;
    }

    .glitch_continue:before,
    .glitch_continue:after {
        content: "Продолжить";
    }

    .glitch_start:before,
    .glitch_start:after {
        content: "Начать";
    }

    .glitch:before {
        animation: glitch-color 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
        color: #8ACBD5;
        z-index: -1;
    }

    .glitch:after {
        animation: glitch-color 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse both infinite;
        color: #E998e3;
        z-index: -2;
    }

    @keyframes glitch-color {
        0% {
            transform: translate(0);
        }

        20% {
            transform: translate(-2px, 1px);
        }

        40% {
            transform: translate(-1px, -2px);
        }

        60% {
            transform: translate(1px, 1px);
        }

        80% {
            transform: translate(2px, -1px);
        }

        to {
            transform: translate(0);
        }
    }

    .quest_wrapper {
        max-width: 100%;
    }

    .leni_footer,
    .leni_header {
        text-align: center;
        padding: 15px 0;
    }

    .leni_header {
        margin-bottom: 10px;
    }

    .copyright {
        cursor: pointer;
        margin-top: 10px;
    }

    .book_link,
    .copyright {
        font-family: 'Jura', sans-serif;
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 20px;
        text-align: center;
        letter-spacing: 0.5em;
        color: rgba(255, 255, 255, 0.65);
    }

    .book_link:hover,
    .copyright:hover {
        opacity: 0.7;
    }

    @media (max-width: 850px) {
        .begin_button.glitch {
            font-size: 30px;
        }
    }
</style>