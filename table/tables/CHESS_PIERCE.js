module.exports = {
    primalName: "CHESS_PIERCE",
    getData() {
        var cls = ['king', 'queen', 'bishop', 'rook', 'nite', 'poon']
        var loop = [1, 1, 2, 2, 2, 8]
        var cardList = [];
        for (color of ['black', 'white']) {
            for (idx in loop) {
                for (var i = 0; i < loop[idx]; i++) {
                    cardList.push(
                        {
                            width: 80,
                            height: 80,
                            class: 'chess_pierce',
                            reverse: true,
                            front: {
                                image: `./assets/chess/${cls[idx]}_${color}.png`
                            },
                            back: {
                                image: `./assets/chess/${cls[idx]}_${color}.png`
                            },
                        },
                    )
                }
            }
        }
        return {
            option: {
                width: 80,
                height: 80,
                stack: cardList
            },
            x: 200,
            y: 200,
        }
    }
}