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
    }

}