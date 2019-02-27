module.exports = {
    getCoin(count = 10) {
        return {
            option : {
                class: 'coin',

                width: 80,
                height: 80,
                reverse: false,
                front: {
                    image: `./assets/coin.png`
                },
                back: {
                    image: `./assets/coin.png`
                },
            },
            count : count,
            x: 400,
            y: 400,
        }
    },
    getChip(count = 10){
        return {
            option: {
                class: 'coin',

                width: 100,
                height: 100,
                reverse: false,
                front: {
                    image: `./assets/chip.png`
                },
                back: {
                    image: `./assets/chip.png`
                },
            },
            count: count,
            x: 600,
            y: 400,
        }
    }
}