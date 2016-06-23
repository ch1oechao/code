---
layout: post
title:  "JavaScript this?"
date:  2016-06-22
categories: JavaScript
---

关于 this 的笔记收集

原文：[Gentle explanation of 'this' keyword in JavaScript](http://rainsoft.io/gentle-explanation-of-this-in-javascript/) 

**目录**

* TOC
{:toc}

### 迷之 `this` 

对于刚开始进行 JavaScript 编程的开发者来说，`this` 具有强大的魔力，它像谜团一样需要工程师们花大量的精力去真正理解它。

在后端的一些编程语言中，例如 `Java`、`PHP`，`this`仅仅是类方法中当前对象的一个实例，它不能在方法外部被调用，这样一个简单的法则并不会造成任何疑惑。

在 JavaScript 中，`this` 是指当前函数中正在执行的上下文环境，因为这门语言拥有四种不同的函数调用类型：

- 函数调用 `alert('Hello World!')`
- 方法调用 `console.log('Hello World!')`
- 构造函数调用 `new RegExp('\\d')`
- 间接调用 `alert.call(undefined, 'Hello World')`

在以上每一项调用中，它都拥有各自独立的上下文环境，就会造成 `this` 所指意义有所差别。此外，严格模式也会对执行环境造成影响。

理解 `this` 关键字的关键在于理解各种不同的函数调用以及它是如何影响上下文环境的。
这篇文章旨在解释不同情况下的函数调用会怎样影响 `this` 以及判断上下文环境时会产生的一些常见陷阱。

在开始讲述之前，先熟悉以下一些术语：

- **调用** 是执行当前函数主体的代码，即调用一个函数。例：`parseInt` 函数的调用为 `parseInt(15)`
- **上下文环境** 是方法调用中 `this` 所代表的值
- **作用域** 是一系列方法内可调用到的变量，对象，方法组成的集合

### 函数调用

**函数调用** 代表了该函数接收以成对的引号包含，用逗号分隔的不同参数组成的表达式。举例：`parseInt('18')`。这个表达式不能是属性访问如 `myObject.myFunction` 这样会造成方法调用。`[1, 5].join(',')` 同样也不是一个函数调用而是方法调用。

函数调用的一个简单例子：

    function hello(name) {
        return 'Hello' + name + '!';
    }
    // Function invocation
    var message = hello('World');
    console.log(message); // => 'Hello World!'

`hello('World')` 是一个函数调用：`hello`表达式代表了一个函数对象，接受了用成对引号包含的 `World` 参数。

高级一点的例子，立即执行函数 IIFE (immediately-invoked function expression)：

    var message = (function(name) {  
        return 'Hello ' + name + '!';
    })('World');
    console.log(message) // => 'Hello World!' 

#### 函数调用中的 `this`

> 在函法调用中，`this` 指向的是全局对象。

全局对象取决于当前执行环境，在浏览器中，全局对象即 `window`。

在函数调用中，上下文执行环境是全局对象，可以在以下函数中验证上下文：

    function sum(a, b) {  
       console.log(this === window); // => true
       this.myNumber = 20; // add 'myNumber' property to global object
       return a + b;
    }
    // sum() is invoked as a function
    // this in sum() is a global object (window)
    sum(15, 16);     // => 31  
    window.myNumber; // => 20  

当 `sum(15, 16)` 被调用时，JavaScript 自动将 `this` 设置为全局对象，即 `window`。

当 `this` 在任何函数作用域以外调用时（最外层作用域：全局执行上下文环境），也会涉及到全局对象。

    console.log(this === window); // => true  
    this.myString = 'Hello World!';  
    console.log(window.myString); // => 'Hello World!'  
    
    <!-- In an html file -->  
    <script type="text/javascript">  
       console.log(this === window); // => true
    </script>  

#### 严格模式下，函数调用中的 `this`

> 在严格模式下的函法调用，`this` 代表 `undefined`。

严格模式由 [ECMAScript 5.1](http://www.ecma-international.org/ecma-262/5.1/#sec-10.1.1) 引进，用来限制 JavaScript 的一些异常处理，提供更好的安全性和更强壮的错误检查机制。使用严格模式，只需要将 `'use strict'` 置于函数体的顶部。这样就可以将上下文环境中的 `this` 转为 `undefined`。这样执行上下文环境不再是全局对象，与非严格模式刚好相反。

在严格模式下执行函数的一个例子：

    function multiply(a, b) {  
      'use strict'; // enable the strict mode
      console.log(this === undefined); // => true
      return a * b;
    }
    // multiply() function invocation with strict mode enabled
    // this in multiply() is undefined
    multiply(2, 5); // => 10 

当 `multiply(2, 5)` 执行时，这个函数中的 `this` 是 `undefined`。

严格模式不仅在当前作用域起到作用，它还会影响内部作用域，即内部声明的一切内部函数的作用域。

    function execute() {  
       'use strict'; // activate the strict mode    
       function concat(str1, str2) {
         // the strict mode is enabled too
         console.log(this === undefined); // => true
         return str1 + str2;
       }
       // concat() is invoked as a function in strict mode
       // this in concat() is undefined
       concat('Hello', ' World!'); // => "Hello World!"
    }
    execute();  

`use strict` 被插入函数执行主体的顶部，使严格模式可以控制到整个作用域。因为 `concat` 在执行作用域内部声明，因此它继承了严格模式。此外，`concat('Hello', ' World!')` 的调用中，`this` 也会成为 `undefined`。

一个简单的 JavaScript 文件可能同时包含严格模式和非严格模式，所以在同一种类型调用中，可能也会有不同的上下文行为差异。

    function nonStrictSum(a, b) {  
      // non-strict mode
      console.log(this === window); // => true
      return a + b;
    }
    function strictSum(a, b) {  
      'use strict';
      // strict mode is enabled
      console.log(this === undefined); // => true
      return a + b;
    }
    // nonStrictSum() is invoked as a function in non-strict mode
    // this in nonStrictSum() is the window object
    nonStrictSum(5, 6); // => 11  
    // strictSum() is invoked as a function in strict mode
    // this in strictSum() is undefined
    strictSum(8, 12); // => 20  

#### 陷阱：`this` 在内部函数中

一个常见的陷阱是理所应当的认为函数调用中的，内部函数中 `this` 等同于它的外部函数中的 `this`。

正确的理解是内部函数的上下文环境取决于调用环境，而不是外部函数的上下文环境。

为了获取到所期望的 `this`，应该利用间接调用修改内部函数的上下文环境，如使用 `.call()` 或者 `.apply` 或者创建一个绑定函数 `.bind()`。

下面的例子表示计算两个数之和：

    var numbers = {  
       numberA: 5,
       numberB: 10,
       sum: function() {
         console.log(this === numbers); // => true
         function calculate() {
           // this is window or undefined in strict mode
           console.log(this === numbers); // => false
           return this.numberA + this.numberB;
         }
         return calculate();
       }
    };
    numbers.sum(); // => NaN or throws TypeError in strict mode  

`numbers.sum()` 是对象内的一个方法调用，因此 `sum` 的上下文是 `numbers` 对象，而 `calculate` 函数定义在 `sum` 函数内，所以会误以为在 `calculate` 内 `this` 也指向的是 `numbers`。

然而 `calculate()` 在函数调用（而不是作为方法调用）时，此时的 `this` 指向的是全局对象 `window` 或者在严格模式下指向 `undefined` ，即使外部函数 `sum` 拥有 `numbers`对象作上下文环境，它也没有办法影响到内部的 `this`。

`numbers.sum()` 调用的结果是 `NaN` 或者在严格模式下直接抛出错误 `TypeError: Cannot read property 'numberA' of undefined`，而绝非期待的结果 `5 + 10 = 15`，造成这样的原因是 `calculate` 并没有正确的被调用。

为了解决这个问题，正确的方法是使 `calculate` 函数被调用时的上下文同 `sum` 调用时一样，为了得到属性 `numberA` 和 `numberB`，其中一种办法是使用 `.call()` 方法。

    var numbers = {  
       numberA: 5,
       numberB: 10,
       sum: function() {
         console.log(this === numbers); // => true
         function calculate() {
           console.log(this === numbers); // => true
           return this.numberA + this.numberB;
         }
         // use .call() method to modify the context
         return calculate.call(this);
       }
    };
    numbers.sum(); // => 15  

`calculate.call(this)` 同样执行 `calculate` 函数，但是格外的添加了 `this`作为第一个参数，修改了上下文执行环境。此时的 `this.numberA + this.numberB` 等同于 `numbers.numberA + numbers.numberB`，其最终的结果就会如期盼的一样为 `result 5 + 10 = 15`。

---

未完待续...

