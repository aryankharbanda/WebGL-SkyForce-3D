var scene = new THREE.Scene();
scene.background = new THREE.Color('skyblue');

var camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
// const camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000 );
camera.position.z = 5;

var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setClearColor("#e5e5e5");
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth,window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();
})

addlighting = () => {
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.9 );
    scene.add( directionalLight );

    const directionalLight2 = new THREE.DirectionalLight( 0xffffff, 0.9 );
    directionalLight2.position.set(0,-10,0);
    scene.add( directionalLight2 );

    var light = new THREE.PointLight(0xFFFFFF, 1, 1000)
    light.position.set(0,0,7);
    scene.add(light);

    const light2 = new THREE.AmbientLight(0x404040, 1); // soft white light
    scene.add( light2 );
}

class Player{
    constructor(position){
        let promise = loadModel('models/plane/scene.gltf').then((res) => this.model = res.scene);
        Promise.all([promise]).then(() => {
            
            scene.add(this.model)
            
            this.model.position.set(position.x , position.y , position.z)
            this.model.rotation.set(Math.PI/2 , Math.PI , 0)
            // this.model.scale.set(0.4 , 0.4 , 0.4)
            this.width = 1.4
            this.height = 1.2
            this.boundingbox = {
                x: this.model.position.x,
                y: this.model.position.y,
                width: this.width,
                height: this.height
            }
            // this.fastSpeed = 1
            this.speed = 0.3
            this.visible = true
            this.score = 0
            this.health = 100
        })
    }
    moveup = () => {
        // plane.model.position.y += 0.1;
        // console.log(plane.model.position.y)
        var newy = this.model.position.y + this.speed
        // tl = new TimelineMax().delay(.3);
        var tl = new TimelineMax();
        tl.to(this.model.position, 1, {y: newy, ease: Expo.easeOut})
    }

    movedown = () => {
        var newy = this.model.position.y - this.speed
        var tl = new TimelineMax();
        tl.to(this.model.position, 1, {y: newy, ease: Expo.easeOut})
    }

    moveleft = () => {
        var newx = this.model.position.x - this.speed
        var tl = new TimelineMax();
        tl.to(this.model.position, 1, {x: newx, ease: Expo.easeOut})
    }

    moveright = () => {
        var newx = this.model.position.x + this.speed
        var tl = new TimelineMax();
        tl.to(this.model.position, 1, {x: newx, ease: Expo.easeOut})
    }

    update_bb = () => {
        this.boundingbox.x = this.model.position.x
        this.boundingbox.y = this.model.position.y
        // console.log(this.boundingbox)
    }
}

loadModel = (file) => {
    return new Promise(resolve => {
        return new THREE.GLTFLoader().load(file , resolve);
    })
}


// // const loader = new GLTFLoader();
// const loader = new THREE.GLTFLoader();
// var star;
// loader.load( 'models/star/scene.gltf', (loadedgltf) => {
    
//     star = loadedgltf.scene;
//     // star2 = loadedgltf.scene;
//     // star.position.set(0,1,2);
//     star.scale.set(0.005,0.005,0.005);
//     star.rotation.y = Math.PI;
//     // star.rotation.x = Math.PI/2;
//     // star.rotation.x = 0.7;
//     // star.rotation.z = Math.PI/4;
//     // console.log(Math.PI)
//     scene.add(star);
//     // scene.add(star2);

// }, undefined, ( error ) => {

//     console.error( error );

// } );

class Enemy{
    constructor(position){
        let promise = loadModel('models/enemy/scene.gltf').then((res) => this.model = res.scene);
        Promise.all([promise]).then(() => {
            
            scene.add(this.model)
            
            this.model.position.set(position.x , position.y , position.z)
            // missile.position.set(0,1,0);
            this.ogX = position.x;
            this.model.scale.set(0.06,0.06,0.06);
            this.model.rotation.x = Math.PI/2;
            // this.model.rotation.z = 0.6;
            
            this.width = 1.1
            this.height = 0.93
            this.boundingbox = {
                x: this.model.position.x,
                y: this.model.position.y,
                width: this.width,
                height: this.height
            }
            this.visible = true
            this.xspeed = 0.4 
            // console.log(this.boundingbox)
        })

    }

    move = () => {
        this.model.position.y -= 0.01
    }

    remove = () => {
        if(this.visible){
            if(this.model.position.y<-5){
                scene.remove(this.model)
                this.visible = false
            }
        }
    }

    checkcoll = (playa) => {
        if(this.visible){
            if(detect_collision(this.boundingbox,playa.boundingbox)){
                // playa.delete()
                this.delete()
                playa.health -= 30
                // console.log("col")
            }
        }
        
    }

    delete = () => {
        scene.remove(this.model)
        this.visible = false
    }
    update_bb = () => {
        this.boundingbox.x = this.model.position.x;
        this.boundingbox.y = this.model.position.y
        // console.log(this.boundingbox)
    }

    animate = () => {
        if(this.visible){
            var tl = new TimelineMax();
            tl.to(this.model.position, 1, {x: this.ogX-this.xspeed, ease: Expo.easeOut})
            tl.to(this.model.position, 1, {x: this.ogX, ease: Expo.easeOut})
            // bullets.push(new Bullet(new THREE.Vector3( this.model.position.x, this.model.position.y-1, this.model.position.z )))
            tl.to(this.model.position, 1, {x: this.ogX+this.xspeed, ease: Expo.easeOut})
            // bullets.push(new Bullet(new THREE.Vector3( this.model.position.x, this.model.position.y-1, this.model.position.z )))
            tl.to(this.model.position, 1, {x: this.ogX, ease: Expo.easeOut})
            if(this.model.position.y < 4.3){
                bullets.push(new Bullet(new THREE.Vector3( this.model.position.x, this.model.position.y-1, this.model.position.z )))
            }
        }
    }

}

class Missile{
    constructor(position){
        let promise = loadModel('models/missile2/scene.gltf').then((res) => this.model = res.scene);
        Promise.all([promise]).then(() => {
            
            scene.add(this.model)
            
            this.model.position.set(position.x , position.y , position.z)
            // missile.position.set(0,1,0);
            this.model.scale.set(0.0025,0.0025,0.001);
            this.model.rotation.x = Math.PI/2;
            
            this.width = 0.16
            this.height = 0.33
            this.boundingbox = {
                x: this.model.position.x,
                y: this.model.position.y,
                width: this.width,
                height: this.height
            }
            this.visible = true
            this.yspeed = 0.05

        })
    }

    move = () => {
        this.model.position.y += this.yspeed;
        // console.log(this.model.position.y)
    }

    remove = () => {
        if(this.visible){
            if(this.model.position.y<-5){
                scene.remove(this.model)
                this.visible = false
            }
        }
    }

    checkcoll = (plane,enemyy) => {
        if(enemyy.visible && this.visible){
            if(detect_collision(this.boundingbox,enemyy.boundingbox)){
                enemyy.delete()
                this.delete()
                plane.score+= 10
                // console.log("col")
            }
        }
        
    }

    update_bb = () => {
        this.boundingbox.x = this.model.position.x
        this.boundingbox.y = this.model.position.y
        // console.log(this.boundingbox)
    }

    delete = () => {
        scene.remove(this.model)
        this.visible = false
    }

}

class Bullet{
    constructor(position){
        let promise = loadModel('models/bullet2/scene.gltf').then((res) => this.model = res.scene);
        Promise.all([promise]).then(() => {
            
            scene.add(this.model)
            
            this.model.position.set(position.x , position.y , position.z)
            // missile.position.set(0,1,0);
            this.model.scale.set(0.1,0.1,0.1);
            this.model.rotation.x = Math.PI;
            // this.model.rotation.y = Math.PI/2;
            // this.model.rotation.z = Math.PI/2;
            
            this.width = 0.12
            this.height = 0.2
            this.boundingbox = {
                x: this.model.position.x,
                y: this.model.position.y,
                width: this.width,
                height: this.height
            }
            this.visible = true
            this.yspeed = 0.05

        })
    }

    move = () => {
        // console.log(this.model.position)
        this.model.position.y += -this.yspeed;
        // console.log(this.model.position.y)
    }

    checkcoll = (playa) => {
        if(this.visible){
            if(detect_collision(this.boundingbox,playa.boundingbox)){
                // playa.delete()
                this.delete()
                playa.health -= 10
                // console.log("col")
            }
        }
        
    }

    update_bb = () => {
        this.boundingbox.x = this.model.position.x
        this.boundingbox.y = this.model.position.y
        // console.log(this.boundingbox)
    }

    delete = () => {
        scene.remove(this.model)
        this.visible = false
    }

}

class Star{
    constructor(position){
        let promise = loadModel('models/star/scene.gltf').then((res) => this.model = res.scene);
        Promise.all([promise]).then(() => {
            
            scene.add(this.model)
            
            this.model.position.set(position.x , position.y , position.z)
            this.model.scale.set(0.005,0.005,0.005);
            // this.model.rotation.x = Math.PI/2;
            // this.model.rotation.z = .2;
            
            this.width = 0.46
            this.height = 0.37
            this.boundingbox = {
                x: this.model.position.x,
                y: this.model.position.y+0.15,
                width: this.width,
                height: this.height
            }
            this.visible = true
            // console.log(this.boundingbox)
        })

    }

    checkcoll = (playa) => {
        if(this.visible){
            if(detect_collision(this.boundingbox,playa.boundingbox)){
                // playa.delete()
                this.delete()
                // console.log("col")
                playa.score += 20
            }
        }
    }

    move = () => {
        this.model.position.y -= 0.015
    }

    remove = () => {
        if(this.visible){
            if(this.model.position.y<-5){
                scene.remove(this.model)
                this.visible = false
            }
        }
    }

    delete = () => {
        scene.remove(this.model)
        this.visible = false
    }
    update_bb = () => {
        this.boundingbox.x = this.model.position.x;
        this.boundingbox.y = this.model.position.y+0.15
        // console.log(this.boundingbox)
    }

    animate = () => {
        if(this.visible){
            var tl = new TimelineMax();
            tl.to(this.model.rotation, 1, {z: -0.2, ease: Expo.easeOut})
            tl.to(this.model.rotation, 1, {z: 0.2, ease: Expo.easeOut})
        }
        
    }

}

detect_collision = (bba, bbb) => {
    // console.log('det')
    var bool1 = Boolean(Math.abs(bba.x - bbb.x) * 2 < (bba.width + bbb.width))
    var bool2 = Boolean(Math.abs(bba.y - bbb.y) * 2 < (bba.height + bbb.height))
    // console.log(bool1,bool2)
    return Boolean(bool1 && bool2)
}

let mesh
testMesh = () => {
    var geometry = new THREE.BoxGeometry(1, 1, 1)
    var material = new THREE.MeshLambertMaterial({color: 0xFFCC00})
    mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(0,0,0.4)
    mesh.scale.set(0.1,0.1,0.1)
    // mesh.rotation.set(40,0,0)
    scene.add(mesh)
}

// testMesh();
addlighting();

var missiles = [];
var bullets = [];
var stars = [];
var enemies = [];

var plane = new Player(new THREE.Vector3( 0, -1.5, 0 ))
// var enemy = new Enemy(new THREE.Vector3( 0, 2, 0 ))

for(var k=0;k<20;k++){
    if(k%3==0){
        enemies.push(new Enemy(new THREE.Vector3( 0, 6.3+2*k, 0 )))
    }
    if(k%3==1){
        enemies.push(new Enemy(new THREE.Vector3( -3, 6.3+2*k, 0 )))
    }
    if(k%3==2){
        enemies.push(new Enemy(new THREE.Vector3( 3, 6.3+2*k, 0 )))
    }

}
// for(var k =0;k<20;k++){
//     enemies.push(new Enemy(new THREE.Vector3(0, 6.3+ 2*k, 0 )))
// }
// enemies.push(new Enemy(new THREE.Vector3( 0, 6.3, 0 )))
// enemies.push(new Enemy(new THREE.Vector3( -3, 8.3, 0 )))
// enemies.push(new Enemy(new THREE.Vector3( 0, 10.3, 0 )))
// enemies.push(new Enemy(new THREE.Vector3( 3, 12.3, 0 )))
// enemies.push(new Enemy(new THREE.Vector3( 0, 14.3, 0 )))
// enemies.push(new Enemy(new THREE.Vector3( -3, 16.3, 0 )))
// enemies.push(new Enemy(new THREE.Vector3( 0, 18.3, 0 )))
// enemies.push(new Enemy(new THREE.Vector3( 3, 20.3, 0 )))
// enemies.push(new Enemy(new THREE.Vector3( 0, 22.3, 0 )))
// var missile = new Missile(new THREE.Vector3( 0, 0, 0 ))
for(var k=0;k<40;k++){
    if(k%2==1){
        stars.push(new Star(new THREE.Vector3( 1.5, 4.3+k, 0 )))
        stars.push(new Star(new THREE.Vector3( 4.5, 4.3+k, 0 )))

    }
    else{
        stars.push(new Star(new THREE.Vector3( -1.5, 4.3+k, 0 )))
        stars.push(new Star(new THREE.Vector3( -4.5, 4.3+k, 0 )))
    }
}
// stars.push(new Star(new THREE.Vector3( 1.5, 4.3, 0 )))
// stars.push(new Star(new THREE.Vector3( -1.5, 4.3, 0 )))
// stars.push(new Star(new THREE.Vector3( 1.5, 5.3, 0 )))
// stars.push(new Star(new THREE.Vector3( -1.5, 5.3, 0 )))

// var bullet = new Bullet(new THREE.Vector3( 0, 0, 0 ))
// star.animate()
// var missile = new Missile(new THREE.Vector3( 0, 0, 0 ))

for(var i=0; i<stars.length; i++){
    setInterval(stars[i].animate, 2000)
}
for(var i=0; i<enemies.length; i++){
    setInterval(enemies[i].animate, 4000)
}


document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 87) { //W
        // // console.log(plane.model.position.y)
        // var newy = plane.model.position.y + 0.3
        // // tl = new TimelineMax().delay(.3);
        // tl = new TimelineMax();
        // tl.to(plane.model.position, 1, {y: newy, ease: Expo.easeOut})
        // mesh.position.y += 0.05;
        plane.moveup()
    } 
    else if (keyCode == 83) { //A
        // mesh.position.y += -0.05;
        plane.movedown()
    } 
    else if (keyCode == 65) { //S
        // mesh.position.x += -0.05;
        plane.moveleft()
    } 
    else if (keyCode == 68) { //D
        // mesh.position.x += 0.05;
        plane.moveright()
    } 
    else if (keyCode == 32) { //space
        // plane.model.position.set(0, 0, 0);
        // scene.add(missile);
        missiles.push(new Missile(new THREE.Vector3( plane.model.position.x, plane.model.position.y+1, plane.model.position.z )))
        // console.log(missiles)
        star.animate()

    }
};

updateHUD = () => {
    document.getElementById("scorr").innerHTML = 'Score: '+ String(plane.score);
    document.getElementById("helth").innerHTML = 'Heath: '+ String(plane.health);
}

var render = () => {
    requestAnimationFrame(render);

    for(var i=0; i<enemies.length; i++){
        enemies[i].model.rotation.z += 0.1;
        enemies[i].update_bb()
        enemies[i].move()
        enemies[i].remove()
        enemies[i].checkcoll(plane);
        // console.log(enemies[i].model.position)
    }
    
    // camera.position.y += 0.01;
    // plane.position.y += 0.01;

    // console.log(mesh.position)
    updateHUD();
    

    for(var i=0; i<missiles.length; i++){
        missiles[i].move()
        missiles[i].remove()
        missiles[i].update_bb()
        for(var j=0; j<enemies.length; j++){
            missiles[i].checkcoll(plane,enemies[j]);
        }
        // console.log(this.missiles[0].position.y)
        // console.log(missiles[0].boundingbox)
    }
    for(var i=0; i<bullets.length; i++){
        bullets[i].move()
        bullets[i].update_bb()
        bullets[i].checkcoll(plane);
    }
    for(var i=0; i<stars.length; i++){
        stars[i].update_bb()
        stars[i].remove()
        stars[i].checkcoll(plane)
        stars[i].move()
    }
    plane.update_bb()
    renderer.render(scene, camera);
}

render();