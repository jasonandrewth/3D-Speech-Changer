import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


const isChromium = window.chrome;
const winNav = window.navigator;
const vendorName = winNav.vendor;
const isOpera = typeof window.opr !== "undefined";
const isIEedge = winNav.userAgent.indexOf("Edge") > -1;
const isIOSChrome = winNav.userAgent.match("CriOS");

if (isIOSChrome) {
  console.log("ios chrome")
} else if(
 isChromium !== null &&
 typeof isChromium !== "undefined" &&
 vendorName === "Google Inc." &&
 isOpera === false &&
 isIEedge === false
) {
  console.log("chrome")
} else { 
  alert("PLEASE USE GOOGLE CHROME!");
  console.log("not chrome")
}


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: 0x444444,
    metalness: 0,
    roughness: 0.5
  })
)
floor.receiveShadow = true
floor.position.y = -1
floor.rotation.x = - Math.PI * 0.5
scene.add(floor) 

const addBox = function () {
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.4,
      roughness: 0.3
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.y = 0
    mesh.castShadow = true
    
    
    return mesh
}

const box = addBox()
// bottom.position.y = -200
scene.add(box)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//RESIZE
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize( sizes.width, sizes.height );
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(-2.5, 1.5, -2)
scene.add(camera)


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)

/**
 * Lighting
 */

const ambientLight = new THREE.AmbientLight(0x404040, 0.8)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = -7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = -7
directionalLight.position.set(5, 5, 5)

scene.add(directionalLight);
scene.add(ambientLight)
// scene.add( pointLightHelper );


//CONTROLS
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.minDistance = 2;
controls.maxDistance = 4;
controls.minPolarAngle = 0; // radians
controls.maxPolarAngle = Math.PI * 0.5; // radians



var clock = new THREE.Clock();

function render() {
        requestAnimationFrame(render);
        
        box.rotation.y -= clock.getDelta() * 0.6;
        camera.lookAt(scene.position)
        renderer.render(scene, camera);
}

render();



/**
 * Speech
 */

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var colors = [ 'aqua' , 'azure' , 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral', 'crimson', 'cyan', 'fuchsia', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'indigo', 'ivory', 'khaki', 'lavender', 'lime', 'linen', 'magenta', 'maroon', 'moccasin', 'navy', 'olive', 'orange', 'orchid', 'peru', 'pink', 'plum', 'purple', 'red', 'salmon', 'sienna', 'silver', 'snow', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'white', 'yellow'];
var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const diagnostic = document.querySelector('.output');
// var bg = document.querySelector('html');
const hints = document.querySelector('.hints');
const toggleTag = document.querySelector('.shower');
const listener = document.querySelector('.listen');

toggleTag.addEventListener("click", () => {
  hints.classList.toggle("show")
})
toggleTag.addEventListener("touchend", () => {
  hints.classList.toggle("show")
})

var colorHTML= '';
colors.forEach( v => {
  // console.log(v, i);
  colorHTML += '<span style="background-color:' + v + ';"> ' + v + ' </span>';
});
hints.innerHTML = 'Click the button, then name a color to change the cube. Try ' + colorHTML + '.';

listener.addEventListener("click", function(event) {
    recognition.start();
    console.log('Ready to receive a color command.');
    event.preventDefault
})

listener.addEventListener("touchend", function(event) {
  recognition.start();
  console.log('Ready to receive a color command.');
  event.preventDefault
})

recognition.onresult = function(event) {
  // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
  // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
  // It has a getter so it can be accessed like an array
  // The first [0] returns the SpeechRecognitionResult at the last position.
  // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
  // The second [0] returns the SpeechRecognitionAlternative at position 0.
  // Then return result as lowercase string
  var color = event.results[0][0].transcript.toLowerCase();
  diagnostic.textContent = 'Result received: ' + color + '.';
  // console.log(color)
  // bg.style.backgroundColor = color;
  const material = new THREE.MeshStandardMaterial({
    color: color,
    metalness: 0.4,
    roughness: 0.3
  })
  box.material = material
  // console.log('Confidence: ' + event.results[0][0].confidence);
}


recognition.onspeechend = function() {
  recognition.stop();
}

recognition.onnomatch = function(event) {
  diagnostic.textContent = "I didn't recognise that color.";
}

recognition.onerror = function(event) {
  diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
}
