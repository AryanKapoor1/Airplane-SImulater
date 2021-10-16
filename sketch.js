var cloudimage;
var CloudGroup, FuelGroup, BirdsGroup, LifesaverGroup, InfinitefuelGroup, infinitefuelimage
var gamestate = 'play'
var fuelcount = 1000
var restartimage, restartsprite
var lifesaverTime = 'no time'
var powermode = false
var fuelmode = false
var fuelmodeTime = 'no time'

function preload(){
    cloud1image = loadImage("Cloud1.png")
    cloud2image = loadImage("Cloud2.png")
    cloud3image = loadImage("Cloud3.png")
    planeimage = loadImage("plane.png")
    Fuelimage = loadImage("Fuel.png")
    Leftbirdimage = loadAnimation('Leftbird/frame1.png','Leftbird/frame2.png')
    Rightbirdimage = loadAnimation('Rightbird/frame1.png','Rightbird/frame2.png')
    restartimage = loadImage('Restart.png')
    Crashimage = loadImage('Plane crash.png')
    Crashsound = loadSound('Crash Sound.mp3')
    Collectingsound = loadSound('Collecting sound.mp3')
    invincibilityimage = loadImage('invincibility.png')
    infinitefuelimage = loadImage('Infinite fuel.png')
}

function setup(){
    var canvas = createCanvas(displayWidth-150,displayHeight-180);
    plane = createSprite(displayWidth/2,displayHeight-250)
    plane.addImage("plane,",planeimage)
    plane.addImage('plane crash',Crashimage)
    plane.scale = 0.35
    CloudGroup = new Group()
    BirdsGroup = new Group()
    FuelGroup = new Group()
    LifesaverGroup = new Group()
    InfinitefuelGroup = new Group()
    restartsprite = createSprite(width/2,height/2)
    restartsprite.addImage('restart',restartimage)
    restartsprite.visible = false

}

function draw(){
    background(0,159,236);
if(gamestate === 'play'){
    planeControls()
    spawnClouds()
    spawnFuel()
    spawnBirds()
    fuelMoniter()
    invincibility()
    lifesaverMoniter()
    infiniteFuel()
    fuelmodeMoniter()

    if(plane.isTouching(BirdsGroup)&&powermode === false){
    gamestate = 'end'
    Crashsound.play()
    plane.changeImage('plane crash',Crashimage)
    }
    for(var i = 0;i<FuelGroup.length&&FuelGroup.length>0;i++){
        if(plane.isTouching(FuelGroup[i])){
            FuelGroup[i].destroy()
            Collectingsound.play()
            fuelcount = fuelcount + 600
            }
            

    }
    for(var i = 0;i<InfinitefuelGroup.length&&InfinitefuelGroup.length>0;i++){
        if(plane.isTouching(InfinitefuelGroup[i])){
            InfinitefuelGroup[i].destroy()
            Collectingsound.play()
            fuelmode = true
            fuelmodeTime = 1000

            }
            

    }
    for(var i = 0;i<LifesaverGroup.length&&LifesaverGroup.length>0;i++){
        if(plane.isTouching(LifesaverGroup[i])){
            LifesaverGroup[i].destroy()
            Collectingsound.play()
            powermode = true
            lifesaverTime = 1000
            }

    }
}
else if(gamestate === 'end'){

    restartsprite.visible = true
    CloudGroup.setVelocityYEach(0)
    FuelGroup.setVelocityYEach(0)
    BirdsGroup.setVelocityEach(0)
    CloudGroup.setDepthEach(0)
    if(mousePressedOver(restartsprite)){
    restart()
    }
}
 drawSprites()

 textSize(30)
 fill('black')
 stroke('blue')
 text('Fuelleft: '+fuelcount,100,100)
 text('lifesaverTime: '+lifesaverTime,1000,100)
 text('fuelmodeTime: '+fuelmodeTime,1000,150)
}




function planeControls(){

if(keyDown(LEFT_ARROW)){
    plane.x = plane.x-10
}
if(keyDown(RIGHT_ARROW)){
    plane.x = plane.x+10
}

}

function spawnClouds(){
if(World.frameCount%100===0){


var cloud = createSprite(random(0,displayWidth),0)
var cloudnumber = Math.round(random(1,3))
switch(cloudnumber){
case 1:cloud.addImage('cloud',cloud1image)
cloud.scale = 3.5
break;
case 2:cloud.addImage('cloud',cloud2image)
cloud.scale = 1.5
break;
case 3:cloud.addImage('cloud',cloud3image)
cloud.scale = 0.75
break;

}
//cloud.scale = 0.5
cloud.velocityY = 6
cloud.lifetime = 400
plane.depth = cloud.depth+1
CloudGroup.add(cloud)

}


}
function spawnFuel(){
    if(World.frameCount%300===0){
    
    
    var Fuel = createSprite(random(0,displayWidth),0)

   
    Fuel.addImage('Fuel',Fuelimage)

    Fuel.scale = 0.10
    Fuel.velocityY = 6
    Fuel.lifetime = 400
    plane.depth = Fuel.depth+1
    FuelGroup.add(Fuel)
    }
    
    }
function spawnBirds(){

    if(World.frameCount%200===0){


        var bird
        var birdnumber = Math.round(random(1,2))
        console.log(birdnumber)
        switch(birdnumber){
        case 1:bird = createSprite(displayWidth,random(0,20))
        bird.addAnimation('Leftbird',Leftbirdimage)
        bird.scale = 0.1
        bird.velocityX = random(-1,-4)
        bird.velocityY = random(1,4)
        break;
        case 2:bird = createSprite(0,random(0,20))
        bird.addAnimation('Rightbird',Rightbirdimage)
        bird.scale = 0.1
        bird.velocityX = random(1,4)
        bird.velocityY = random(1,4)
        break;
        
        
        }
        //cloud.scale = 0.5
        bird.lifetime = 400
        //plane.depth = cloud.depth+1
        BirdsGroup.add(bird)
    }
}

function fuelMoniter(){
if(!fuelmode){
 fuelcount = fuelcount-1
    if(fuelcount<=0){
    gamestate = 'end'
    }
}
   
}
function lifesaverMoniter(){

    if(lifesaverTime>0){
    lifesaverTime = lifesaverTime-1
    }
    else if(lifesaverTime === 0){

        powermode = false
    }
}
function fuelmodeMoniter(){

    if(fuelmodeTime>0){
    fuelmodeTime = fuelmodeTime-1
    }
    else if(fuelmodeTime === 0){

        fuelmode = false
    }
}
function restart(){

    restartsprite.visible = false
    CloudGroup.destroyEach()
    BirdsGroup.destroyEach()
    FuelGroup.destroyEach()
    fuelcount = 1000
    gamestate = 'play'
    plane.changeImage("plane,",planeimage)
}

function invincibility(){

    if(World.frameCount%2000===0){
    
    
        var lifesaver = createSprite(random(0,displayWidth),0)
    
       
        lifesaver.addImage('invincibility',invincibilityimage)
    
        lifesaver.scale = 0.35
        lifesaver.velocityY = 6
        lifesaver.lifetime = 1000
        lifesaver.depth = lifesaver.depth+1
        LifesaverGroup.add(lifesaver)
        }
        
}
function infiniteFuel(){

    if(World.frameCount%100===0){
    
    
        var unlimitedfuel = createSprite(random(0,displayWidth),0)
    
       
        unlimitedfuel.addImage('unlimited',infinitefuelimage)
    
        unlimitedfuel.scale = 0.15
        unlimitedfuel.velocityY = 6
        unlimitedfuel.lifetime = 1000
        unlimitedfuel.depth = unlimitedfuel.depth+1
        InfinitefuelGroup.add(unlimitedfuel)
        }
}
 