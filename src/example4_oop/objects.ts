import { diImpl, diPick } from "../oop";
import { ThrowableWeapon, Warrior, Weapon, IManager } from "./interfaces";

@diImpl(Weapon)
export class Katana {
    hit() {
        return "cut!";
    }
}

@diImpl(ThrowableWeapon)
export class Shuriken {
    throw() {
        return "hit!";
    }
}

@diImpl(Warrior)
export class Ninja {
    private _katana!: Weapon;
    private _shuriken!: ThrowableWeapon;

    setup(
        katana: Weapon,
        shuriken: ThrowableWeapon,
    ) {
        this._katana = katana;
        this._shuriken = shuriken;
    }

    fight() { return this._katana.hit(); }
    sneak() { return this._shuriken.throw(); }
}

let _managerCounter = 0;

@diImpl(IManager)
export class Manager {
    _id = _managerCounter++;

    createWarrior(): Warrior {
        console.log('create warrior from manager.id=', this._id);
        return diPick(Warrior);
    }
}