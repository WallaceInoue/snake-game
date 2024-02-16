const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const audio = new Audio("../asset/audio.mp3")
const size = 30;
let snake = [
    {x:240, y:240},
    {x:270, y:240},
];
const score = document.querySelector(".score__value")
const finalScore = document.querySelector(".final-score > span")
const menu = document.querySelector(".menu-sceen")
const btn_play = document.querySelector(".btn-play")
let direction, loopId 


const gameover = () => {
    direction = undefined
    
    menu.style.display = "flex"
    finalScore.innerHTML = score.innerText
    canvas.style.filter = "blur(2px)"
}
const incrementScore = () => {
    score.innerHTML = +score.innerHTML + 10
}
const checkCollision = () => {
    const necksnake = snake.length - 2
    const head = snake[snake.length - 1]
    const canvasLimit = canvas.width - size
    const wallCollision =head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit;
    const selfcollision = snake.find((position, index) => {
        return index < necksnake && position.x == head.x && position.y == head.y 
    })

    if (wallCollision || selfcollision){
        gameover()
    }
}
const randomColor = () => {
    const red = randomNumber(0, 255)
    const green = randomNumber(0, 255)
    const blue = randomNumber(0, 255)

    return `rgb(${red}, ${green}, ${blue})`
}
const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}
const randomPosition= () => {
    const number = randomNumber(0, canvas.width - size)

    return Math.round(number / 30) * 30
}
const food = {
    x: randomPosition(0, 570),
    y: randomPosition(0, 570),
    color: randomColor()
}
const drawFood = () => {
    const {x, y, color} = food

    ctx.shadowColor = color
    ctx.shadowBlur = 5
    ctx.fillStyle = food.color
    ctx.fillRect(food.x, food.y, size, size)
    ctx.shadowBlur = 0
}
const drawSnake = () =>{
    ctx.fillStyle = "#fff";

    snake.forEach((position, index) => {
        if(index == snake.length - 1){
            ctx.fillStyle = "blue"
        }
        ctx.fillRect(position.x, position.y, size, size)
    })
}
const moveSnake = () => {
    const head = snake[snake.length - 1]
    if(!direction) return

    if(direction == "right"){
        snake.push({x: head.x + size, y:head.y})
    }
    if(direction == "left"){
        snake.push({x: head.x - size, y:head.y})
    }
    if(direction == "down"){
        snake.push({x: head.x , y:head.y + size})
    }
    if(direction == "up"){
        snake.push({x: head.x, y:head.y - size})
    }
    snake.shift()
}
const drawGrid = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = "rgba(93, 238, 238, 0.52)"
    
    for (let i = 30; i < canvas.width; i += 30){
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()
        
        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()
        
        
    }

    
}
const checkEat = () => {
    const head = snake[snake.length - 1]

    if(head.x == food.x && head.y == food.y){
        incrementScore()
        snake.push(head)
        audio.play()
        let x = randomPosition()
        let y = randomPosition()

        while(snake.find((position) => position.x == x && position.y == y)){
            x = randomPosition()
            y = randomPosition()
        }
        food.x = x
        food.y = y
        food.color = randomColor
    }
}
document.addEventListener("keydown", ({key}) => {
    if(key == "ArrowRight" && direction != "left"){
        direction = "right"
    }
    if(key == "ArrowLeft" && direction != "right"){
        direction = "left"
    }
    if(key == "ArrowDown" && direction != "up"){
        direction = "down"
    }
    if(key == "ArrowUp" && direction != "down"){
        direction = "up"
    }
})
btn_play.addEventListener("click", () => {
    score.innerHTML = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"
    snake = [
        {x:240, y:240},
        {x:270, y:240},
    ];
})
const gameLoop = () => {
    clearInterval(loopId)
    
    ctx.clearRect(0, 0, 600,600)
        
        drawGrid()
        drawFood()
        moveSnake()
        drawSnake()
        checkEat()
        checkCollision()
        loopId = setTimeout(() => {
            gameLoop()
        },300)
}
gameLoop()