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
                    image: `./assets/chess/chess_plate.png`
                },
                back: {
                    image: `./assets/chess/chess_plate.png`
                },
            },
            x: 600,
            y: 400,
        }
    }
}