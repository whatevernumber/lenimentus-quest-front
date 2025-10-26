<script>
    import Main from "$lib/components/Main.svelte";
    import {fade} from 'svelte/transition';
    import {onMount} from "svelte";

    let states = {
        start: {
            ru: 'Начать',
            en: 'Start',
        },
        continue: {
            ru: 'Продолжить',
            en: 'Continue',
        },
        link: {
            ru: 'lenimentus',
            en: 'lenimentus'
        },
        copyright: {
            ru: 'Эл Фарбер',
            en: 'L Farber',
        }
    }

    let start = $state(false);
    let buttonText = $state('');
    let glitchContinue = $state(false);
    let preferredLanguage = $state('ru');
    let userStages = $state();

    onMount(() => {
        userStages = JSON.parse(localStorage.getItem("stages"));
        getPreferredLanguage();
        setButtonText();
    });

    const setLanguage = (lang) => {
        localStorage.setItem('language', lang);
        preferredLanguage = lang;
        setButtonText();
    }

    const getPreferredLanguage = () => {
        let userLanguage = localStorage.getItem("language");

        if (!userLanguage) {
            localStorage.setItem('language', preferredLanguage);
        } else {
            preferredLanguage = userLanguage;
        }
    }

    const setButtonText = () => {
        if (userStages && userStages.length) {
            buttonText = states['continue'][preferredLanguage];
            glitchContinue = true;
        } else {
            buttonText = states['start'][preferredLanguage];
        }
    }

</script>

{#if !start}
    <div class="start_wrapper">
        <div class="begin_button_wrapper">
            <button class="begin_button glitch glitch_{glitchContinue ? 'continue' : 'start'}" onclick={() => start = true}
                    style="--text: '{buttonText}'"
            >
                {buttonText}
            </button>
        </div>

        <div class="language_choice">
            <div class="language_button { preferredLanguage === 'ru' ? 'active' : ''}" onclick={() => setLanguage('ru')} role="button" tabindex="1">
                ru
            </div>
            <div class="language_button { preferredLanguage === 'en' ? 'active' : ''}" onclick={() => setLanguage('en')} role="button" tabindex="1">
                en
            </div>
        </div>
    </div>
{/if}

{#if start}
    <div class="quest_wrapper" transition:fade|global={{ delay: 100, duration: 200 }}>
        <Main {preferredLanguage} />
        <footer class="leni_footer">
            <a class="book_link" href="https://www.litres.ru/el-farber/lenimentus/" target="_blank">{states.link[preferredLanguage]}</a>
            <a class="copyright" href="mailto:lenimentus@protonmail.com">©{states.copyright[preferredLanguage]}</a>
        </footer>
    </div>
{/if}

<style>
    .start_wrapper,
    .quest_wrapper {
        margin: auto;
    }

    .start_wrapper {
        display: flex;
        flex-direction: column;
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
        content: var(--text);
        display: block;
        position: absolute;
        left: 50px;
        top: 30px;
        opacity: 0.8;
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

    .language_choice {
        margin-top: 100px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        font-size: 35px;
        font-weight: bold;
        text-transform: uppercase;
    }

    .language_button {
        background-image: url('/img/special_group.svg');
        background-size: cover;
        background-repeat: no-repeat;
        position: relative;
        padding: 30px 40px;
        cursor: pointer;
    }

    .language_button.active {
        text-shadow: -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px 0 white;
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

    .leni_footer {
        text-align: center;
        padding: 15px 0;
    }

    .leni_footer .book_link {
        display: none;
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
        letter-spacing: 0.7em;
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

    @media (max-width: 1023px) {
        .leni_footer {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100vw;
        }

        .quest_wrapper {
            margin-top: 0;
        }
    }

    @media (max-width: 600px) {
        .leni_footer .book_link {
            display: block;
        }

        .leni_footer {
            display: flex;
            column-gap: 15px;
            align-items: center;
            justify-content: center;
        }

        .copyright {
            margin-top: 0;
        }

        .copyright, .book_link {
            letter-spacing: 0.5em;
        }
    }
</style>