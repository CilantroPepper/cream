import { Context } from "koa"

const Response = {
    success(ctx: Context, data: string | Buffer | object | number, headers?: { [key: string]: string }) {
        ctx.status = 200
        if (headers)
            ctx.set(headers)
        if (data && !(data instanceof Buffer) && typeof data === 'object') {
            ctx.set({
                'Content-Type': 'application/json; charset=utf-8;'
            })
            ctx.body = JSON.stringify(data)
            return
        }
        ctx.body = data

    },
    fail(ctx: Context, code: number = 404, msg: string = "Request Error") {
        ctx.status = code
        ctx.message = msg
    }
}
export default Response