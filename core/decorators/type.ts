const MetaType = {
    PATH: '__PATH__',
    CONTROLLER: '__CONTROLLER__',
    PROVIDER: '__PROVIDER__',
    METHOD: '__METHOD__',
    SERVICE: '__SERVICE__',
    PARAMS: '__PARAMS__',
    SESSION: '__SESSION__'
}

interface ModuleDecorator {
    controllers: (new (...args: any[]) => any)[],
    providers: (new (...args: any[]) => any)[]
}

interface ParamType {
    type: 'query' | 'form' | 'file' | 'formdata' | 'querydata',
    index: number,
    key: string   
}

export {
    MetaType,
    ModuleDecorator,
    ParamType
}