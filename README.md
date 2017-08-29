# highFunction
高阶函数
## 实现bind函数
` function bind(fn,context){
    return function(){
        return fn.apply(context)
    }
} `
### bind函数