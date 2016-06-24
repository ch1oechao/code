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

---

### 1. 迷之 `this` 

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

### 2. 函数调用

**函数调用** 代表了该函数接收以成对的引号包含，用逗号分隔的不同参数组成的表达式。举例：`parseInt('18')`。这个表达式不能是属性访问如 `myObject.myFunction` 这样会造成方法调用。`[1, 5].join(',')` 同样也不是一个函数调用而是方法调用。

函数调用的一个简单例子：

```JavaScript 
    function hello(name) {
      return 'Hello' + name + '!';
    }
    // 函数调用
    var message = hello('World');
    console.log(message); // => 'Hello World!'
```
`hello('World')` 是一个函数调用：`hello`表达式代表了一个函数对象，接受了用成对引号包含的 `World` 参数。

高级一点的例子，立即执行函数 IIFE (immediately-invoked function expression)：

```JavaScript 
    var message = (function(name) {  
      return 'Hello ' + name + '!';
    })('World');
    console.log(message) // => 'Hello World!' 
```

#### 2.1. 函数调用中的 `this`

> `this` is the **global object** in a function invocation

全局对象取决于当前执行环境，在浏览器中，全局对象即 `window`。

在函数调用中，上下文执行环境是全局对象，可以在以下函数中验证上下文：

```JavaScript 
    function sum(a, b) {  
      console.log(this === window); // => true
      this.myNumber = 20; // 在全局对象中添加 'myNumber' 属性
      return a + b;
    }
    // sum() 为函数调用
    // this 在 sum() 中是全局对象 (window)
    sum(15, 16);     // => 31  
    window.myNumber; // => 20  
```
当 `sum(15, 16)` 被调用时，JavaScript 自动将 `this` 设置为全局对象，即 `window`。

当 `this` 在任何函数作用域以外调用时（最外层作用域：全局执行上下文环境），也会涉及到全局对象。
   
```JavaScript 
    console.log(this === window); // => true  
    this.myString = 'Hello World!';  
    console.log(window.myString); // => 'Hello World!'  
```
```HTML
    <!-- 在 HTML 文件里 -->  
    <script type="text/javascript">  
      console.log(this === window); // => true
    </script>  
```

#### 2.2. 严格模式下，函数调用中的 `this`

> `this` is **undefined** in a function invocation in strict mode

严格模式由 [ECMAScript 5.1](http://www.ecma-international.org/ecma-262/5.1/#sec-10.1.1) 引进，用来限制 JavaScript 的一些异常处理，提供更好的安全性和更强壮的错误检查机制。使用严格模式，只需要将 `'use strict'` 置于函数体的顶部。这样就可以将上下文环境中的 `this` 转为 `undefined`。这样执行上下文环境不再是全局对象，与非严格模式刚好相反。

在严格模式下执行函数的一个例子：

```JavaScript 
    function multiply(a, b) {  
      'use strict'; // 开启严格模式
      console.log(this === undefined); // => true
      return a * b;
    }
    // 严格模式下的函数调用 multiply() 
    // this 在 multiply() 中为 undefined
    multiply(2, 5); // => 10 
```
当 `multiply(2, 5)` 执行时，这个函数中的 `this` 是 `undefined`。

严格模式不仅在当前作用域起到作用，它还会影响内部作用域，即内部声明的一切内部函数的作用域。

```JavaScript 

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
```

`use strict` 被插入函数执行主体的顶部，使严格模式可以控制到整个作用域。因为 `concat` 在执行作用域内部声明，因此它继承了严格模式。此外，`concat('Hello', ' World!')` 的调用中，`this` 也会成为 `undefined`。

一个简单的 JavaScript 文件可能同时包含严格模式和非严格模式，所以在同一种类型调用中，可能也会有不同的上下文行为差异。


```JavaScript 
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
```

#### 2.3. 陷阱：`this` 在内部函数中

一个常见的陷阱是理所应当的认为函数调用中的，内部函数中 `this` 等同于它的外部函数中的 `this`。

正确的理解是内部函数的上下文环境取决于调用环境，而不是外部函数的上下文环境。

为了获取到所期望的 `this`，应该利用间接调用修改内部函数的上下文环境，如使用 `.call()` 或者 `.apply` 或者创建一个绑定函数 `.bind()`。

下面的例子表示计算两个数之和：


```JavaScript 

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
```
`numbers.sum()` 是对象内的一个方法调用，因此 `sum` 的上下文是 `numbers` 对象，而 `calculate` 函数定义在 `sum` 函数内，所以会误以为在 `calculate` 内 `this` 也指向的是 `numbers`。

然而 `calculate()` 在函数调用（而不是作为方法调用）时，此时的 `this` 指向的是全局对象 `window` 或者在严格模式下指向 `undefined` ，即使外部函数 `sum` 拥有 `numbers`对象作上下文环境，它也没有办法影响到内部的 `this`。

`numbers.sum()` 调用的结果是 `NaN` 或者在严格模式下直接抛出错误 `TypeError: Cannot read property 'numberA' of undefined`，而绝非期待的结果 `5 + 10 = 15`，造成这样的原因是 `calculate` 并没有正确的被调用。

为了解决这个问题，正确的方法是使 `calculate` 函数被调用时的上下文同 `sum` 调用时一样，为了得到属性 `numberA` 和 `numberB`，其中一种办法是使用 `.call()` 方法。


```JavaScript 

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
```
`calculate.call(this)` 同样执行 `calculate` 函数，但是格外的添加了 `this`作为第一个参数，修改了上下文执行环境。此时的 `this.numberA + this.numberB` 等同于 `numbers.numberA + numbers.numberB`，其最终的结果就会如期盼的一样为 `result 5 + 10 = 15`。


### 3. 方法调用

方法是作为一个对象属性存储的函数，举个例子：

```JavaScript 

    var myObject = {  
      // helloFunction 是对象中的方法
      helloFunction: function() {
        return 'Hello World!';
      }
    };
    var message = myObject.helloFunction();  
```

`helloFunction` 是属于 `myObject` 的一个方法，调用这个方法可以使用属性访问的方式 `myObject.helloFunction`。

方法调用表现为对象属性访问的形式，支持传入用成对引号包裹起来的一系列参数。上个例子中，`myObject.helloFunction()` 其实就是对象 `myObject` 上对属性 `helloFunction` 的方法调用。同样，`[1, 2].join(',')` 和 `/\s/.test('beautiful world')` 都是方法调用。

区分函数调用和方法调用是非常重要的，它们是不同类型的调用方式。主要的差别在于方法调用为访问属性的形式，如：`<expression>.functionProperty()` 或者 `<expression>['functionProperty']()`，而函数调用不存在 `<expression>()`。

```JavaScript 

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
```


#### 3.1. 方法调用中的 `this`

> `this` is the **object that owns the method** in a method invocation

当在一个对象里调用方法时，`this` 代表的是对象它自身。让我们创建一个对象，其包含一个可以递增属性的方法。

```JavaScript 
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
```

`calc.increment()` 调用意味着上下文执行环境在 `calc` 对象里，因此使用 `this.sum` 递增 `num` 这个属性是可行的。

一个 JavaScript 对象继承方法来自于它自身的属性。当一个被继承方法在对象中调用时，上下文执行环境同样是对象本身。

```JavaScript 

    var myDog = Object.create({  
      sayName: function() {
        console.log(this === myDog); // => true
        return this.name;
      }
    });
    myDog.name = 'Milo';  
    // 方法调用， this 指向 myDog
    myDog.sayName(); // => 'Milo'  
```

`Object.create()` 创建了一个新的对象 `myDog` 并且设置了属性，`myDog` 对象继承了 `myName`方法。当 `myDog.sayName()` 被执行时，上下文执行环境指向 `myDog`。

在 ECMAScript 5 的 `class` 语法中， 方法调用指的是实例本身。

```JavaScript 

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
```


#### 3.2. 陷阱：方法会分离它自身的对象

一个对象中的方法可能会被提取抽离成一个变量。当使用这个变量调用方法时，开发者可能会误认为 `this` 指向的还是定义该方法时的对象。

如果方法调用不依靠对象，那么就是一个函数调用，即 `this` 指向全局对象 `object` 或者在严格模式下为 `undefined`。创建函数绑定可以修复上下文，使该方法被正确对象调用。

下面的例子创建了构造器函数 `Animal` 并且创建了一个实例 `myCat`，在 `setTimeout()` 定时器 1s 后打印 `myCat` 对象信息。

```JavaScript 
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
```
开发者可能认为在 `setTimeout` 下调用 `myCat.logInfo()` 会打印出 `myCat` 对象的信息。但实际上这个方法被分离了出来作为了参数传入函数内 `setTimeout(myCat.logInfo)`，然后 1s 后会发生函数调用。当 `logInfo` 被作为函数调用时，`this` 指向全局对象 `window` 或者在严格模式下为 `undefined`，因此对象信息没有正确地被打印。

方法绑定可以使用 `.bind()` 方法。如果被分离的方法绑定了 `myCat` 对象，那么上下文问题就可以被解决了：


```JavaScript 

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
```
此时，`myCat.logInfo.bind(myCat)` 返回的新函数调用里的 `this` 指向了 `myCat`。


### 4. 构造函数调用

构造函数调用使用 `new` 关键词，后面跟随可带参数的对象表达式，例：`new RegExp('\\d')`。

以下的例子声明了一个构造函数 `Country`，并调用。


```JavaScript 

    function Country(name, traveled) {  
      this.name = name ? this.name : 'United Kingdom';
      this.traveled = Boolean(traveled); // 转换为 boolean 值
    }
    Country.prototype.travel = function() {  
      this.traveled = true;
    };
    // 构造函数调用
    var france = new Country('France', false);  
    // 构造函数调用
    var unitedKingdom = new Country;

    france.travel(); // Travel to France 
```

`new City('Paris')` 是一个构造器调用，这个对象初始化使用了类中特殊的方法 `constructor`，其中的 `this` 指向的是新创建的对象。

构造器调用创建了一个空的新对象，从构造器的原型中继承属性。这个构造器函数的意义在于初始化对象，因此这个类型的函数调用创建实例。

当一个属性访问 `myObject.myFunction` 前拥有 `new` 关键词，那么 JavaScript 会执行构造器调用而不是方法调用。举个例子：`new myObject.myFunction()` 意味着首先这个函数会解析为一个属性访问函数 `extractedFunction = myObject.myFunction`，然后用构造器创建一个新对象 `new extractedFunction`。


#### 4.1. 在构造函数调用中的 `this`

> `this` is the **newly created object** in a constructor invocation

构造器调用的环境是新创建的对象。通过传递构造函数参数来初始化新建的对象，添加属性初始化值以及事件处理器。

让我们来验证以下这个例子的上下文环境：


```JavaScript 

    function Foo () {  
      console.log(this instanceof Foo); // => true
      this.property = 'Default Value';
    }
    // 构造函数调用
    var fooInstance = new Foo();  
    fooInstance.property; // => 'Default Value'  
```

`new Foo()` 建立构造器调用，它的上下文环境为 `fooInstance`，在 `Foo` 对象中初始化了 `this.property` 这个属性并赋予初始值。

在使用 `class` 语法时也是同样的情况（在 ES6 中），初始化只发生在它的 `constructor` 方法中。

```JavaScript 

    class Bar {  
      constructor() {
        console.log(this instanceof Bar); // => true
        this.property = 'Default Value';
      }
    }
    // 构造函数调用
    var barInstance = new Bar();  
    barInstance.property; // => 'Default Value' 
```

当执行 `new Bar()` 时，JavaScript 创建了一个空对象并且它的上下文环境为 `constructor` 方法，因此添加属性的办法是使用 `this` 关键词：`this.property = 'Default Value'`。


#### 4.2. 陷阱：忘记添加 `new` 关键词

一些 JavaScript 函数创建实例，不仅仅可以使用构造器的形式调用也可以利用函数调用，下面是一个 `RegExp` 的例子：

```JavaScript 

    var reg1 = new RegExp('\\w+');  
    var reg2 = RegExp('\\w+');

    reg1 instanceof RegExp;      // => true  
    reg2 instanceof RegExp;      // => true  
    reg1.source === reg2.source; // => true  
```

当执行 `new RegExp('\\w+')` 和 `RegExp('\\w+')` 时，JavaScript 创建了两个相等的普通表达式对象。

但是使用函数调用创建对象会产生潜在的问题(包括[工厂模式](http://javascript.info/tutorial/factory-constructor-pattern))，当失去了 `new` 关键词，一些构造器会取消初始化对象。

以下例子描述了这个问题：

```JavaScript 

    function Vehicle(type, wheelsCount) {  
      this.type = type;
      this.wheelsCount = wheelsCount;
      return this;
    }
    // 函数调用
    var car = Vehicle('Car', 4);  
    car.type;              // => 'Car'  
    car.wheelsCount // => 4  
    car === window  // => true 
```

`Vehicle` 是一个在对象上设置了 `type` 和 `wheelsCount` 属性的函数。

当执行了 `Vehicle('Car', 4)` 时，会返回对象 `car`，它拥有正确的属性值：`car.type` 指向 `Car`，`car.wheelsCount` 指向 `4`，开发者会误以为这样创建初始化对象没有什么问题。
然而，当前执行的是函数调用，因此 `this` 指向的是 `window` 对象，所以它设置的属性其实是挂在 `window` 对象上的，这样是完全错误的，它并没有创建一个新对象。

应该正确的执行方式是使用 `new` 关键词来保证构造器被正确调用：


```JavaScript 

    function Vehicle(type, wheelsCount) {  
      if (!(this instanceof Vehicle)) {
        throw Error('Error: Incorrect invocation');
      }
      this.type = type;
      this.wheelsCount = wheelsCount;
      return this;
    }
    // 构造函数调用
    var car = new Vehicle('Car', 4);  
    car.type                      // => 'Car'  
    car.wheelsCount        // => 4  
    car instanceof Vehicle // => true

    // 函数调用，会报错。
    var brokenCat = Vehicle('Broken Car', 3); 
```

`new Vehicle('Car', 4)` 可以正确运行：一个新的对象被创建和初始化，因为 `new` 关键词代表了当前为构造器调用。
在构造器函数中添加验证：`this instanceof Vehicle`，可以保证当前的执行上下文是正确的对象类型。如果 `this` 不是指向 `Vehicle`，那么就存在错误。 如果 `Vehicle('Broken Car', 3)` 表达式没有 `new` 关键词而被执行，就会抛出错误：`Error: Incorrect invocation`。


### 5. 间接调用

间接调用表现为当一个函数使用了 `.call()` 或者 `.apply()` 方法。

在 JavaScript 中，函数为一等对象，这意味着函数是一个对象，对象类型即为 `Function`。
在[函数的一系列方法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function#Methods)中，`.call()` 和 `.apply()` 被用来配置当前调用的上下文环境。

方法 `.call(thisArg[, arg1[, arg2[, ...]]])` 接收第一个参数 `thisArg` 作为执行的上下文环境，以及一系列参数 `arg1, arg2, ...`作为函数的传参被调用。
并且，方法 `.apply(thisArg, [args])` 接收 `thisArg`作为上下文环境，剩下的参数可以用类数组对象 `[args]` 传递。

间接调用的例子：

```JavaScript 

    function increment(number) {  
      return ++number;  
    }
    increment.call(undefined, 10);    // => 11  
    increment.apply(undefined, [10]); // => 11  
```

`increment.call()` 和 `increment.apply()` 同时传递了参数 `10` 调用 `increment` 函数。

两个方法最主要的区别为 `.call()` 接收一组参数，如 `myFunction.call(thisValue, 'value1', 'value2')`，而 `.apply()` 接收一串参数作为类数组对象传递，如 `myFunction.apply(thisValue, ['value1', 'value2'])`。


#### 5.1. 间接调用中的 `this`

> `this` is the **first argument** of `.call()` or `.apply()` in an indirect invocation

很明显，在间接调用中，`this` 指向的是 `.call()` 和 `.apply()`传递的第一个参数。


```JavaScript 

    var rabbit = { name: 'White Rabbit' };  
    function concatName(string) {  
      console.log(this === rabbit); // => true
      return string + this.name;
    }
    // 间接调用
    concatName.call(rabbit, 'Hello ');  // => 'Hello White Rabbit'  
    concatName.apply(rabbit, ['Bye ']); // => 'Bye White Rabbit'  
```

当函数执行需要特别指定上下文时，间接调用非常有用，它可以解决函数调用中的上下文问题（`this` 指向 `window` 或者严格模式下指向 `undefined`），同时也可以用来模拟方法调用对象。

另一个实践例子为，在 ES5 中的类继承中，调用父级构造器。


```JavaScript 

    function Runner(name) {  
      console.log(this instanceof Rabbit); // => true
      this.name = name;  
    }
    function Rabbit(name, countLegs) {  
      console.log(this instanceof Rabbit); // => true
      // 间接调用，调用了父级构造器
      Runner.call(this, name);
      this.countLegs = countLegs;
    }
    var myRabbit = new Rabbit('White Rabbit', 4);  
    myRabbit; // { name: 'White Rabbit', countLegs: 4 }  
```

`Runner.call(this, name)` 在 `Rabbit` 里间接调用了父级方法初始化对象。


### 6. 绑定函数调用

绑定函数调用是将函数绑定一个对象，它是一个原始函数使用了 `.bind()` 方法。原始绑定函数共享相同的代码和作用域，但是在执行时拥有不同的上下文环境。

方法 `.bind(thisArg[, arg1[, arg2[, ...]]])` 接收第一个参数 `thisArg` 作为绑定函数在执行时的上下文环境，以及一组参数 ` arg1, arg2, ...` 作为传参传入函数中。 它返回一个新的函数，绑定了 `thisArg`。

下列代码创建了一个绑定函数并在之后被调用：


```JavaScript 

    function multiply(number) {  
      'use strict';
      return this * number;
    }
    // 创建绑定函数，绑定上下文2
    var double = multiply.bind(2);  
    // 调用间接调用
    double(3);  // => 6  
    double(10); // => 20
```

`multiply.bind(2)` 返回一个新的函数对象 `double`，它绑定了数字 `2`。`multiply` 和 `double` 函数拥有相同的代码和作用域。

对比方法 `.apply()` 和 `.call()`，它俩都立即执行了函数，而 `.bind()` 函数返回了一个新方法，绑定了预先指定好的 `this` ，并可以延后调用。


#### 6.1. 绑定函数中的 `this`

> `this` is the **first argument** of `.bind()` when invoking a bound function


`.bind()` 方法的作用是创建一个新的函数，执行时的上下文环境为 `.bind()` 传递的第一个参数，它允许创建预先设置好 `this` 的函数。

让我们来看看在绑定函数中如何设置 `this` ：


```JavaScript 

    var numbers = {  
      array: [3, 5, 10],
      getNumbers: function() {
        return this.array;    
      }
    };
    // 创建一个绑定函数
    var boundGetNumbers = numbers.getNumbers.bind(numbers);  
    boundGetNumbers(); // => [3, 5, 10]  
    // 从对象中抽取方法
    var simpleGetNumbers = numbers.getNumbers;  
    simpleGetNumbers(); // => undefined 或者严格模式下抛出错误
```
`numbers.countNumbers.bind(numbers)` 返回了绑定 `numbers` 对象的函数 `boundGetNumbers`，它在调用时的 `this` 指向的是 `numbers` 并且返回正确的数组对象。

`.bind()` 创建了一个永恒的上下文链并不可修改。一个绑定函数即使使用 `.call()` 或者 `.apply()`传入其他不同的上下文环境，也不会更改它之前连接的上下文环境，重新绑定也不会起任何作用。
只有在构造器调用时，绑定函数可以改变上下文，然而这并不是特别推荐的做法。

下面这个例子声明了一个绑定函数，然后试图更改其预定上下文的情况：


```JavaScript 

    function getThis() {  
      'use strict';
      return this;
    }
    var one = getThis.bind(1);  
    // 绑定函数调用
    one(); // => 1  
    // 使用 .apply() 和 .call() 绑定函数
    one.call(2);  // => 1  
    one.apply(2); // => 1  
    // 重新绑定
    one.bind(2)(); // => 1  
    // 利用构造器方式调用绑定函数
    new one(); // => Object  
```

只有 `new one()` 时可以改变绑定函数的上下文环境，其他类型的调用结果是 `this` 永远指向 `1`。


### 7. 箭头函数

箭头函数的设计意图是以精简的方式创建函数，并绑定定义时的上下文环境。


```JavaScript 

    var hello = (name) => {  
      return 'Hello ' + name;
    };
    hello('World'); // => 'Hello World'  
    // 保留偶数
    [1, 2, 5, 6].filter(item => item % 2 === 0); // => [2, 6]
```

箭头函数使用了轻便的语法，去除了关键词 `function` 的书写，甚至当函数只有一个句子时，可以省去 `return` 不写。

箭头函数是匿名的，意味着函数的属性 `name` 是一个空字符串 `''`，它没有一个词汇式的函数名，意味着不利于使用递归或者解除事件处理。

同时它不同于普通函数，它不提供 `arguments` 对象，在 ES6 中可以用另外的参数代替：


```JavaScript 

    var sumArguments = (...args) => {  
      console.log(typeof arguments); // => 'undefined'
      return args.reduce((result, item) => result + item);
    };
    sumArguments.name      // => ''  
    sumArguments(5, 5, 6); // => 16  
```


#### 7.1. 箭头函数中的 `this`

> `this` is the **enclosing** context where the arrow function is defined

箭头函数并不创建它自身执行的上下文，使得 `this` 取决于它在定义时的外部函数。

下面的例子表示了上下文的透明属性：


```JavaScript 

    class Point {  
      constructor(x, y) {
        this.x = x;
        this.y = y;
      }
      log() {
        console.log(this === myPoint); // => true
        setTimeout(()=> {
          console.log(this === myPoint);      // => true
          console.log(this.x + ':' + this.y); // => '95:165'
        }, 1000);
      }
    }
    var myPoint = new Point(95, 165);  
    myPoint.log(); 
```

`setTimeout` 调用了箭头函数，它的上下文和 `log()`方法一样都是 `myPoint` 对象。
可以看出来，箭头函数“继承”了它在定义时的函数上下文。

如果尝试在上述例子中使用正常函数，那么它会创建自身的作用域（`window` 或者严格模式下 `undefined`）。因此，要使同样的代码可以正确运行就必须人工绑定上下文，即 `setTimeout(function() {...}.bind(this))`。使用箭头函数就可以省略这么详细的函数绑定，用更加干净简短的代码绑定函数。

如果箭头函数在最外层作用域定义，那么上下文环境将永远是全局对象，一般来说在浏览器中即为 `window`。


```JavaScript 

    var getContext = () => {  
      console.log(this === window); // => true
      return this;
    };
    console.log(getContext() === window); // => true  
```
箭头函数一次绑定上下文后便不可更改，即使使用了上下文更改的方法：

```JavaScript 

    var numbers = [1, 2];  
    (function() {  
      var get = () => {
        console.log(this === numbers); // => true
        return this;
      };
      console.log(this === numbers); // => true
      get(); // => [1, 2]
      // 箭头函数使用 .apply() 和 .call()
      get.call([0]);  // => [1, 2]
      get.apply([0]); // => [1, 2]
      // Bind
      get.bind([0])(); // => [1, 2]
    }).call(numbers);
```

函数表达式可以间接调用 `.call(numbers)` 让 `this` 指向 `numbers`，然而 `get` 箭头函数的 `this` 也是指向 `numbers` 的， 因为它绑定了定义时的外部函数。

无论怎么调用 `get` 函数，它的初始化上下文始终是 `numbers`，间接地调用其他上下文（使用 `.call()` 或者 `.apply()`），或者重新绑定上下文（使用 `.bind()`）都没有任何作用。

箭头函数不可以用作构造器，如果使用 `new get()` 作构造器调用，JavaScript 会抛出错误：`TypeError: get is not a constructor`。


#### 7.2. 陷阱：使用箭头函数定义方法

开发者可能会想使用箭头函数在对象中声明方法，箭头函数的声明(`(param) => {...}`)要比函数表达式的声明（`function(param) {...}`）简短的多。

下面的例子在类 `Period` 中 使用箭头函数定义了方法 `format()`：

```JavaScript 

    function Period (hours, minutes) {  
      this.hours = hours;
      this.minutes = minutes;
    }
    Period.prototype.format = () => {  
      console.log(this === window); // => true
      return this.hours + ' hours and ' + this.minutes + ' minutes';
    };
    var walkPeriod = new Period(2, 30);  
    walkPeriod.format(); // => 'undefined hours and undefined minutes' 
```

当 `format` 是一个箭头函数， 且被定义在全局环境下，它的 `this` 指向的是 `window` 对象。

即使 `format` 执行的时候挂载在对象上 `walkPeriod.format()`，`window` 对象依旧存在在调用的上下文环境中。这是因为箭头函数拥有静态的上下文环境，不会因为不同的调用而改变。

`this` 指向的是 `window`，因此 `this.hour` 和 `this.minutes` 都是 `undefined`。方法返回的结果为：`'undefined hours and undefined minutes'`。

正确的函数表达式可以解决这个问题，因为普通函数可以改变调用时的上下文环境：

```JavaScript 

    function Period (hours, minutes) {  
      this.hours = hours;
      this.minutes = minutes;
    }
    Period.prototype.format = function() {  
      console.log(this === walkPeriod); // => true
      return this.hours + ' hours and ' + this.minutes + ' minutes';
    };
    var walkPeriod = new Period(2, 30);  
    walkPeriod.format(); // => '2 hours and 30 minutes'  
```

`walkPeriod.format()` 是一个在对象中的方法调用，它的上下文环境为 `walkPeriod`，`this.hours` 指向 `2`，`this.minutes` 指向 `30`，因此可以返回正确的结果：`'2 hours and 30 minutes'`。 

### 8. 结论

因为函数调用会极大地影响到 `this`，所以从现在开始不要直接问自己：

> `this` 是从哪里来的？

而是要开始思考：

> 当前函数是怎么被调用的？

遇到箭头函数时，考虑：

> 当箭头函数被定义时，`this` 是指向什么？

以上思路可以帮助开发者减少判断 `this` 带来的烦恼。

如果你有关于上下文陷阱更加有趣的案例或者遇到一些棘手的情况欢迎评论，一起讨论！

---

后记：

英文文档有时候更容易理解，翻译成中文反而怪怪的

以后还是多读读英文原文档，翻译就当练手吧...orz
