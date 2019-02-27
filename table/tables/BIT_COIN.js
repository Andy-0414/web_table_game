module.exports = {
    primalName : "BIT_COIN",
    getData(count = 10) {
        return {
            option : {
                class: 'coin',

                width: 80,
                height: 80,
                reverse: false,
                front: {
                    image: `./assets/coins/coin.png`
                },
                back: {
                    image: `./assets/coins/coin.png`
                },
                style: {}
            },
            count : count,
            x: 400,
            y: 400,
        }
    },
}