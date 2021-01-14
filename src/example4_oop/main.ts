import { diPick, diSetForceTag } from "../oop";
import './objects';
import './objects-mock';
import { IManager, Weapon, ThrowableWeapon } from "./interfaces";

function main() {
    const mgr = diPick(IManager);
    const warrior = mgr.createWarrior();

    const weapon = diPick(Weapon);
    const throwWeapon = diPick(ThrowableWeapon);
    warrior.setup(weapon, throwWeapon);
    
    console.log(warrior.fight(), warrior.sneak());
}

// lets say everytime use tag=mock for Weapons
diSetForceTag(Weapon, 'mock');
main();
main();
main();