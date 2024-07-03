import CANNON from 'cannon';

// World
const world = new CANNON.World();
world.broadphase = new CANNON.SAPBroadphase(world);
world.gravity.set(0, -9.82, 0);

const objectsToUpdate = [];

// Materials
const ballMaterial = new CANNON.Material('ballMaterial');
const tipMaterial = new CANNON.Material('tipMaterial');
const tableMaterial = new CANNON.Material('tableMaterial');
const wallMaterial = new CANNON.Material('wallMaterial')

const ballTableContactMaterial = new CANNON.ContactMaterial(
    ballMaterial,
    tableMaterial,
    {
        friction: 0.8,
        restitution: 0.25,
    }
);
world.addContactMaterial(ballTableContactMaterial);

const ballBallContactMaterial = new CANNON.ContactMaterial(
    ballMaterial,
    ballMaterial,
    {
        friction: 0.15,
        restitution: 0.975,
    }
);
world.addContactMaterial(ballBallContactMaterial);

const tipBallContactMaterial = new CANNON.ContactMaterial(
    ballMaterial,
    tipMaterial,
    {
        friction: 0.7,
        restitution: 0.7
    }
)

const wallContactMaterial = new CANNON.ContactMaterial(
    ballMaterial,
    wallMaterial,
    {
        friction: 0.8,
        restitution: 0.8
    }
);
world.addContactMaterial(wallContactMaterial);

export { wallMaterial, ballMaterial, tableMaterial, world, objectsToUpdate };