module.exports = {
    primalName: "RTX",
    getData(count = 10) {
        return {
            option: {
                class: 'rtx',

                width: 200,
                height: 200,
                reverse: false,
                front: {
                    image: `./assets/RTX/RTX_ON.png`
                },
                back: {
                    image: `./assets/RTX/RTX_OFF.png`
                },
                style: {}
            },
            x: 600,
            y: 400,
        }
    }
}