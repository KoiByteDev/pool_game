import * as THREE from "three";
import CANNON from "cannon";

const createPoolTable = (
  gltfLoader,
  scene,
  world,
  tableMaterial,
  wallMaterial
) => {
  gltfLoader.load("./models/Table/BilliardTable.glb", (gltf) => {
    const children = [...gltf.scene.children];
    for (const child of children) {
      child.position.y = 0.65;
      child.position.x = 0;
      child.position.z = 0;
      child.receiveShadow = true;
      scene.add(child);
    }

    const tableShape = new CANNON.Box(new CANNON.Vec3(1.085, 0.1, 0.55));
    const tableBody = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(0, 0.55, 0),
      shape: tableShape,
      material: tableMaterial,
    });
    world.addBody(tableBody);

    // Add walls
    const wallThickness = 0.05;
    const wallHeight = 0.1;
    const wallLength = 1.085;
    const wallDepth = 0.55;

    // Long walls
    const longWallShape = new CANNON.Box(
      new CANNON.Vec3(
        (wallLength / 2) * 0.875,
        (wallHeight / 2) * 0.9,
        wallThickness
      )
    );
    const wall1 = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(
        0.5425,
        0.65,
        wallDepth + wallThickness - 0.007
      ),
      shape: longWallShape,
      material: wallMaterial,
    });
    const wall2 = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(
        0.5425,
        0.65,
        -wallDepth - wallThickness + 0.007
      ),
      shape: longWallShape,
      material: wallMaterial,
    });
    const wall3 = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(
        -0.5425,
        0.65,
        wallDepth + wallThickness - 0.007
      ),
      shape: longWallShape,
      material: wallMaterial,
    });
    const wall4 = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(
        -0.5425,
        0.65,
        -wallDepth - wallThickness + 0.007
      ),
      shape: longWallShape,
      material: wallMaterial,
    });

    // Short walls
    const shortWallShape = new CANNON.Box(
      new CANNON.Vec3(wallThickness, wallHeight, wallDepth * 0.855)
    );
    const wall5 = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(wallLength + wallThickness - 0.0035, 0.65, 0),
      shape: shortWallShape,
      material: wallMaterial,
    });
    const wall6 = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(-wallLength - wallThickness + 0.0035, 0.65, 0),
      shape: shortWallShape,
      material: wallMaterial,
    });

    // Add walls to world
    world.addBody(wall1);
    world.addBody(wall2);
    world.addBody(wall3);
    world.addBody(wall4);
    world.addBody(wall5);
    world.addBody(wall6);

    // const wallMaterialThree = new THREE.MeshStandardMaterial({ color: 0x888888 });

    // const wallMesh1 = new THREE.Mesh(
    //   new THREE.BoxGeometry(
    //     wallLength * 0.875,
    //     wallHeight * 0.9,
    //     wallThickness * 2
    //   ),
    //   wallMaterialThree
    // );
    // wallMesh1.position.copy(wall1.position);
    // scene.add(wallMesh1);

    // const wallMesh2 = new THREE.Mesh(
    //   new THREE.BoxGeometry(
    //     wallLength * 0.875,
    //     wallHeight * 0.9,
    //     wallThickness * 2
    //   ),
    //   wallMaterialThree
    // );
    // wallMesh2.position.copy(wall2.position);
    // scene.add(wallMesh2);

    // const wallMesh3 = new THREE.Mesh(
    //   new THREE.BoxGeometry(
    //     wallLength * 0.875,
    //     wallHeight * 0.9,
    //     wallThickness * 2
    //   ),
    //   wallMaterialThree
    // );
    // wallMesh3.position.copy(wall3.position);
    // scene.add(wallMesh3);

    // const wallMesh4 = new THREE.Mesh(
    //   new THREE.BoxGeometry(
    //     wallLength * 0.875,
    //     wallHeight * 0.9,
    //     wallThickness * 2
    //   ),
    //   wallMaterialThree
    // );
    // wallMesh4.position.copy(wall4.position);
    // scene.add(wallMesh4);

    // const wallMesh5 = new THREE.Mesh(
    //   new THREE.BoxGeometry(
    //     wallThickness * 2,
    //     wallHeight * 0.9,
    //     wallDepth * 2 * 0.855
    //   ),
    //   wallMaterialThree
    // );
    // wallMesh5.position.copy(wall5.position);
    // scene.add(wallMesh5);

    // const wallMesh6 = new THREE.Mesh(
    //   new THREE.BoxGeometry(
    //     wallThickness * 2,
    //     wallHeight * 0.9,
    //     wallDepth * 2 * 0.855
    //   ),
    //   wallMaterialThree
    // );
    // wallMesh6.position.copy(wall6.position);
    // scene.add(wallMesh6);
  });
};

export { createPoolTable }