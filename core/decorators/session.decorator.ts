import { MetaType } from "./type"

export function Session(name: string): PropertyDecorator {
    return (target, key) => {
        const sessions = Reflect.getMetadata(MetaType.SESSION, target) ?? []
        sessions.push({
            key,
            name
        })
        Reflect.defineMetadata(MetaType.SESSION, sessions, target)
    }
}