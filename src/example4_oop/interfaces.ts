import { diBase } from "../oop";

export interface Warrior {
    fight(): string;
    sneak(): string;

    setup(weapon: Weapon, throwable: ThrowableWeapon): void;
}

export const Warrior = diBase<Warrior>();

export interface Weapon {
    hit(): string;
}

export const Weapon = diBase<Weapon>();

export interface ThrowableWeapon {
    throw(): string;
}

export const ThrowableWeapon = diBase<ThrowableWeapon>();

export interface IManager {
    createWarrior(): Warrior;
}

export const IManager = diBase<IManager>({ singletone: true });