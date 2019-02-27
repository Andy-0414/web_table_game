module.exports = {
    primalName : "TRUMP_CARD",
    getData(){
        var cardList = [];
        for(shape of ['clubs','diamonds','hearts','spades']){
            for (num of ['ace',2,3,4,5,6,7,8,9,10,'jack','queen','king']){
                cardList.push(
                    {
                        width: 100,
                        height: 150,

                        class: 'card',
                        reverse: true,
                        front: {
                            image: `./assets/cards/${num}_of_${shape}.png`
                        },
                        style: {
                            backgroundColor: "white",
                            borderRadius: 5
                        }
                    },
                )
            }
        }
        return {
            option : {
                width: 100,
                height: 150,
                stack: cardList
            },
            x : 200,
            y : 200,
        }
    }
}