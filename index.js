const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
    position: {
        x:0,
        y:0
    },
    imageSrc: './img/background.png'
})

const shop = new Sprite({
    position: {
        x:600,
        y:128
    },
    imageSrc: './img/shop.png',
    scale: 2.75,
    framesMax: 6
})
 
const player = new Fighter({
    position: {
     x:0,
     y:0
    },

    velocity : {
        x:0,
        y:10
    },

    offset:{
        x:0,
        y: 0
    },

    imageSrc: './img/Wizard/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset : {
        x:275,
        y:263
    },
    sprites:{
        idle: {
            imageSrc: './img/Wizard/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './img/Wizard/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './img/Wizard/Jump.png',
            framesMax: 2,

        },
        fall: {
            imageSrc: './img/Wizard/Fall.png',
            framesMax: 2,
        }
        ,
        attack1: {
            imageSrc: './img/Wizard/Attack1.png',
            framesMax: 8,
        },
        takeHit: {
            imageSrc: './img/Wizard/Take hit.png',
            framesMax: 3,
        },
        death: {
            imageSrc: './img/Wizard/Death.png',
            framesMax: 7,
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 168,
        height: 50
    }
})

const enemy = new Fighter({
    position: {
     x:400,
     y:100
    },
    velocity : {
        x:0,
        y:0
    }, 
    color: 'yellow',
    offset: {
        x: -50,
        y:0
    },
    imageSrc: './img/Kumogi/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset : {
        x:275,
        y:167
    },
    sprites:{
        idle: {
            imageSrc: './img/Kumogi/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './img/Kumogi/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './img/Kumogi/Jump.png',
            framesMax: 2,

        },
        fall: {
            imageSrc: './img/Kumogi/Fall.png',
            framesMax: 2,
        }
        ,
        attack1: {
            imageSrc: './img/Kumogi/Attack1.png',
            framesMax: 4,
        },
        takeHit: {
            imageSrc: './img/Kumogi/Take hit.png',
            framesMax: 3,
        },
        death: {
            imageSrc: './img/Kumogi/Death.png',
            framesMax: 7,
        }

    },
    attackBox: {
        offset: {
            x: -230,
            y: 50
        },
        width: 170,
        height: 50
    }
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },    
}

decreaseTimer();

function animate(){
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update();
    shop.update();
    c.fillStyle = 'rgba(255, 255, 255,0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    //player movement
  
    if(keys.a.pressed && player.lastkey === 'a'){
        player.velocity.x = -5;
        player.switchSprite('run');
    }else if(keys.d.pressed && player.lastkey === 'd'){
        player.velocity.x = 5;
        player.switchSprite('run');
    }else{
        player.switchSprite('idle');
    }

    //jumping
    if(player.velocity.y < 0){
      player.switchSprite('jump');
    }else if(player.velocity.y > 0){
        player.switchSprite('fall')
    }

     //Enemy movement
     if(keys.ArrowLeft.pressed && enemy.lastkey === 'ArrowLeft'){
        enemy.velocity.x = -5;
        enemy.switchSprite('run');
    }else if(keys.ArrowRight.pressed && enemy.lastkey === 'ArrowRight'){
        enemy.velocity.x = 5;
        enemy.switchSprite('run');
    }else{
        enemy.switchSprite('idle');
    }

     //jumping
     if(enemy.velocity.y < 0){
        enemy.switchSprite('jump');
      }else if(enemy.velocity.y > 0){
        enemy.switchSprite('fall')
      }


    //detect  for player 1 Collision & enemy get hit
    if(rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
    }) &&
        player.isAttacking && player.framesCurrent === 5
        ){
            enemy.takeHit();
            player.isAttacking = false;
           
        document.querySelector('#enemyHealth').style.width = enemy.health + '%';
    
    }
    //if player misses
    if(player.isAttacking && player.framesCurrent == 5){
        player.isAttacking = false;
    }
    
       //detect  for player 2 Collision and player 1 gets hit
    if(rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
    }) &&
        enemy.isAttacking && enemy.framesCurrent === 2
        ){
            player.takeHit();
            enemy.isAttacking = false;
        document.querySelector('#PlayerHealth').style.width = player.health + '%';
    }

    //if enemy is misses
    if(enemy.isAttacking && enemy.framesCurrent == 2){
        enemy.isAttacking = false;
    }

    //end Game based on health
    if(enemy.health <= 0 || player.health <= 0){
        determineWinner({player, enemy, timerId});
    }
}

animate();

window.addEventListener('keydown', (event) => {

    if(!player.dead){
    switch (event.key){
        case 'd': 
        keys.d.pressed = true;
        player.lastkey = 'd'
        break;
        case 'a': 
        keys.a.pressed = true;
        player.lastkey = 'a'
        break;
        case 'w': 
        player.velocity.y = -20
        break;
        case ' ': 
        player.attack()
        break;
    }

}   
    if(!enemy.dead){
    switch(event.key){
        case 'ArrowRight': 
        keys.ArrowRight.pressed = true;
        enemy.lastkey = 'ArrowRight'
        break;
        case 'ArrowLeft': 
        keys.ArrowLeft.pressed = true;
        enemy.lastkey = 'ArrowLeft'
        break;
        case 'ArrowUp': 
        enemy.velocity.y = -20
        break;
        case 'ArrowDown': 
        enemy.attack(); 
        break;  
    }
}
});

window.addEventListener('keyup', (event) => {
    switch (event.key){
        case 'd': 
        keys.d.pressed = false;
        break;
        case 'a': 
        keys.a.pressed = false;
        break;    
    }
    //enemy keys
    switch (event.key){
        case 'ArrowRight': 
        keys.ArrowRight.pressed = false;
        break;
        case 'ArrowLeft': 
        keys.ArrowLeft.pressed = false;
        break;
        
    }
});