import koa, { Context } from 'koa'
import BodyParser from './body-parser'
import Response from './response'

export default class Application extends koa {
    constructor(private module: (ctx: Context) => Promise<any>) {
        super()
        this.init()
    }

    private init() {
        this.use(async (ctx, next) => {
            await next()
            ctx.set({
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            })
        })
        this.use(BodyParser.parse)
        this.use(async (ctx, next) => {
            await next()
            const data = await this.module(ctx).catch(e => {
                Response.fail(ctx, e?.code ?? 404, e?.msg ?? 'Request Error')
                return void 0
            })
            if (!data) return
            if (data instanceof Buffer || data?.data instanceof Buffer)
                Response.success(ctx, data?.data ?? data ?? '', data?.headers)
            else
                Response.success(ctx, {
                    code: data?.code ?? 200,
                    data: data?.data !== void 0 ? data?.data : data ?? null,
                    msg: data?.msg ?? 'success'
                }, data?.headers)
        })
    }
}