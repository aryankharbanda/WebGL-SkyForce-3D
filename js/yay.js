var scene = new THREE.Scene();
scene.background = new THREE.Color('red');

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
            this.visible = false
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

        })
    }

    move = () => {
        this.model.position.y += 0.1;
        // console.log(this.model.position.y)
    }

    checkcoll = (enemyy) => {
        if(detect_collision(this.boundingbox,enemyy.boundingbox)){
            enemyy.delete()
            this.delete()
            // console.log("col")
        }
    }

    update_bb = () => {
        this.boundingbox.x = this.model.position.x
        this.boundingbox.y = this.model.position.y
        // console.log(this.boundingbox)
    }

    delete = () => {
        scene.remove(this.model)
    }

}

class Enemy{
    constructor(position){
        let promise = loadModel('models/enemy/scene.gltf').then((res) => this.model = res.scene);
        Promise.all([promise]).then(() => {
            
            scene.add(this.model)
            
            this.model.position.set(position.x , position.y , position.z)
            // missile.position.set(0,1,0);
            this.model.scale.set(0.06,0.06,0.06);
            this.model.rotation.x = Math.PI/2;
            
            this.width = 1.1
            this.height = 0.93
            this.boundingbox = {
                x: this.model.position.x,
                y: this.model.position.y,
                width: this.width,
                height: this.height
            }
            // console.log(this.boundingbox)
        })

    }

    delete = () => {
        scene.remove(this.model)
    }
    update_bb = () => {
        this.boundingbox.x = this.model.position.x;
        this.boundingbox.y = this.model.position.y
        // console.log(this.boundingbox)
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
            
            this.width = 0.46
            this.height = 0.37
            this.boundingbox = {
                x: this.model.position.x,
                y: this.model.position.y+0.15,
                width: this.width,
                height: this.height
            }
            // console.log(this.boundingbox)
        })

    }

    checkcoll = (playa) => {
        if(detect_collision(this.boundingbox,playa.boundingbox)){
            // playa.delete()
            this.delete()
            // console.log("col")
        }
    }

    delete = () => {
        scene.remove(this.model)
    }
    update_bb = () => {
        this.boundingbox.x = this.model.position.x;
        this.boundingbox.y = this.model.position.y+0.15
        // console.log(this.boundingbox)
    }

}

detect_collision = (bba, bbb) => {
    // console.log('det')
    var bool1 = Boolean(Math.abs(bba.x - bbb.x) * 2 < (bba.width + bbb.width))
    var bool2 = Boolean(Math.abs(bba.y - bbb.y) * 2 < (bba.height + bbb.height))
    // console.log(bool1,bool2)
    return Boolean(bool1 && bool2)
}

var plane = new Player(new THREE.Vector3( 0, 0, 0 ))
var enemy = new Enemy(new THREE.Vector3( 0, 2, 0 ))
var star = new Star(new THREE.Vector3( 2, 2, 0 ))
// var star = new Star(new THREE.Vector3( 0, 0, 0 ))
// var missile = new Missile(new THREE.Vector3( 0, 0, 0 ))


var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshLambertMaterial({color: 0xFFCC00});
var mesh = new THREE.Mesh(geometry, material);
mesh.position.set(0,0,0.4);
mesh.scale.set(0.1,0.1,0.1);
// mesh.rotation.set(40,0,0);
scene.add(mesh);

addlighting();

var missiles = [];

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
    }
};


var render = () => {
    requestAnimationFrame(render);
    // console.log(plane.model)

    // mesh.rotation.x += 0.1;
    // mesh.rotation.y += 0.1;

    // plane.rotation.x += 0.1;
    // if(missile.scale.x > 0.1){
    //     missile.scale.x -= 0.01;
    // }
    
    // camera.position.y += 0.01;
    // plane.position.y += 0.01;

    // console.log(mesh.position)

    for(var i=0; i<missiles.length; i++){
        missiles[i].move()
        missiles[i].update_bb()
        missiles[i].checkcoll(enemy);
        // console.log(this.missiles[0].position.y)
        // console.log(missiles[0].boundingbox)
    }
    star.checkcoll(plane)
    enemy.update_bb()
    plane.update_bb()
    star.update_bb()
    renderer.render(scene, camera);
}

render();

// this.tl = new TimelineMax().delay(.3);
// console.log(plane)
// console.log(this.plane)
// console.log(mesh)
// console.log(this.mesh)
// this.tl.to(this.mesh.position, 1, {x: 2, ease: Expo.easeOut})
