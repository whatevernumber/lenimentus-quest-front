<script>
    let {action = $bindable(), specialAction = $bindable(), options, stage, fetchAction, stages} = $props();

    const specialLevels = [
        '2.3',
        '3.1.1',
        '3.1.2',
        '3.2.1',
        '3.2.2',
    ];

    const specialIndexStages = [
        '2.3'
    ];

    const specialIndexTranslate = [
        'a',
        'b',
        'c',
    ];

    const specialStagesMap = {
        '3.1.1': 'a',
        '3.1.2': 'b',
        '3.2.1': 'c',
        '3.2.2': 'c',
    }

    const selectAction = (selectedAction, index, nextStage) => {
        if (specialLevels.some(el => el === stage)) {

            // special case with index
            if (specialIndexStages.some(el => el === stage)) {
                specialAction = specialIndexTranslate[index];
            } else {
                specialAction = specialStagesMap[stage]
            }

            setSpecialAction();
        } else if (specialAction) {
            specialAction = null;
        }

        action = selectedAction;
        fetchAction(action, nextStage);
    }

    const setSpecialAction = () => {
        localStorage.setItem("special", specialAction);
    };

    const positionIndexClasses = [
        'right',
        'left',
        'center'
    ];

    const closeWindowLevel = '1.2';
    const corridorClosed = '3.2.1';
    const corridorOpened = '3.2.2';

    const messageHeard = '1.3';

    const pickTheRightImage = (index, options) => {
        let prefix = options['ss.stage'];
        switch (stage) {
            case '2.3':
                prefix += '_' + specialIndexTranslate[index];
                break;
            case '3.1.1':
                if (options['quest.action'] === 'Ждать') {
                    prefix = '000_a';
                } else {
                    prefix = stages.some(s => s === closeWindowLevel) ? corridorClosed : corridorOpened;
                }
                break;
            case '3.1.2':
                if (options['quest.action'] === 'Ждать') {
                    prefix = '000_b';
                } else {
                    prefix = stages.some(s => s === closeWindowLevel) ? corridorClosed : corridorOpened;
                }
                break;
            case '3.2.1':
                if (options['quest.action'] === 'Идти к лестнице') {
                    prefix += stages.some(s => s === messageHeard) ? '_b' : '_a';
                } else if (options['quest.action'] === 'Вернуться в комнату') {
                   prefix = '000_c';
                }
                break;
            case '3.2.2':
                if (options['quest.action'] === 'Идти к лестнице') {
                    prefix += stages.some(s => s === messageHeard) ? '_b' : '_a';
                } else if (options['quest.action'] === 'Вернуться в комнату') {
                    prefix = '000_c';
                }
                break;
            default:
                prefix = (options['ss.stage'] ?? (options['a.stage']));
        }

        return prefix + '.png';
    }

    const handleKey = (event, action, index, nextStage) => {
        if (event.code === 'Space' || event.code === 'Enter') {
            selectAction(action, index, nextStage);
        }
    }

    const checkLongActionText = (text) => {
        return text.length > 30;
    }
</script>

<div class="button_wrapper">
    {#each options as option, index}
        <div class="animated_button" onkeydown={(e) => handleKey(e, option['quest.action'], index, option['ss.stage'])} onclick={() => selectAction(option['quest.action'], index, option['ss.stage'])} role="button" tabindex="{index + 1}">
            <img class="image_blurred" src={"/img/quest/stage_" + pickTheRightImage(index, option)} alt="Иллюстрация">
            <div class="action_text { positionIndexClasses[index] ?? ''} {checkLongActionText(option['quest.action']) ? 'long' : ''}">{option['quest.action']}</div>
        </div>
    {/each}
</div>

<style>
    .animated_button {
        width: 250px;
        position: relative;
        padding: 10px;
        border: none;
        border-radius: 5px;

        font-family: 'Jura',serif;
        font-weight: 600;
        font-size: 20px;
        line-height: 20px;

        display: flex;
        align-items: center;
        text-align: right;
        color: #FFFFFF;

        text-shadow: 2px 1px 3px #1C284D;
        outline: 2px solid #B9D28C;
        cursor: pointer;
    }

    .long {
        font-size: 13px;
    }

    .animated_button:nth-child(2) {
        outline: 2px solid #8ACBD5;
    }

    .animated_button:nth-child(3) {
        outline: 2px solid #D28AD0;
    }

    .animated_button:focus {
        outline: 2px solid red;
        text-shadow: 2px 4px 3px #1C284D;
        transform: rotate(-1deg);
    }

    .image_blurred {
        position: absolute;
        width: 260px;
        height: 70px;
        filter: blur(10px);
        border-radius: 20px;
    }

    .animated_button:hover {
        background-color: lightblue;
        text-shadow: 2px 4px 3px #1C284D;
        transform: rotate(-1deg);
    }

    .animated_button:hover .action_text {
        translate: -2px -1px;
    }

    .button_stop {
        background-color: #e79999;
        opacity: 0.3;
    }

    .button_stop:hover {
        background-color: #cc6666;
        opacity: 0.8;
    }

    .button_wrapper {
        display: flex;
        justify-content: space-evenly;
        flex-wrap: wrap;
        row-gap: 50px;
        column-gap: 160px;
    }

    .action_text {
        z-index: 5;
    }

    .action_text {
        padding: 20px;
    }

    .action_text.right {
        margin-left: auto;
    }

    .action_text.center {
        margin: auto;
    }
</style>