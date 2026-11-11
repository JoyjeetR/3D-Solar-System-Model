import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

const stars = new URL('./img/stars.jpg', import.meta.url);
const sunTexture = new URL('./img/sun.jpg', import.meta.url)
const mercuryTexture = new URL('./img/mercury.jpg', import.meta.url)
const venusTexture = new URL('./img/venus.jpg', import.meta.url)
const earthTexture = new URL('./img/earth.jpg', import.meta.url)
const marsTexture = new URL('./img/mars.jpg', import.meta.url)
const jupiterTexture = new URL('./img/jupiter.jpg', import.meta.url)
const saturnTexture = new URL('./img/saturn.jpg', import.meta.url)
const saturnRingTexture = new URL('./img/saturn_ring.png', import.meta.url)
const neptuneTexture = new URL('./img/neptune.jpg', import.meta.url)
const uranusTexture = new URL('./img/uranus.jpg', import.meta.url)



const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true
document.body.appendChild(renderer.domElement);


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
)
camera.position.set(300, 100, 400);
const textureLoader = new THREE.TextureLoader()



// ambient Light
const ambientLight = new THREE.AmbientLight("#383636", .01);
scene.add(ambientLight)

// -------------------------------------  Point Light  -------------------------------------
const pointLight = new THREE.PointLight('#fff', 100000, 1000)
scene.add(pointLight)


// -------------------------------------  Creating a solar System group for scaling   -------------------------------------
const solarSystem =  new THREE.Group();
scene.add(solarSystem);


// -------------------------------------  Center of the Solar System "Sun"  -------------------------------------
const SunTextureColored = textureLoader.load(sunTexture);
SunTextureColored.colorSpace = THREE.SRGBColorSpace;
const sunGeo = new THREE.SphereGeometry(25, 40, 40);
const sunMat = new THREE.MeshBasicMaterial({
      map: SunTextureColored
})
const sun = new THREE.Mesh(sunGeo, sunMat);
solarSystem.add(sun)

function AddPlanet(size, planetTexture, position) {
      const texture = textureLoader.load(planetTexture);
      texture.colorSpace = THREE.SRGBColorSpace;
      const Obj = new THREE.Object3D()
      const planetGeo = new THREE.SphereGeometry(size, 20, 20);
      const planetMat = new THREE.MeshStandardMaterial({
            map: texture
      })
      const mesh = new THREE.Mesh(planetGeo, planetMat);
      solarSystem.add(Obj)
      Obj.add(mesh)
      mesh.position.x = position;

      return { mesh: mesh, Obj: Obj }
}

function RotateMeshAndObject(mesh, obj, meshRotation, objRotation){
      mesh.rotateY(meshRotation * animationOptions.speed);
      obj.rotateY(objRotation * animationOptions.speed);
}
// -------------------------------------  "Mercury"  -------------------------------------
const mercury = AddPlanet(3.8, mercuryTexture, 50)
// -------------------------------------  "Venus"  -------------------------------------
const venus = AddPlanet(9.5, venusTexture, 80)
// -------------------------------------  "Earth"  -------------------------------------
const earth = AddPlanet(10, earthTexture, 130)
// -------------------------------------  "Mars"  -------------------------------------
const mars = AddPlanet(5.3, marsTexture, 180)
// -------------------------------------  "Jupiter"  -------------------------------------
const jupiter = AddPlanet(25, jupiterTexture, 260)
// -------------------------------------  "Saturn"  -------------------------------------
const saturn = AddPlanet(10, saturnTexture, 320)
// -------------------------------------  "Neptune"  -------------------------------------
const uranus = AddPlanet(18, uranusTexture, 380)
// -------------------------------------  "Neptune"  -------------------------------------
const neptune = AddPlanet(17, neptuneTexture, 440)


// -------------------------------------  "Saturn"  -------------------------------------
const saturnRingTextureColoured = textureLoader.load(saturnRingTexture);
saturnRingTextureColoured.colorSpace = THREE.SRGBColorSpace;
const saturnRingsGeo = new THREE.RingGeometry(15, 20, 32);
const saturnRingsMat = new THREE.MeshBasicMaterial({
      map: saturnRingTextureColoured,
      side: THREE.DoubleSide
})
const saturnRings = new THREE.Mesh(saturnRingsGeo, saturnRingsMat);
saturn.Obj.add(saturnRings);
saturnRings.position.x = 320
saturnRings.rotation.x = -0.5 * Math.PI



const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

// Star background
const cubeTextureLoader = new THREE.CubeTextureLoader();
const backgroundTexture = cubeTextureLoader.load([
      stars,
      stars,
      stars,
      stars,
      stars,
      stars,
])
backgroundTexture.colorSpace = THREE.SRGBColorSpace;
scene.background = backgroundTexture;


// -------------------------------------  GUI For Scaling the project  -------------------------------------
const gui =  new dat.GUI();
const options = {
      scaleValue : 1,
      Brightness : 1
}
gui.add(options,'Brightness',1,25)

gui.add(options,'scaleValue',0.1,5).onChange((value)=>{
      solarSystem.scale.setScalar(value)
})
const animationOptions = {
      speed :1,
      pause : false
}
const animationFolder = gui.addFolder('Animation');
animationFolder.add(animationOptions,'speed', 0, 10)
animationFolder.add(animationOptions,'pause')



function animate(time) {

      if(!animationOptions.pause){

            sun.rotateY(0.004 * animationOptions.speed);
      
            RotateMeshAndObject(mercury.mesh, mercury.Obj, 0.004, 0.04)
            RotateMeshAndObject(venus.mesh, venus.Obj, 0.002, 0.015)
            RotateMeshAndObject(earth.mesh, earth.Obj, 0.02, 0.01)
            RotateMeshAndObject(mars.mesh, mars.Obj, 0.018, 0.008)
            RotateMeshAndObject(jupiter.mesh, jupiter.Obj, 0.04, 0.002)
            RotateMeshAndObject(saturn.mesh, saturn.Obj, 0.038, 0.0009)
            RotateMeshAndObject(uranus.mesh, uranus.Obj, 0.03, 0.0004)
            RotateMeshAndObject(neptune.mesh, neptune.Obj, 0.032, 0.0002)

      }
      ambientLight.intensity = options.Brightness


      renderer.render(scene, camera);
      window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight)
      })
}
renderer.setAnimationLoop(animate)