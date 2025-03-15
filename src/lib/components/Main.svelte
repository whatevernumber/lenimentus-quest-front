<script>
    import Image from "$lib/components/Image.svelte";
    import QuestText from "$lib/components/QuestText.svelte";
    import Options from "$lib/components/Options.svelte";
    import {onMount} from "svelte";
    import {PUBLIC_SERVER} from "$env/static/public";
    import Loader from "$lib/components/Loader.svelte";
    import FinishButton from "$lib/components/FinishButton.svelte";

    import calmMusic from "$lib/music/lights_out.flac";
    import dangerMusic from "$lib/music/sleeping_orion.flac";
    import BadEndMusic from "$lib/music/bad_ending.flac";
    import GoodEndMusic from "$lib/music/good_ending.flac";

    let coverWidth = $state(950);
    let showText = $state(true);
    let imageLoaded = $state(false);

    let stage = $state('1');
    let stageDetails = $state();
    let userStages = $state([]);

    let pickedAction = $state(null);
    let specialAction = $state(null);
    let actionLoading = $state(false);
    let windowWidth = $state(0);

    const tracks = {
        calm: calmMusic,
        danger: dangerMusic,
        bad: BadEndMusic,
        good: GoodEndMusic,
    }

    const calmStages = [
        '1', '1.1', '1.2', '1.3', '1.4', '1.5', '1.6',
        '2', '2.1', '2.1.1', '2.1.2',
        '2.2', '2.3', '2.4.1', '2.4.2'
    ];

    const endingStages = [
        '000', '001', '002', '003', '004', '005', '6.2'
    ];

    const dangerMusicSwitchStages = [
        '3.1', '3.1.1', '3.1.2'
    ];

    const stopMusicStage = '3';
    const successStage = '6.2';

    const specialSoundEffectsStages = [
        '000', '001','002', '003', '004', '005',
        '1.2', '1.3', '2.3', '2.4.1', '2',
        '3.1.1', '3.1.2', '4'
    ];

    // audio
    let mainAudio = $state();
    let audioEffect = $state();

    const playMusic = () => {
        mainAudio.play();
    }

    const stopMusic = () => {
        mainAudio.pause();
    }

    const deVolumeAudio = (audio) => {
        audio.volume = 0.6;
    }

    const returnAudioVolume = (audio) => {
        audio.volume = 0.9;
    }

    const playMain = (track) => {
        let delay = 0;

        if (mainAudio) {
            stopMusic();
            delay = 1800;
        }

        mainAudio = new Audio(track);
        mainAudio.volume = 0.9;
        mainAudio.loop = true;
        setTimeout(playMusic, delay);
    }

    const audioFadeOut = (audio) => {
        setInterval(
            () => {
                if (audio.volume > 0.1) {
                    audio.volume -= 0.1;
                } else {
                    audio.pause();
                    audio.volume = 0.9;
                    clearInterval(audioFadeOut);
                }
            }, 50);
    }

    const playSoundEffect = (nextStage, action) => {
        let delay = 2500;

        if (audioEffect) {
            audioEffect.volume = 0.2;
            audioEffect.pause();
        }

        audioEffect = new Audio('music/sounds/' + nextStage + '.ogg');
        audioEffect.play();
        audioEffect.volume = 0.9;

        setTimeout(async () => {
            returnAudioVolume(mainAudio);
        }, delay)
    }

    // Stages
    const prepareForNextStage = async (action = null, nextStage = null) => {
        actionLoading = true;

        if (nextStage && dangerMusicSwitchStages.some((el) => el === nextStage) || nextStage && endingStages.some((el) => el === nextStage) || nextStage === stopMusicStage) {
            audioFadeOut(mainAudio);

            if (audioEffect) {
                audioEffect.pause();
            }
        }

        if (action && specialSoundEffectsStages.some((el) => el === nextStage)) {
            deVolumeAudio(mainAudio);
            playSoundEffect(nextStage, action);
        }

        await fetchQuestStage(action);

        // If no action provided, don't delay buttons appearance
        action ? delayButtonLoading() : actionLoading = false;
    }

    const delayButtonLoading = () => {
            setTimeout(() => {
                if (actionLoading) {
                    actionLoading = false;
                } else {
                    clearTimeout(delayButtonLoading)
                }
            }, 2000);
    }

    const fetchQuestStage = async (action = null) => {
        let result = await fetch(PUBLIC_SERVER + '/api/quest', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                stage: stage,
                action: action,
                stages: userStages,
            })
        });

        stageDetails = await result.json();
        prepareStage();
    }

    const prepareStage = () => {
        stage = stageDetails.stage[0]['quest.stage'];

        // initial loading of the image
        if (coverWidth === 950) {
            loadImage();
        }

        if (!userStages.some((el) => el === stage)) {
            setUserData(stageDetails.stage[0]['quest.stage']);
        }

        // Переходные stages
        if (dangerMusicSwitchStages.some((el) => el === stage)) {
            playMain(tracks.danger);
        }

        // Финальные stages
        if (endingStages.some((el) => el === stage)) {
            playEndingMusic(stage);
        }
    }

    const setUserData = (data) => {
        userStages.push(data);
        localStorage.setItem("stages", JSON.stringify(userStages));
    }

    const loadImage = () => {
        imageLoaded = false;
        coverWidth = 500;
        setTimeout(() => {
            imageLoaded = true;
        }, 5000);
    }

    const clearStorage = () => {
        audioFadeOut(audioEffect);
        audioFadeOut(mainAudio);
        localStorage.removeItem("stages");
        playMain(tracks.calm);
        userStages = [];
        stage = '1';
        prepareForNextStage();
    }

    onMount(() => {
        userStages = JSON.parse(localStorage.getItem("stages")) ?? [];

        if (userStages && userStages.length) {
            stage = userStages.slice(-1)[0];
        } else {
            userStages.push(stage);
            localStorage.setItem("stages", JSON.stringify([stage]));
        }

        choseMusic(stage);
        prepareForNextStage();

        // prevent from copying, selecting
        document.addEventListener('contextmenu', event => event.preventDefault());
    });


    let choseMusic = (stage) => {
        if (calmStages.some((el) => el === stage)) {
            playMain(tracks.calm);
        } else if (endingStages.some((el) => el === stage)) {
            playEndingMusic(stage);
        } else {
            playMain(tracks.danger);
        }
    }

    let playEndingMusic = (stage) => {
        playMain(stage === successStage ? tracks.good : tracks.bad);
    }

    const openBookPage = () => {
        window.open("https://www.litres.ru/el-farber/lenimentus/", '_blank');
    }
</script>

<svelte:window bind:innerWidth={windowWidth}/>
<section class="main_section">
    <div class="quest_main">
        <Image {imageLoaded} {stage} {specialAction} options={stageDetails?.actions} width={coverWidth}/>
        {#if windowWidth < 768 && !imageLoaded }
            <div class="mini_loader {imageLoaded ? 'hidden' : ''}">
                <Loader/>
            </div>
        {/if}
        {#if showText}
            <div class="content_wrapper">
                <QuestText text={stageDetails?.stage[0]['quest.text'] ?? ''} {imageLoaded}/>
            </div>
        {/if}
    </div>
    {#if stageDetails?.actions && !actionLoading}
        <Options bind:action={pickedAction} bind:specialAction={specialAction} {imageLoaded} {stage}
                 fetchAction={prepareForNextStage} options={stageDetails.actions} stages={userStages}/>
    {/if}
    {#if actionLoading && imageLoaded || !imageLoaded && windowWidth > 768}
        <div class="loader">
            <Loader/>
        </div>
    {/if}
    {#if (endingStages.some((el) => el === stage) && imageLoaded && !actionLoading)}
        <div class="special_actions">
            <FinishButton action={clearStorage} buttonText="Посмотреть ещё раз" />
            {#if stage === successStage}
                <FinishButton action={openBookPage} buttonText="Узнать продолжение истории" />
            {/if}
        </div>
    {/if}
    <div class="logo">
        L E N I M E N T U S
    </div>
</section>

<style>
    .quest_main {
        display: flex;
        width: 1000px;
        overflow: hidden;
        justify-content: space-evenly;
        column-gap: 50px;
    }

    .main_section {
        position: relative;
        padding: 40px 0 5px 0;
        width: 1000px;
        height: 800px;
        margin: auto;
        display: flex;
        flex-direction: column;
        background-image: url("/src/lib/img/back.jpg");
        background-repeat: no-repeat;
        background-size: cover;

        box-shadow: 0 0 55px 20px #b9d28c08, 1px 1px 32px 36px #8acbd50f, -2px -2px 36px 42px #d28ad017;
        border-radius: 15px;
        outline: 12px double;
    }

    .content_wrapper {
        display: flex;
        flex-direction: column;
    }

    .loader {
        margin: auto;
    }

    .mini_loader,
    .mini_loader.hidden {
        display: none;
    }

    .special_actions {
        width: 100%;
        display: flex;
        margin: auto;
        column-gap: 20px;
    }

    .logo {
        width: max-content;
        position: absolute;
        bottom: 0;
        left: 7%;
        font-family: 'Montserrat', serif;
        font-style: normal;
        font-weight: 400;
        font-size: 28px;
        line-height: 35px;
        text-align: center;
        color: rgba(145, 149, 173, 0.38);
        letter-spacing: 1.2em;
        color: #9195ad61;
    }

    @media (max-width: 1000px) {
        .quest_main {
            width: 100%;
            flex-direction: column;
            row-gap: 15px;
            align-items: center;
        }

        .main_section {
            width: 100%;
            height: auto;
        }

        .special_actions {
            margin-top: 40px;
        }

        .logo {
            display: flex;
            position: initial;
            margin: auto;
            letter-spacing: 0.5em;
        }

        .loader,
        .mini_loader {
            padding: 50px 0;
        }
    }

    @media (max-width: 600px) {
        .special_actions {
            flex-direction: column;
            row-gap: 50px;
        }

        .logo {
            font-size: 15px;
            letter-spacing: 0.2em;
        }
    }

    @media (max-width: 500px) {
        .quest_main {
            box-sizing: border-box;
            padding-left: 10px;
            padding-right: 10px;
        }

        .loader,
        .mini_loader {
            padding: 50px 0;
        }

        .mini_loader {
            display: block;
        }
    }
</style>