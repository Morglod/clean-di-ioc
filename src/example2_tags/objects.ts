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

export class Bomb implements ThrowableWeapon {
    public throw() {
        return "bam!";
    }
}

export class Ninja implements Warrior {
    private _katana: Weapon;
    private _shuriken: ThrowableWeapon;
    private _powerWeapon: ThrowableWeapon;

    constructor(
        katana: Weapon,
        shuriken: ThrowableWeapon,
        powerWeapon: ThrowableWeapon,
    ) {
        this._katana = katana;
        this._shuriken = shuriken;
        this._powerWeapon = powerWeapon;
    }

    public fight() { return this._katana.hit() + this._powerWeapon.throw(); }
    public sneak() { return this._shuriken.throw(); }
}

di.set('weapon', () => new Katana);
di.set('throwableWeapon', () => new Shuriken);
di.set('throwableWeapon', () => new Bomb, 'power');

di.set('warrior', () => new Ninja(
    di.pick('weapon'),
    di.pick('throwableWeapon'),
    di.pick('throwableWeapon', 'power')
));

const warrior = di.create('warrior');
console.log([
    warrior.fight(),
    warrior.sneak()
]);