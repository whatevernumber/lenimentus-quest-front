<script>
    let {buttonText, action} = $props();
</script>

<div class="finish_button_wrapper">
    <button class="finish_button" onclick={action}>{@html buttonText}</button>
</div>

<style>
    .finish_button_wrapper {
        width: 100%;
        display: flex;
        justify-content: center;
        margin: auto;
    }

    .finish_button {
        align-self: center;
        padding: 15px;
        text-transform: uppercase;
        font-weight: 700;
        background-color: transparent;
        color: #CDE998;
        border: 8px dashed #98E1E9;
        border-left-color: transparent;
        border-bottom-color: transparent;
        rotate: -4deg;
        cursor: pointer;
        font-size: large;
        transition-duration: 200ms;
    }

    .finish_button:hover {
        background-color: rgba(80, 0, 0, 0.36);
        border-style: solid;
        color: #98E1E9;
        rotate: 3deg;
        transition-duration: 200ms;
    }

    @media (max-width: 1023px) {
        .finish_button_wrapper {
            width: 70vw;
            display: block;
            text-align: center;
        }

        .finish_button {
            margin-top: 10px;
            font-size: medium;
            padding: 5px;
        }

    }
</style>