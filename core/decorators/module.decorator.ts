import { MetaType, ModuleDecorator } from './type'

export function Module(params: ModuleDecorator): ClassDecorator {
    return (target) => {
        params.providers.forEach(provider => Reflect.defineMetadata(provider, new provider(), target))
        params.controllers.forEach(Controller => {
            // Get the controller's dependencies
            const paramTypes: any[] = getParamTypes(Controller)
            const dependencies = paramTypes.map(type => Reflect.getMetadata(type, target))
            // Create an instance of Controller
            const controller = new Controller(...dependencies)
            Reflect.defineMetadata(MetaType.PATH + ':' + Reflect.getMetadata(MetaType.PATH, Controller), controller, target)
            target.prototype[Controller.name] = controller
        })
    }
}

export function getParamTypes(target: Function) {
    return Reflect.getMetadata('design:paramtypes', target)
}