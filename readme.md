# Clean DIIoC

No decorators, no metadata  
Clean Dependency Injection  
<sub><sup>*even no changes in original code*</sup></sub>

* Everything is typed
* Context supported
* Tags supported

## Example

We got interfaces
```ts
interface Warrior {
    fight(): string;
    sneak(): string;
}

interface Weapon {
    hit(): string;
}

interface ThrowableWeapon {
    throw(): string;
}
```

Append with
```ts
const di = new ContainerDI<{
    warrior: Warrior,
    weapon: Weapon,
    throwableWeapon: ThrowableWeapon
}>();
```

We  got implementations
```ts
class Katana implements Weapon {
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
```

Append with
```ts
di.setCtor('weapon', Katana);
di.setCtor('throwableWeapon', Shuriken);

di.set('warrior', () => new Ninja(
    di.pick('weapon'),
    di.pick('throwableWeapon')
));
```

Now use
```ts
const warrior = di.create('warrior');

console.log(warrior.sneak(), warrior.fight());
```

## Singletone

```ts
// declare
interface ILogger {
    log(msg: string): void;
}

const di = new ContainerDI<{
    logger: ILogger,
}>();

// bind implementation
class Logger implements ILogger {
    log(msg: string): void {
        console.log(msg);
    }
}
di.set('logger', () => new Logger);

// use it as singletone

const logger = di.singletone('logger');
logger.log('hello');

const logger = di.singletone('logger');
logger.log('world');
```