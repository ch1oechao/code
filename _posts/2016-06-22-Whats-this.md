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
    // 函数调用
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
       this.myNumber = 20; // 在全局对象中添加 'myNumber' 属性
       return a + b;
    }
    // sum() 为函数调用
    // this 在 sum() 中是全局对象 (window)
    sum(15, 16);     // => 31  
    window.myNumber; // => 20  

当 `sum(15, 16)` 被调用时，JavaScript 自动将 `this` 设置为全局对象，即 `window`。

当 `this` 在任何函数作用域以外调用时（最外层作用域：全局执行上下文环境），也会涉及到全局对象。

    console.log(this === window); // => true  
    this.myString = 'Hello World!';  
    console.log(window.myString); // => 'Hello World!'  
    
    <!-- 在 HTML 文件里 -->  
    <script type="text/javascript">  
       console.log(this === window); // => true
    </script>  

#### 严格模式下，函数调用中的 `this`

> 在严格模式下的函法调用，`this` 代表 `undefined`。

严格模式由 [ECMAScript 5.1](http://www.ecma-international.org/ecma-262/5.1/#sec-10.1.1) 引进，用来限制 JavaScript 的一些异常处理，提供更好的安全性和更强壮的错误检查机制。使用严格模式，只需要将 `'use strict'` 置于函数体的顶部。这样就可以将上下文环境中的 `this` 转为 `undefined`。这样执行上下文环境不再是全局对象，与非严格模式刚好相反。

在严格模式下执行函数的一个例子：

    function multiply(a, b) {  
      'use strict'; // 开启严格模式
      console.log(this === undefined); // => true
      return a * b;
    }
    // 严格模式下的函数调用 multiply() 
    // this 在 multiply() 中为 undefined
    multiply(2, 5); // => 10 

当 `multiply(2, 5)` 执行时，这个函数中的 `this` 是 `undefined`。

严格模式不仅在当前作用域起到作用，它还会影响内部作用域，即内部声明的一切内部函数的作用域。

    function execute() {  
       'use strict'; // 开启严格模式
       function concat(str1, str2) {
         // 内部函数也是严格模式
         console.log(this === undefined); // => true
         return str1 + str2;
       }
       // 在严格模式下调用 concat()
       // this 在 concat() 下是 undefined
       concat('Hello', ' World!'); // => "Hello World!"
    }
    execute();  

`use strict` 被插入函数执行主体的顶部，使严格模式可以控制到整个作用域。因为 `concat` 在执行作用域内部声明，因此它继承了严格模式。此外，`concat('Hello', ' World!')` 的调用中，`this` 也会成为 `undefined`。

一个简单的 JavaScript 文件可能同时包含严格模式和非严格模式，所以在同一种类型调用中，可能也会有不同的上下文行为差异。

    function nonStrictSum(a, b) {  
      // 非严格模式
      console.log(this === window); // => true
      return a + b;
    }
    function strictSum(a, b) {  
      'use strict';
      // 严格模式
      console.log(this === undefined); // => true
      return a + b;
    }
    // nonStrictSum() 在非严格模式下被调用
    // this 在 nonStrictSum() 中是 window 对象
    nonStrictSum(5, 6); // => 11  
    // strictSum() 在严格模式下被调用
    // this 在 strictSum() 中是 undefined
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
           // 严格模式下， this 是 window or undefined
           console.log(this === numbers); // => false
           return this.numberA + this.numberB;
         }
         return calculate();
       }
    };
    numbers.sum(); // => 严格模式下，结果为 NaN 或者 throws TypeError  

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
         // 使用 .call() 方法修改上下文环境
         return calculate.call(this);
       }
    };
    numbers.sum(); // => 15  

`calculate.call(this)` 同样执行 `calculate` 函数，但是格外的添加了 `this`作为第一个参数，修改了上下文执行环境。此时的 `this.numberA + this.numberB` 等同于 `numbers.numberA + numbers.numberB`，其最终的结果就会如期盼的一样为 `result 5 + 10 = 15`。

### 方法调用

方法是作为一个对象属性存储的函数，举个例子：

    var myObject = {  
      // helloFunction 是对象中的方法
      helloFunction: function() {
        return 'Hello World!';
      }
    };
    var message = myObject.helloFunction();  

`helloFunction` 是属于 `myObject` 的一个方法，调用这个方法可以使用属性访问的方式 `myObject.helloFunction`。

方法调用表现为对象属性访问的形式，支持传入用成对引号包裹起来的一系列参数。上个例子中，`myObject.helloFunction()` 其实就是对象 `myObject` 上对属性 `helloFunction` 的方法调用。同样，`[1, 2].join(',')` 和 `/\s/.test('beautiful world')` 都是方法调用。

区分函数调用和方法调用是非常重要的，它们是不同类型的调用方式。主要的差别在于方法调用为访问属性的形式，如：`<expression>.functionProperty()` 或者 `<expression>['functionProperty']()`，而函数调用不存在 `<expression>()`。

    ['Hello', 'World'].join(', '); // 方法调用
    ({ ten: function() { return 10; } }).ten(); // 方法调用
    var obj = {};  
    obj.myFunction = function() {  
      return new Date().toString();
    };
    obj.myFunction(); // 方法调用

    var otherFunction = obj.myFunction;  
    otherFunction();     // 函数调用  
    parseFloat('16.60'); // 函数调用  
    isNaN(0);            // 函数调用  

#### 方法调用中的 `this`

> `this` 在方法调用中指向的是拥有该方法的对象

当在一个对象里调用方法时，`this` 代表的是对象它自身。让我们创建一个对象，其包含一个可以递增属性的方法。

    var calc = {  
      num: 0,
      increment: function() {
        console.log(this === calc); // => true
        this.num += 1;
        return this.num;
      }
    };
    // 方法调用，this 指向 calc
    calc.increment(); // => 1  
    calc.increment(); // => 2  

`calc.increment()` 调用意味着上下文执行环境在 `calc` 对象里，因此使用 `this.sum` 递增 `num` 这个属性是可行的。

一个 JavaScript 对象继承方法来自于它自身的属性。当一个被继承方法在对象中调用时，上下文执行环境同样是对象本身。

    var myDog = Object.create({  
      sayName: function() {
         console.log(this === myDog); // => true
         return this.name;
      }
    });
    myDog.name = 'Milo';  
    // 方法调用， this 指向 myDog
    myDog.sayName(); // => 'Milo'  

`Object.create()` 创建了一个新的对象 `myDog` 并且设置了属性，`myDog` 对象继承了 `myName`方法。当 `myDog.sayName()` 被执行时，上下文执行环境指向 `myDog`。

在 ECMAScript 5 的 `class` 语法中， 方法调用指的是实例本身。

    class Planet {  
      constructor(name) {
        this.name = name;    
      }
      getName() {
        console.log(this === earth); // => true
        return this.name;
      }
    }
    var earth = new Planet('Earth');  
    // 方法调用，上下文为 earth
    earth.getName(); // => 'Earth'  

#### 陷阱：方法会分离它自身的对象

一个对象中的方法可能会被提取抽离成一个变量。当使用这个变量调用方法时，开发者可能会误认为 `this` 指向的还是定义该方法时的对象。

如果方法调用不依靠对象，那么就是一个函数调用，即 `this` 指向全局对象 `object` 或者在严格模式下为 `undefined`。创建函数绑定可以修复上下文，使该方法被正确对象调用。

下面的例子创建了构造器函数 `Animal` 并且创建了一个实例 `myCat`，在 `setTimeout()` 定时器 1s 后打印 `myCat` 对象信息。

    function Animal(type, legs) {  
      this.type = type;
      this.legs = legs;  
      this.logInfo = function() {
        console.log(this === myCat); // => false
        console.log('The ' + this.type + ' has ' + this.legs + ' legs');
      }
    }
    var myCat = new Animal('Cat', 4);  
    // 打印出 "The undefined has undefined legs"
    // 或者在严格模式下抛出错误 TypeError
    setTimeout(myCat.logInfo, 1000);  

开发者可能认为在 `setTimeout` 下调用 `myCat.logInfo()` 会打印出 `myCat` 对象的信息。但实际上这个方法被分离了出来作为了参数传入函数内 `setTimeout(myCat.logInfo)`，然后 1s 后会发生函数调用。当 `logInfo` 被作为函数调用时，`this` 指向全局对象 `object` 或者在严格模式下为 `undefined`，因此对象信息没有正确地被打印。

方法绑定可以使用 `.bind()` 方法。如果被分离的方法绑定了 `myCat` 对象，那么上下文问题就可以被解决了：

    function Animal(type, legs) {  
      this.type = type;
      this.legs = legs;  
      this.logInfo = function() {
        console.log(this === myCat); // => true
        console.log('The ' + this.type + ' has ' + this.legs + ' legs');
      };
    }
    var myCat = new Animal('Cat', 4);  
    // 打印 "The Cat has 4 legs"
    setTimeout(myCat.logInfo.bind(myCat), 1000); 

此时，`myCat.logInfo.bind(myCat)` 返回的新函数调用里的 `this` 指向了 `myCat`。
