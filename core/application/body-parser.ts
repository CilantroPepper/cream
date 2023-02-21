import { Context, Next } from "koa"
import Base64 from 'crypto-js/enc-base64'
import Utf8 from 'crypto-js/enc-utf8'

const BodyParser = {
    // Mid-ware: parse post request body
    async parse(ctx: Context, next: Next) {
        if (ctx.method.toLowerCase() === 'post') {
            await (new Promise<void>(resolve => {
                if (ctx.headers["content-type"]?.includes("multipart/form-data")) ctx.req.setEncoding('binary')
                let data = ""
                ctx.req.on('data', chunk => data += chunk)
                ctx.req.on('end', async () => {
                    try {
                        ctx.data = data.toString()
                        if (ctx.headers["content-type"]?.includes("application/json")) {
                            try {
                                ctx.data = JSON.parse(ctx.data)
                            } catch (e) {
                            }
                        } else if (ctx.headers["content-type"]?.includes("multipart/form-data")) {
                            try {
                                ctx.data = BodyParser.parseForm(ctx.data, BodyParser.parseContentType(ctx.headers["content-type"] as string)['boundary'])
                            } catch (e) {
                            }
                        }
                    } finally {
                        resolve()
                    }
                })
            }))
            await next()
        } else await next()
    },
    // parse formdata
    parseForm(body: string, boundary: string) {
        const parts = body.split(boundary)
        // Remove the useless part
        parts.pop()
        parts.shift()
        const result: { [key: string]: any } = {}
        for (let i in parts) {
            // Remove the useless char of each part
            parts[i] = parts[i].slice(0, -2).trim()
            let enter: number
            let key: string, value: string
            if ((enter = parts[i].indexOf('\r\n\r\n')) !== -1) {
                value = parts[i].slice(enter + 4)
            } else if ((enter = parts[i].indexOf('\n\n')) !== -1) {
                value = parts[i].slice(enter + 2)
            } else if ((enter = parts[i].indexOf('\r\r')) !== -1) {
                value = parts[i].slice(enter + 2)
            } else {
                value = ''
            }
            // Get name
            key = this.bin2utf(parts[i].match(/name="([^"]+)"/)?.[1] as string)
            if (key !== 'file') value = this.bin2utf(value)
            result[key] = value
        }
        return result
    },
    // Parse content-type
    parseContentType(origin: string) {
        const result: { [key: string]: string } = {}
        const parts = origin.split(';').filter((item, index) => {
            if (index === 0) {
                result['ContentType'] = item
            }
            return item.trim().indexOf('=') > 0
        })
        parts.forEach(item => {
            const pair = item.split('=')
            result[pair[0].trim()] = pair[1].trim()
        })
        return result
    },
    // Convert binary to utf
    bin2utf(origin: string | undefined) {
        if (!origin) return ''
        return Buffer.from(origin, 'binary').toString()
    },
    // Convert base64 to utf8
    base64Decode(str: string) {
        return Base64.parse(str).toString(Utf8)
    }
}
export default BodyParser