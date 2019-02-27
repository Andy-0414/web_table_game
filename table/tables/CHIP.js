module.exports = {
    primalName: "CHIP",
    getData(count = 10) {
        return {
            option: {
                class: 'chip',

                width: 100,
                height: 100,
                reverse: false,
                front: {
                    image: `./assets/coins/chip.png`
                },
                back: {
                    image: `./assets/coins/chip.png`
                },
            },
            count: count,
            x: 600,
            y: 400,
        }
    }
}