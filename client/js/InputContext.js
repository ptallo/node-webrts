

class InputContext {
    moveObjects(selectedGameObjects, game, mouseDown){
        socket.emit('move object',
            JSON.stringify(selectedGameObjects),
            JSON.stringify(game),
            JSON.stringify(mouseDown)
        );
        
        game.moveObjects(
            selectedGameObjects,
            mouseDown.x,
            mouseDown.y
        );
    }
}

module.exports = InputContext;