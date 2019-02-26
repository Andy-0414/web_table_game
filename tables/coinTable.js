module.exports = {
    getCoin() {
        return {
            class: 'card',
            option : {
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
            spawnX: 400,
            spawnY: 400,
        }
    }

}