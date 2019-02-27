module.exports = {
    primalName: "CHESS_PLATE",
    getData(count = 10) {
        return {
            option: {
                class: 'go_plate',

                width: 800,
                height: 800,
                reverse: false,
                front: {
                    image: `./assets/chess/chess_plate.jpg`
                },
                back: {
                    image: `./assets/chess/chess_plate.jpg`
                },
                style: {}
            },
            x: 600,
            y: 400,
        }
    }
}