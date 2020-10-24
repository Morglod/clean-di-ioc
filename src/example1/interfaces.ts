import { ContainerDI } from "..";

export interface Warrior {
    fight(): string;
    sneak(): string;
}

export interface Weapon {
    hit(): string;
}

export interface ThrowableWeapon {
    throw(): string;
}

export const di = new ContainerDI<{
    warrior: Warrior,
    weapon: Weapon,
    throwableWeapon: ThrowableWeapon
}>();