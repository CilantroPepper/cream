import { MetaType } from './type'

function CreateRequestMapper(path: string, method: 'GET' | 'POST'): MethodDecorator {
    return (target, name, descriptor) => {
        Reflect.defineMetadata(MetaType.METHOD + ':' + (name as string), method, target)
        Reflect.defineMetadata(MetaType.PATH + ':' + path, descriptor.value, target)
    }
}

export const Get = (path: string) => CreateRequestMapper(path, 'GET')
export const Post = (path: string) => CreateRequestMapper(path, 'POST')