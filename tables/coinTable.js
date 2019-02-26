module.exports = {
    getCoin() {
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
            count : 50,
            x: 400,
            y: 400,
        }
    },
    getChip(){
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
            count: 5,
            x: 600,
            y: 400,
        }
    }
}