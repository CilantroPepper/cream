# Cream

> 基于koa2封装的使用控制反转模式管理controller和service自动简单依赖注入的的NodeJS + TypeScript服务端应用程序框架



## 运行环境

- Node.js 16.x +



## 安装依赖

```shell
npm install
```



## 基本使用

- `app.ts` 导出了所有可用模块

- 创建 Controller、Service及入口文件

  - `index.ts`

    ```typescript
    import 'reflect-metadata' // 必须在入口文件处引用
    import { DemoController } from './router/controllers/demo.controller'
    import { DemoService } from './router/services/demo.service'
    import { Module, ModuleFactory } from './cream/app'
    
    @Module({
        controllers: [DemoController],
        providers: [DemoService]
    })
    class AppModule { }
    
    const app = ModuleFactory(AppModule)
    
    // module.exports = app
    app.listen(82, () => console.log('Listen... %d', 82))
    ```

  - `/router/controllers/demo.controller.ts`

    ```typescript
    import { Controller, Form, Get, Post, FormData, QueryData } from '../../cream/app'
    import { DemoService } from '../services/demo.service'
    
    @Controller('demo')
    export class DemoController {
        constructor(private readonly service: DemoService) { }
        @Post('') // 访问路径 /demo
        async demo_1(@Form('code') code: string, @Form('account') account: string) {
            return await this.service.demo_1(code, account)
        }
        @Get('demo/demo') // 访问路径 /demo/demo/demo
        async demo_2(@QueryData dataSet: Record<string, any>[]) {
            return dataSet
        }
    }
    ```

  - `/router/services/demo.service.ts`

    ```typescript
    export class DemoService {
        async demo_1(code: string, account: string) {
            return { code, account }
        }
    }
    ```

    