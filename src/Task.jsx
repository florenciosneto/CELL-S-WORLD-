import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import SceneInit from './lib/SceneInit';
import '../style2.css';

function Task() {
  const [loadedModels, setLoadedModels] = useState([]);
  const [mixers, setMixers] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showDenaturationMessage, setShowDenaturationMessage] = useState(false);
  const [showCollisionMessage, setShowCollisionMessage] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  const [partInfo, setPartInfo] = useState('');
  const sceneInitRef = useRef(null);
  const [ph, setPh] = useState(7); 
  const [temperature, setTemperature] = useState(30);
  const [exibir, setExibir] = useState('ph'); 
  const animationDurationRef = useRef(0);
  const raycaster = new THREE.Raycaster();
  const cameraDirection = new THREE.Vector3();

  const startColorA = new THREE.Color(0xed0010); 
  const endColorA = new THREE.Color(0x8f5803); 
  const startColorB = new THREE.Color(0xed0010); 
  const endColorB = new THREE.Color(0xd5fa05); 

  const changeModelColorGradually = (model, startColor, endColor, progress) => {
    const newColor = startColor.clone().lerp(endColor, progress);
    model.traverse((node) => {
      if (node.isMesh) {
        node.material.color.set(newColor);
      }
    });
  };

  const traverseModel = (object) => {
    object.traverse((child) => {
      if (child.isMesh) {
        if (child.name.startsWith('a')) {
          child.userData = { name: 'Parte A da proteína' };
        } else if (child.name.startsWith('b')) {
          child.userData = { name: 'Parte B da proteína' };
        }
      }
    });
  };

  const loadModel = (model, test) => {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(model.path, (gltfScene) => {
      gltfScene.scene.position.copy(model.position);
      gltfScene.scene.scale.copy(model.scale);
      traverseModel(gltfScene.scene);
      test.scene.add(gltfScene.scene);

      const collections = {
        A: [],
        B: []
      };

      gltfScene.scene.traverse((node) => {
        if (node.isMesh) {
          if (node.name === 'a') {
            collections.A.push(node);
          } else if (node.name === 'b') {
            collections.B.push(node);
          }
        }
      });

      setLoadedModels((prevModels) => [...prevModels, { scene: gltfScene.scene, collections }]);

      if (model.hasAnimation) {
        const mixer = new THREE.AnimationMixer(gltfScene.scene);
        gltfScene.animations.forEach((clip) => {
          const action = mixer.clipAction(clip);
          action.clampWhenFinished = true;
          action.loop = THREE.LoopRepeat;
          action.play();
          animationDurationRef.current = Math.max(animationDurationRef.current, clip.duration);
        });
        setMixers((prevMixers) => [...prevMixers, mixer]);
      }

    }, undefined, (error) => {
      console.error('Erro ao carregar o modelo GLTF:', error);
    });
  };

  useEffect(() => {
    const test = new SceneInit('myThreeJsCanvas');
    sceneInitRef.current = test;
    test.initialize();

    const models = [
      {
        path: './assets/models/proteina dupla.glb',
        position: new THREE.Vector3(0, -10, 0),
        scale: new THREE.Vector3(3, 3, 3),
        hasAnimation: true,
        isProtein: true
      }
    ];

    models.forEach((model) => {
      loadModel(model, test);
    });

    test.camera.aspect = window.innerWidth / window.innerHeight;
    test.camera.updateProjectionMatrix();
    test.camera.zoom = 1;
    test.renderer.setSize(window.innerWidth / 1.19, window.innerHeight / 1.19);

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      test.camera.aspect = width / height;
      test.camera.updateProjectionMatrix();
      test.renderer.setSize(width / 1.3, height / 1.3);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const test = sceneInitRef.current;
  
    const animateModels = () => {
      requestAnimationFrame(animateModels);
      let delta = test.clock.getDelta(); 
  
      if (isAnimating) {
        const speedFactor = 5;
        delta *= speedFactor;
  
        mixers.forEach((mixer) => {
          mixer.update(delta); 
        });
  
        const currentTime = mixers.length > 0 ? mixers[0].time % animationDurationRef.current : 0;
        const progress = currentTime / animationDurationRef.current;
  
        setPh(7 - (5 * progress)); 
        setTemperature(30 + (12 * progress)); 
  
        if (loadedModels.length > 0) {
          const proteinModel = loadedModels[0];
          proteinModel.collections.A.forEach((node) => {
            changeModelColorGradually(node, startColorA, endColorA, progress);
          });
          proteinModel.collections.B.forEach((node) => {
            changeModelColorGradually(node, startColorB, endColorB, progress);
          });
        }

        if (animationDurationRef.current - currentTime <= 10) {
          setShowDenaturationMessage(true);
          window.location.reload()
        } else {
          setShowDenaturationMessage(false);
        }

        if (currentTime < delta) {
          mixers.forEach((mixer) => {
            mixer.time = 0; 
            
          });
        }
      }
  
      test.renderer.render(test.scene, test.camera);
    };
  
    animateModels();
  }, [isAnimating, mixers, loadedModels, showDenaturationMessage]);

  useEffect(() => {
    const handleModelClick = (event) => {
      const test = sceneInitRef.current;
      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, test.camera);

      const intersects = raycaster.intersectObjects(test.scene.children, true);
      if (intersects.length > 0) {
        let clickedObject = intersects[0].object;

        while (clickedObject && !clickedObject.userData.name) {
          clickedObject = clickedObject.parent;
        }

        if (clickedObject && clickedObject.userData.name) {
          const clickedPartName = clickedObject.userData.name;
          setSelectedPart(clickedPartName);
          setPartInfo(partInfoMap[clickedPartName]);
        }
      }
    };

    window.addEventListener('click', handleModelClick);

    return () => {
      window.removeEventListener('click', handleModelClick);
    };
  }, []);

  const toggleAnimation = () => {
    setIsAnimating((prev) => {
      const newIsAnimating = !prev;
      mixers.forEach((mixer) => {
        if (newIsAnimating) {
          mixer.timeScale = 2; 
        } else {
          mixer.timeScale = 0; 
        }
      });
      return newIsAnimating;
    });
  };

  return (
    <div>
      <div className="app-container">
        {selectedPart && (
          <div className="organelle-info">
            <h2>{selectedPart}</h2>
            <p>{partInfo}</p>
          </div>
        )}
        <strong>
          <button className="button" id="play" onClick={toggleAnimation}>
            {isAnimating ? 'Pause' : 'Play'}
          </button>
        </strong>
        <div className="controls">
          <div className="slider-container">
            Nível do Ambiente 
            <label id="ph-temperature-label">
              {exibir === 'ph' ? `pH: ${ph.toFixed(0)}` : `Temperatura: ${temperature.toFixed(0)}°C`}
            </label>
          </div>
          <div className="button-container">
            <button className="button" onClick={() => setExibir('ph')}>
              Exibir pH
            </button>
            <button className="button" onClick={() => setExibir('temperature')}>
              Exibir Temperatura
            </button>
          </div>
        </div>
      </div>

      <canvas id="myThreeJsCanvas" />
      <div
        id="denaturationModal"
        className="modal2"
        style={{ display: showDenaturationMessage ? 'block' : 'none' }}
      >
        <div className="modal-content">
          <p>Proteína desnaturada!</p>
        </div>
      </div>
      <div
        id="collisionModal"
        className="modal2"
        style={{ display: showCollisionMessage ? 'block' : 'none' }}
      >
        <div className="modal-content">
          <p>Colisão detectada!</p>
        </div>
      </div>
    </div>
  );
}

export default Task;