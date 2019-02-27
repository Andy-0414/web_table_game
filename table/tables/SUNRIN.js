module.exports = {
    primalName: "SUNRIN",
    getData(count = 10) {
        return {
            option: {
                class: 'chip',

                width: 100,
                height: 100,
                reverse: false,
                front: {
                    image: `./assets/sunrin.png`
                },
                back: {
                    image: `./assets/sunrin.png`
                },
                style: {}
            },
            count: count,
            x: 600,
            y: 400,
        }
    }
}