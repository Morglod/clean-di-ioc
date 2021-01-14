export type DiBase<T> = T;
type DiBaseUUID = string;

const diMetaField = Symbol('diMetaField');

export interface DiBaseParams {
    singletone?: boolean,
}

export interface DiBaseMeta {
    uuid: any,
    forceSingletone: boolean,
}

export function diBase<T>(params: DiBaseParams = {}): DiBase<T> {
    const uuid = Symbol('dibase');

    return {
        [diMetaField]: {
            uuid,
            forceSingletone: !!params.singletone,
        } as DiBaseMeta
    } as any;
}

function getUUID(base: DiBase<any>): DiBaseUUID {
    return diGetMeta(base).uuid;
}

function diGetMeta(base: DiBase<any>): DiBaseMeta {
    return (base as any)[diMetaField];
}

/** base -> tag -> impl */
const _map: {
    [baseUUID: string]: {
        [tag: string]: {
            base: DiBase<any>,
            impl: new (...args: any) => any,
            singletoneInstance?: any,
        }[]
    }
} = {};

let _setNew_defaultTag = 'default';
let _setNew_forceTag: string|undefined = undefined;

const _tags: {
    [baseUUID in DiBaseUUID]: {
        defaultTag: string,
        forceTag: string|undefined,
    }
} = {};

function getStored(base: DiBase<any>, tag?: string) {
    const uuid = getUUID(base);
    tag = getDefaultTag(uuid, tag);

    if (!(uuid in _map)) return null;
    if (!(tag in _map[uuid])) return null;
    if (_map[uuid][tag].length === 0) return null;

    return _map[uuid][tag];
}

function getDefaultTag(baseUUID: DiBaseUUID, tag?: string) {
    if (!(baseUUID in _tags)) {
        _tags[baseUUID] = {
            defaultTag: _setNew_defaultTag,
            forceTag: _setNew_forceTag,
        };
    }

    return _tags[baseUUID].forceTag || tag || _tags[baseUUID].defaultTag;
}

export function diSetDefaultTag(base: any, tag: string) {
    const baseUUID = getUUID(base);

    if (!(baseUUID in _tags)) {
        _tags[baseUUID] = {
            defaultTag: tag,
            forceTag: _setNew_forceTag,
        };
    } else {
        _tags[baseUUID].defaultTag = tag;
    }
}

export function diSetForceTag(base: any, tag: string|undefined) {
    const baseUUID = getUUID(base);

    if (!(baseUUID in _tags)) {
        _tags[baseUUID] = {
            defaultTag: _setNew_defaultTag,
            forceTag: tag,
        };
    } else {
        _tags[baseUUID].forceTag = tag;
    }
}

export function diImpl<T>(base: T, tag?: string) {
    const uuid = getUUID(base);
    tag = getDefaultTag(uuid, tag);

    if (!(uuid in _map)) _map[uuid] = {};
    if (!(tag in _map[uuid])) _map[uuid][tag] = [];

    return <ClassT extends new (...args: any) => T>(target: ClassT) => {
        _map[uuid][tag!].push({
            base: base as any,
            impl: target as any,
        })
    };
}

export function diGetImpl<T>(base: T, tag?: string): (new (...args: any) => T)|null {
    const x = getStored(base, tag);
    if (!x) return null;
    return x[0].impl;
}

export interface DiPickParams<T> {
    tag?: string,
    singletone?: boolean,
}

export function diPick<T>(base: T, tag?: string): T;
export function diPick<T>(base: T, params?: DiPickParams<T>): T;

export function diPick<T>(base: T, tag_params?: string|DiPickParams<T>): T {
    if (typeof tag_params === 'string') {
        tag_params = { tag: tag_params };
    }
    const params = (tag_params || {});

    const meta = diGetMeta(base);
    const x = getStored(base, params.tag);
    if (!x) throw new Error('diPick failed. no implementation found for ' + base + ' base');

    if ((meta.forceSingletone || params.singletone) && params.singletone !== false) {
        if (x[0].singletoneInstance) {
            return x[0].singletoneInstance;
        }

        const instance = new x[0].impl;
        x[0].singletoneInstance = instance;
        return instance;
    }

    return new x[0].impl;
}
