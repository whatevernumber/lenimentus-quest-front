export const rotate_hue_360 = (element) =>
    setInterval(() =>
        element.style.filter =
            `hue-rotate(${randomize(-360, 360)}deg)`, 1500);

export const randomize = (start, end, dotIndex = 0) => {

    if (end < start) {
        [start, end] = [end, start];
    }

    let result = Math.random() * (end - start) + start;
    result = result.toFixed(dotIndex);
    return Number(result);
};