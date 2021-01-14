function diBase<T>(): (new () => T) & {
    create(): T
} {
    return (class DiBaseInterface {
        static setImpl(target: any) {
            console.log('setImpl', target);
        }
    }) as any;
}

function diImpl(base: any) {
    console.log('aaa2');
    return (target: any) => {
        console.log('aaa');
        base.setImpl(target);
    };
}

class Weapon extends diBase<{
    hit(): void;
}>() {}

@diImpl(Weapon)
class Katana {
    hit() {
        console.log('hit!');
    }
}

// Weapon.create();