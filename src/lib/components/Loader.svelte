<script>

    let greenPosition = $state(0);
    let pinkPosition = $state(0);
    let bluePosition = $state(0);
    setInterval(() => {
        if (!greenPosition && !pinkPosition && !bluePosition) {
            greenPosition = '20px';
        }

        if (greenPosition) {
            greenPosition = 0;
            bluePosition = '20px';
        } else if (bluePosition) {
            bluePosition = 0;
            pinkPosition = '20px';
        } else if (pinkPosition) {
            pinkPosition = 0;
            greenPosition = '20px';
        }
    }, 200)
</script>

<div class="wrapper">
    <div class="circle_wrapper">
        <div class="circle green" style="top: {greenPosition}"></div>
    </div>
    <div class="circle_wrapper">
        <div class="circle blue" style="top: {bluePosition}"></div>
    </div>
    <div class="circle_wrapper">
        <div class="circle pink" style="top: {pinkPosition}"></div>
    </div>
</div>

<style>
    .wrapper {
        display: flex;
        column-gap: 20px;
        justify-content: center;
    }

    .circle_wrapper {
        position: relative;
        width: 60px;
        height: 60px;
    }

    .circle {
        position: absolute;
        width: 58px;
        height: 58px;
        border-radius: 50%;
        transition: top 0.2s ease-in-out;
    }

    .pink {
        background: #D28AD0;
    }

    .blue {
        background: #8ACBD5;
    }

    .green {
        background: #B9D28C;
    }
</style>