import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import SceneInit from './lib/SceneInit';
import '../style2.css';

function App() {
  const [loadedModels, setLoadedModels] = useState([]);
  const [showCollisionMessage, setShowCollisionMessage] = useState(false);
  const [selectedOrganelle, setSelectedOrganelle] = useState(null);
  const [organelleInfo, setOrganelleInfo] = useState('');
  const [showOrganelleModal, setShowOrganelleModal] = useState(false);
  const [organelleVisibility, setOrganelleVisibility] = useState([true, true, true, true]);
  const sceneInitRef = useRef(null);
  const raycaster = new THREE.Raycaster();
  const cameraDirection = new THREE.Vector3();
  const collisionModalRef = useRef(null);
  const organelleModalRef = useRef(null);

  const organelleInfoMap = {
    MITOCÔNDRIA: 'Organela onde ocorre a respiração celular, processo que converte nutrientes em ATP (adenosina trifosfato), fornecendo energia para as atividades celulares. ',
    LISOSSOMO: 'Vesículas contendo enzimas digestivas que degradam substâncias dentro da célula, como nutrientes, organelas danificadas e patógenos. Desempenham um papel essencial na autofagia e fagocitose, além de contribuir para a manutenção celular.',
    'COMPLEXO DE GOLGI': 'Organela que processa, modifica e distribui proteínas e lipídios para diferentes partes da célula ou para secreção, ele desempenha um papel central no tráfego intracelular de moléculas.',
    CENTRÍOLO: 'Estruturas cilíndricas formadas por microtúbulos, envolvidas na organização do citoesqueleto e no processo de divisão celular (mitose e meiose). Participam também da formação de cílios e flagelos, que servem para locomoção de algumas células.',
    PEROXISSOMO: 'Organelas que realizam reações de oxidação para metabolizar lipídios e desintoxicar a célula, quebrando substâncias tóxicas, como peróxido de hidrogênio (H₂O₂), através da ação da enzima catalase.',
    NÚCLEO: 'É uma organela delimitada por uma membrana dupla porosa, chamada carioteca, que separa o material genético do citoplasma. Ele é a estrutura mais visível na célula e desempenha e controla funções essenciais de toda a célula.',
    'RETíCULOS ENDOPLASMÁTICOS LISO E RUGOSO': 'O REL participa na síntese de lipídios, desintoxicação celular, armazenamento de cálcio e metabolismo de carboidratos. O RER, associado a ribossomos, atua na síntese, transporte e início das modificações de proteínas, como o dobramento e a glicosilação.',
    RIBOSSOMO: 'Estruturas pequenas e densas responsáveis pela síntese de proteínas. Podem estar livres no citoplasma ou ligados ao retículo endoplasmático rugoso (RER). Geralmente, sintetizam proteínas que serão usadas dentro da própria célula.',
  };

  const traverseModel = (object, name) => {
    object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            child.userData = { name };
            child.visible = false;
        }
    });
  };

  const loadModel = (model, test, name) => {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(model.path, (gltfScene) => {
      gltfScene.scene.position.copy(model.position);
      gltfScene.scene.scale.copy(model.scale);

      if (model.rotation) {
        gltfScene.scene.rotation.copy(model.rotation);
    }

      traverseModel(gltfScene.scene, name);
      test.scene.add(gltfScene.scene);

      setLoadedModels((prevModels) => [...prevModels, { scene: gltfScene.scene, isProtein: model.isProtein }]);
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
        path: './assets/models/complexoGolgi_V1.glb',
        position: new THREE.Vector3(0, -20, 0),
        scale: new THREE.Vector3(10, 10, 10),
      },
      {
        path: './assets/models/centriolo.glb',
        position: new THREE.Vector3(65, 0, -10),
        scale: new THREE.Vector3(30, 30, 30),
      },
      {
        path: './assets/models/mitocondiaV2.glb',
        position: new THREE.Vector3(290, 0, -20),
        scale: new THREE.Vector3(30, 30, 30),
      },
      {
        path: './assets/models/lisossomosofc.gltf',
        position: new THREE.Vector3(360, 0, -10),
        scale: new THREE.Vector3(10, 10, 10),
      },
      {
        path: './assets/models/peroxissomo.glb',
        position: new THREE.Vector3(110, 0, -10),
        scale: new THREE.Vector3(2, 2, 2),
      },
      {
        path: './assets/models/Ribossomo.glb',
        position: new THREE.Vector3(170, 0, -10),
        scale: new THREE.Vector3(5, 5, 5),
      },
      {
        path: './assets/models/Nucleo.glb',
        position: new THREE.Vector3(380, -70, -80),
        scale: new THREE.Vector3(100, 100, 100),
        rotation: new THREE.Euler(0, Math.PI / 2, 0),
      },
      {
        path: './assets/models/reticulos.glb',
        position: new THREE.Vector3(225, 0, -30),
        scale: new THREE.Vector3(20, 20, 20),
      },
    ];    

    models.forEach((model) => {
      let name = '';
    
      if (model.path.includes('mitocondia')) {
        name = 'MITOCÔNDRIA';
      } else if (model.path.includes('lisossomo')) {
        name = 'LISOSSOMO';
      } else if (model.path.includes('complexoGolgi')) {
        name = 'COMPLEXO DE GOLGI';
      } else if (model.path.includes('centriolo')) {
        name = 'CENTRÍOLO';
      }else if (model.path.includes('peroxissomo')) {
        name = 'PEROXISSOMO';
      }else if (model.path.includes('Nucleo')) {
        name = 'NÚCLEO';
      } else if (model.path.includes('reticulos')) {
        name = 'RETíCULOS ENDOPLASMÁTICOS LISO E RUGOSO';
      }else if (model.path.includes('Ribossomo')) {
        name = 'RIBOSSOMO';
      }
      loadModel(model, test, name);
    });

    const light = new THREE.AmbientLight(0xffffff, 0.5);
    test.scene.add(light);
    const light2 = new THREE.PointLight(0xffffff, 0.5);
    test.scene.add(light2);
    test.scene.fog = new THREE.Fog(0xffffff, 0, 100000);
    test.renderer.setClearColor(0x000000);

    test.camera.aspect = window.innerWidth / window.innerHeight;
    test.camera.updateProjectionMatrix();
    test.camera.zoom = 0.05;
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
      const delta = test.clock.getDelta() * 40;

      test.camera.getWorldDirection(cameraDirection);
      raycaster.set(test.camera.position, cameraDirection);

      const intersects = raycaster.intersectObjects(test.scene.children, true);
      if (intersects.length > 0 && intersects[0].distance < 5) {
        test.camera.position.addScaledVector(cameraDirection, -100);
        setShowCollisionMessage(true);
        setTimeout(() => {
          setShowCollisionMessage(false);
        }, 3000);
      }

      test.renderer.render(test.scene, test.camera);
    };

    animateModels();
  }, [loadedModels]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (collisionModalRef.current && !collisionModalRef.current.contains(event.target)) {
        setShowCollisionMessage(false);
      }
      if (organelleModalRef.current && !organelleModalRef.current.contains(event.target)) {
        setShowOrganelleModal(false);
      }
    };

    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const collisionModal = document.getElementById("collisionModal");
    const organelleModal = document.getElementById("organelleModal");
    collisionModal.style.display = showCollisionMessage ? "block" : "none";
    organelleModal.style.display = showOrganelleModal ? "block" : "none";
    document.body.classList.toggle('modal-open', showCollisionMessage || showOrganelleModal);
  }, [showCollisionMessage, showOrganelleModal]);

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
          const clickedOrganelleName = clickedObject.userData.name;
          setSelectedOrganelle(clickedOrganelleName);
          setOrganelleInfo(organelleInfoMap[clickedOrganelleName]);
          setShowOrganelleModal(true);
        }
      }
    };

    window.addEventListener('click', handleModelClick);

    return () => {
      window.removeEventListener('click', handleModelClick);
    };
  }, []);

  const toggleVisibility = (index) => {
    if (index >= 0 && index < loadedModels.length) {
      const newVisibility = [...organelleVisibility];
      newVisibility[index] = !newVisibility[index];
  
      loadedModels[index].scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.visible = newVisibility[index];
        }
      });
  
      setOrganelleVisibility(newVisibility);
    }
  };

  return (
    <div>
      <div className="app-container">
        {/* Botões */}

        <strong><button className="button" onClick={() => toggleVisibility(0)}>Complexo de Golgi</button></strong>
        <strong><button className="button" onClick={() => toggleVisibility(1)}>Centríolo</button></strong>
        <strong><button className="button" onClick={() => toggleVisibility(2)}>Peroxissomo</button></strong>
        <strong><button className="button" onClick={() => toggleVisibility(3)}>Ribossomo</button></strong>
        <strong><button className="button" onClick={() => toggleVisibility(4)}>Retículos Endoplasmáticos</button></strong>
        <strong><button className="button" onClick={() => toggleVisibility(5)}>Mitocôndria</button></strong>
        <strong><button className="button" onClick={() => toggleVisibility(6)}>Lisossomo</button></strong>
        <strong><button className="button" onClick={() => toggleVisibility(7)}>Núcleo</button></strong>
        
  
        <canvas id="myThreeJsCanvas" />
        <div id="collisionModal" className="modal" ref={collisionModalRef} style={{ display: showCollisionMessage ? 'block' : 'none' }}>
          <div className="modal-content">
            <p>Colisão detectada!</p>
          </div>
        </div>
        <div id="organelleModal" className="modal" ref={organelleModalRef} style={{ display: showOrganelleModal ? 'block' : 'none' }}>
          <div className="modal-content">
            <span className="close" onClick={() => setShowOrganelleModal(false)}>&times;</span>
            <h2>{selectedOrganelle}</h2>
            <p>{organelleInfo}</p>
          </div>
        </div>
      </div>
    </div>
  );
  
  
}

export default App;
