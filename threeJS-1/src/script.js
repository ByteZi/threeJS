import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import helvetica from "three/examples/fonts/helvetiker_regular.typeface.json"

import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import * as lil_gui from 'lil-gui'

//Matcap Materials
const mats = {
    matcap_1: new THREE.TextureLoader().load('/textures/matcaps/1.png'),
    matcap_2: new THREE.TextureLoader().load('/textures/matcaps/2.png'),
    matcap_3: new THREE.TextureLoader().load('/textures/matcaps/3.png'),
    matcap_4: new THREE.TextureLoader().load('/textures/matcaps/4.png'),
    matcap_5: new THREE.TextureLoader().load('/textures/matcaps/5png'),
    matcap_6: new THREE.TextureLoader().load('/textures/matcaps/6.png'),
    matcap_7: new THREE.TextureLoader().load('/textures/matcaps/7.png'),
    matcap_8: new THREE.TextureLoader().load('/textures/matcaps/8.png')
}

const gui = new lil_gui.GUI()

const textMesh = new THREE.Mesh()

const text = gui.addFolder('Text Properties')

// fonts
const fontLoader = new FontLoader()
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {
        const textGeometry = new TextGeometry(
            `Creative \n3D Web \nSpace `,
            {
                font,
                size: 0.4,
                height: 0.2,
                curveSegments: 3,
                bevelEnabled: true,
                bevelThickness: 0.1,
                bevelSize: 0.03,
                bevelOffset: 0,
                bevelSegments: 2
            }
        )
        //Center geometry
        textGeometry.center()

        const textMaterial = new THREE.MeshMatcapMaterial({ matcap: mats.matcap_3 })
        textMesh.material = textMaterial
        textMesh.geometry = textGeometry

        text.add(textMesh.material, 'matcap', mats).name('MatCap')
        // text.add(textMesh.rotation, 'x', 0, Math.PI, 0.1).name('Rotate X ')
        // text.add(textMesh.rotation, 'y', 0, Math.PI, 0.1).name('Rotate Y ')
        // text.add(textMesh.rotation, 'z', 0, Math.PI, 0.1).name('Rotate Z ')
        
        scene.add(textMesh)
    },
    (xhr) => {

    },
    (err) => {
        console.log(err);
    }
)



//Canvas
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({ canvas })
const scene = new THREE.Scene()
const sizes = {
    height: window.innerHeight,
    width: window.innerWidth
}

//Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3

gui.add(camera, 'fov').min(70).max(100).step(0.01).onChange((val)=> {
    camera.fov = val
    camera.updateProjectionMatrix()
})



//Mesh
// const boxMesh = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshMatcapMaterial()
// )

const diamonds = () => {
    const diamondGeom = new THREE.SphereGeometry(0.3, 0.3, 0.3)
    const diamondMat = new THREE.MeshMatcapMaterial({matcap : mats.matcap_3})
    const diamondGroup = new THREE.Group()

    for (let i = 0; i < 600; i++) {

        const rand = () => {
            return Math.ceil(Math.random() * 20) * (Math.round(Math.random()) ? 1 : -1)
        }


        const diamond = new THREE.Mesh(diamondGeom, diamondMat)
        diamond.position.set(rand(), rand(), rand())

        diamondGroup.add(diamond)
    }

    return diamondGroup
}
scene.add(diamonds())



//Window
window.addEventListener('resize', () => {

    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
})

const orbit = new OrbitControls(camera, canvas)
orbit.enableDamping = true
orbit.enableZoom = false

// let min = 100
// let max = 0


// Frames
// const clock = new THREE.Clock()
const tick = () => {

    for ( let m = 0 ; m < scene.children[0].children.length ; m++){
        if (scene.children[0].children[m].position.y < -20) scene.children[0].children[m].position.y = 20
        else scene.children[0].children[m].position.y -= 0.01
    }   

    // boxMesh.rotation.y = clock.getElapsedTime()
    // orbit.update()
    
    renderer.render(scene, camera)
    
    textMesh.lookAt(camera.position)

    window.requestAnimationFrame(tick)

}
tick()

scene.add(camera)
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

