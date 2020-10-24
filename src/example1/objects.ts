import { di, ThrowableWeapon, Warrior, Weapon } from "./interfaces";

export class Katana implements Weapon {
    public hit() {
        return "cut!";
    }
}

export class Shuriken implements ThrowableWeapon {
    public throw() {
        return "hit!";
    }
}

export class Ninja implements Warrior {
    private _katana: Weapon;
    private _shuriken: ThrowableWeapon;

    constructor(
        katana: Weapon,
        shuriken: ThrowableWeapon,
    ) {
        this._katana = katana;
        this._shuriken = shuriken;
    }

    public fight() { return this._katana.hit(); }
    public sneak() { return this._shuriken.throw(); }
}

di.set('weapon', () => new Katana);
di.set('throwableWeapon', () => new Shuriken);

di.set('warrior', () => new Ninja(
    di.pick('weapon'),
    di.pick('throwableWeapon')
));

const warrior = di.create('warrior');
console.log([
    warrior.fight(),
    warrior.sneak()
]);