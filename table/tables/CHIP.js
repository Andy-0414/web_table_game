module.exports = {
    primalName: "CHIP",
    getData(count = 10) {
        return {
            option: {
                class: 'chip',

                width: 50,
                height: 50,
                reverse: false,
                front: {
                    image: `./assets/coins/chip.png`
                },
                back: {
                    image: `./assets/coins/chip.png`
                },
                style: {}
            },
            count: count,
            x: 600,
            y: 400,
        }
    }
}