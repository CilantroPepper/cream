import { MetaType } from './type'

export function Controller(path: string): ClassDecorator {
    return (target) => {
        Reflect.defineMetadata(MetaType.PATH, path, target)
    }
}