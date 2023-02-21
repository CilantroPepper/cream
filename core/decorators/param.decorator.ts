import { MetaType, ParamType } from './type'


function Param(key: string, type: 'query' | 'form' | 'file' | 'formdata' | 'querydata'): ParameterDecorator {
    return (target, fnName, index) => {
        const query: ParamType[] = Reflect.getMetadata(MetaType.PARAMS, target[fnName as keyof typeof target]) ?? []
        query.push({
            index,
            type,
            key
        })
        Reflect.defineMetadata(MetaType.PARAMS, query, target[fnName as keyof typeof target])
    }
}

export const Query = (key: string) => Param(key, 'query')
export const Form = (key: string) => Param(key, 'form')
export const File = Param('file', 'file')
export const FormData = Param('', 'formdata')
export const QueryData = Param('', 'querydata')