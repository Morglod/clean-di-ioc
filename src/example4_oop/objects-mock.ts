import { diImpl } from "../oop";
import { ThrowableWeapon, Warrior, Weapon } from "./interfaces";

@diImpl(Weapon, 'mock')
export class Katana {
    hit() {
        return "fake cut!";
    }
}

@diImpl(ThrowableWeapon, 'mock')
export class Shuriken {
    throw() {
        return "fake hit!";
    }
}
