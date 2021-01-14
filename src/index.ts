interface AnyCtor { new (...args: any): any }

type CtorType<T> =
    T extends (new (...args: any) => any) ? T :
    T extends AnyCtor ? (new (...args: ConstructorParameters<T>) => T) :
    new () => T
;

type RegisteredCtor<InterfaceT> = {
    ctor?: CtorType<InterfaceT>,
    factory?: (ctx: any) => InterfaceT,
};

export class ContainerDI<InterfacesT extends { [x: string]: any }> {
    _ctors: {
        [n in keyof InterfacesT]?: RegisteredCtor<InterfacesT[n]> | ({
            _$$_tagged_$$_: true,
            default: RegisteredCtor<InterfacesT[n]>
        } & {
            [tagName: string]: RegisteredCtor<InterfacesT[n]>
        })
    } = {};

    _creatingNow: any;

    _singletones: {
        [n in keyof InterfacesT]?: {
            [tagName: string]: InterfacesT[n]
        }
    } = {};

    private _register<NameT extends keyof InterfacesT>(
        name: NameT,
        params: RegisteredCtor<InterfacesT[NameT]>,
        tag?: string,
    ) {
        if (tag || this._ctors[name] && (this._ctors[name] as any)._$$_tagged_$$_) {
            if (!(this._ctors[name] as any)._$$_tagged_$$_) {
                this._ctors[name] = {
                    _$$_tagged_$$_: true,
                    default: this._ctors[name]
                } as any;
            }
            tag = tag || 'default';
            (this._ctors[name] as any)[tag] = params;
        } else {
            this._ctors[name] = params;
        }
    }

    private _getRegistered<NameT extends keyof InterfacesT>(
        name: NameT,
        tag?: string,
    ): RegisteredCtor<InterfacesT[NameT]> {
        if (this._ctors[name] && (this._ctors[name] as any)._$$_tagged_$$_) {
            tag = tag || 'default';
            return (this._ctors[name] as any)[tag];
        }
        return this._ctors[name] as any;
    }

    setCtor<NameT extends keyof InterfacesT>(
        name: NameT,
        ctor: CtorType<InterfacesT[NameT]>,
        tag?: string,
    ) {
        this._register(name, { ctor }, tag);
    }

    set<NameT extends keyof InterfacesT>(
        name: NameT,
        factory: () => InterfacesT[NameT],
        tag?: string,
    ) {
        this._register(name, { factory }, tag);
    }

    pick<NameT extends keyof InterfacesT>(name: NameT, tag?: string, ctx: any = {}): InterfacesT[NameT] {
        // vary on _creatingNow
        return this.create(name, tag, ctx);
    }

    create<NameT extends keyof InterfacesT>(name: NameT, tag?: string, ctx: any = {}): InterfacesT[NameT] {
        this._creatingNow = name;
        const x = this._getRegistered(name, tag);
        let obj;
        if (x.ctor) obj = new x.ctor();
        if (x.factory) obj = x.factory(ctx);
        this._creatingNow = undefined;
        return obj;
    }

    singletone<NameT extends keyof InterfacesT>(name: NameT, tag?: string, ctx: any = {}): InterfacesT[NameT] {
        tag = tag || 'default';

        if (this._singletones[name] && this._singletones[name]![tag]) {
            return this._singletones[name]![tag];
        }

        if (!this._singletones[name]) this._singletones[name] = {};

        const obj = (this._singletones as any)[name][tag] = this.create(name, tag, ctx);
        return obj;
    }
}