import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import SceneInit from './lib/SceneInit';
import '../style2.css';

function Work() {
  const [showCollisionMessage, setShowCollisionMessage] = useState(false);
  const [loadedModels, setLoadedModels] = useState([]);
  const sceneInitRef = useRef(null);
  const controlsRef = useRef(null);
  const raycaster = new THREE.Raycaster();
  const cameraDirection = new THREE.Vector3();

  const loadModel = (model, test) => {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(model.path, (gltfScene) => {
      gltfScene.scene.position.copy(model.position);
      gltfScene.scene.scale.copy(model.scale);
      test.scene.add(gltfScene.scene);

      console.log(gltfScene.scene);

      setLoadedModels(prevModels => [...prevModels, gltfScene.scene]);
    }, undefined, (error) => {
      console.error('Erro ao carregar o modelo GLTF:', error);
    });
  };

  useEffect(() => {
    const test = new SceneInit('myThreeJsCanvas');
    sceneInitRef.current = test;
    test.initialize();

    const model = {
      path: './assets/models/celulaV4.glb',
      position: new THREE.Vector3(0, 0, 0),
      scale: new THREE.Vector3(10, 10, 10),
    };

    loadModel(model, test);

    const light = new THREE.AmbientLight(0xffffff, 0.5);
    test.scene.add(light);
    const light2 = new THREE.PointLight(0xffffff, 0.5);
    test.scene.add(light2);
    test.scene.fog = new THREE.Fog(0xffffff, 0, 100000);
    test.renderer.setClearColor(0x000000);

    test.camera.position.set(0, 10, 20);
    test.camera.lookAt(0, 0, 0);

    test.camera.aspect = window.innerWidth / window.innerHeight;
    test.camera.updateProjectionMatrix();
    test.renderer.setSize(window.innerWidth / 1.19, window.innerHeight / 1.19);

    const controls = new OrbitControls(test.camera, test.renderer.domElement);
    controlsRef.current = controls;
    controls.target.set(0, 0, 0);
    controls.update();

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      test.camera.aspect = width / height;
      test.camera.updateProjectionMatrix();
      test.renderer.setSize(width / 1.3, height / 1.3);
      controls.update();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      controls.dispose();
    };
  }, []);

  useEffect(() => {
    const test = sceneInitRef.current;
    const collisionDistance = 5;
    const moveSpeed = 0.05;

    const animateModels = () => {
      requestAnimationFrame(animateModels);

      test.camera.getWorldDirection(cameraDirection);
      raycaster.set(test.camera.position, cameraDirection);

      const intersects = raycaster.intersectObjects(test.scene.children, true);
      if (intersects.length > 0 && intersects[0].distance < collisionDistance) {
        test.camera.position.addScaledVector(cameraDirection, -moveSpeed);
        setShowCollisionMessage(true);
      } else {
        setShowCollisionMessage(false);
      }

      test.renderer.render(test.scene, test.camera);
    };

    animateModels();
  }, []);

  return (
    <div>
      <canvas id="myThreeJsCanvas" className="canvas" />
      <div id="collisionModal" className="modal2" style={{ display: showCollisionMessage ? 'block' : 'none' }}>
        <div className="modal-content">
          <p>Colisão detectada!</p>
        </div>
      </div>
    </div>
  );
  
}

export default Work;
