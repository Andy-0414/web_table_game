module.exports = {
    primalName: "GO_WHITE",
    getData(count = 100) {
        return {
            option: {
                class: 'go_black',

                width: 50,
                height: 50,
                reverse: false,
                front: {
                    image: `./assets/go/go_black.png`
                },
                back: {
                    image: `./assets/go/go_black.png`
                },
                style: {}
            },
            count: count,
            x: 600,
            y: 400,
        }
    }
}