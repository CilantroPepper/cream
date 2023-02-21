import { Context } from "koa";
import Application from "../application";
import { MetaType, ParamType } from "../decorators/type";

export function ModuleFactory<T extends object>(app: T, plugins?: ((ctx: Context) => Promise<any>)[]) {
    const validMethod = ['GET', 'POST']
    const dispatcher = async (ctx: Context) => {
        if (ctx.method.toUpperCase() === 'OPTIONS') return '';
        if (!validMethod.includes(ctx.method.toUpperCase())) throw { code: 404, msg: 'Unsupport Request' }
        let path = ctx.path.split('/').slice(1)
        // Get controller
        let controller: any = void 0
        let count = path.length
        while (controller === void 0 && count >= 0) {
            let controlPath = path.slice(0, count--).join('/')
            controller = Reflect.getMetadata(MetaType.PATH + ':' + controlPath, app)
        }
        if (controller === void 0) throw { code: 404, msg: 'Not Found'}
        // Get service path
        const servicePath = path.slice(count + 1).reduce((pre, cur) => pre + '/' + cur, '').slice(1)
        // Get request method
        const executor: Function | undefined = Reflect.getMetadata(MetaType.PATH + ':' + servicePath, controller)
        if (!executor || typeof executor !== 'function' || Reflect.getMetadata(MetaType.METHOD + ':' + executor.name, controller) !== ctx.method.toUpperCase()) {
            throw { code: 403, msg: 'Forbidden' }
        }
        // Inject params
        const paramsType: ParamType[] = Reflect.getMetadata(MetaType.PARAMS, executor)
        const params = paramsType?.sort((a, b) => a.index - b.index)?.map(paramType => {
            if (paramType.type === 'query') return ctx.query[paramType.key]
            if (paramType.type === 'form') return ctx?.data?.[paramType.key]
            if (paramType.type === 'file') return ctx?.data?.['file']
            if (paramType.type === 'formdata') return ctx?.data
            if (paramType.type === 'querydata') return ctx?.query
        }) ?? []
        try {
            plugins?.map(async plugin => await plugin?.(ctx))
            return await executor.bind(controller)(...params)
        } catch (error) {
            throw error
        }
    }
    return new Application(dispatcher)
}
