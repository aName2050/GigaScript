**File extension:** `.g`

# Syntax
GigaScript has very simple syntax, similar to those of other popular languages.
## Variables

A variable can hold any value supported by GigaScript.

### Declaring Mutable Variables
```gigascript
let varName = value;
```
`varName` can be any name you want, but must follow the following requirements:
- Cannot start with a number
- Must start a **letter** or an **underscore "_"**.
`value` can be any value you want that is supported by GigaScript.
```gigascript
let anotherVar;
```
Mutable variables do not need to have a variable assigned when they are declared.

> [!IMPORTANT]
> All variable declarations must end with a semicolon ";".

### Declaring Constant Variables
```gigascript
const varName = value;
```
`varName` can be any name you want, but must follow the following requirements:
- Cannot start with a number
- Must start a **letter** or an **underscore "_"**.
`value` can be any value you want that is supported by GigaScript.

> [!IMPORTANT]
> Constant variables must have a value when declared.

### Reassigning Mutable Variables
> [!CAUTION]
> Constant variables cannot be reassigned!
```gigascript
varName = newValue
```
> [!NOTE]
> Reassignments shouldn't end with a semicolon ";".

### Accessing Variables
To access a variable, simply reference it using the variable name.

```gigascript
varName
```
`varName` should be the name of your variable. You can use `varName` anywhere in your code. For examples, see [examples](https://github.com/aName2050/GigaScript/wiki/GigaScript#Examples).

## Functions

Functions are very useful when you want to repeat the same task multiple times in different parts of your code.

### Declaring Functions

```gigascript
func funcName(params) {
    *code*
}
```
`funcName` could be any name following these naming rules:
- Cannot start with a number
- Must start a **letter** or an **underscore "_"**.
`params` can be any length of parameters you need passed into your function, or no parameters at all, following the same naming rules as above.

To return a value in a function, simply reference the value on the **last line of the function**.

### Calling Functions

```gigascript
funcName(params)
```
`funcName` could be any name following these naming rules:
- Cannot start with a number
- Must start a **letter** or an **underscore "_"**.
`params` can be any length of parameters you need passed into your function, or no parameters at all, following the same naming rules as above.

## Classes

### Declaring a new Class

```gigascript
class ClassName(){
   public publicProp = "this can be any value";
   private privateProp = "this can be any value but can't be accessed outside of the class";

   public publicMethod(params){
      code (See [Functions](https://github.com/aName2050/GigaScript/wiki/GigaScript-Documentation#Functions) for more info on functions.)
   }

   private privateMethod(params){
      code (See [Functions](https://github.com/aName2050/GigaScript/wiki/GigaScript-Documentation#Functions) for more info on functions.)
   }
}
```
`ClassName` can be any name, while still following these naming rules:
- Cannot start with a number
- Must start a **letter** or an **underscore "_"**.
`public` properties and methods can be accessed when a new class instance is created.
`private` properties and methods cannot be accessed when a new class instance is created.

### Creating a new Instance of a Class

```gigascript
let className = new ClassName();
```
`ClassName` is the name of your class.
`new ClassName()` will create a new object containing all the class's public properties and methods.

### Accessing a Class's Public Properties and Methods

1. Create a new instance of the class and set it as the value of any [variable](https://github.com/aName2050/GigaScript/wiki/GigaScript-Documentation#Variables).
```gigascript
let aCoolClass = new ClassName();
```
2. Access the public properties and methods of the class as if you were accessing the properties of an object.
```gigascript
aCoolClass.publicProp
aCoolClass.publicMethod(params)
```

## Conditional Statements
`condition` is where you would check if a condition is true. See [examples](https://github.com/aName2050/GigaScript/wiki/GigaScript-Documentation#Examples).

### If Statement

```gigascript
if(condition) {
   code
}
```

### If-Else Statement

```gigascript
if(condition) {
   code
} else {
   code
}
```

### If-Else If-...-Else Statement

```gigascript
if(condition) {
   code
} else if (other_condition) {
   code
} else {
   code
}
```

> [!TIP]
> You don't need to include an `else` statement in every conditional statement.

## While Loops
`while` loops are useful when you need to iterate over something a certain amount of times, or `while` a condition is true.

### Creating a While Loop

```gigascript
while(condition){
   code
}
```
`condition` is any conditional statement that would return either `true` or `false`.

> [!CAUTION]
> It is not recommended to set `condition` to always be true, `condition` should eventually become `false` to prevent your program from becoming unstable and crashing.

## For Loops
`for` loops are useful when you need to iterate over something a variable amount of times.

### Creating a For Loop

```gigascript
for(initializer; condition; modifier) {
   code
}
```
`initializer` sets a [variable](https://github.com/aName2050/GigaScript/wiki/GigaScript-Documentation#Variables).
`condition` compares the `initializer` to a condition and continues to `code` if it returns `true`.
`modifier` modifies the `initializer` after the `for` loop finishes an iteration.

## Imports
Importing code from other GigaScript files is useful when creating large projects.

### Importing a Variable or Function

```gigascript
import aVariable from "relative/path/to/file.g"
import aFunction from "relative/path/to/file.g"
```
`aVariable` and `aFunction` is the variable or function you want to import. "relative/path/to/file.g" is the path to the file, relative to the parent directory.

> [!CAUTION]
> When writing out the file path to the file, only relative paths are supported.
> Do not include a "./" at the beginning as that will result in an error.

> [!NOTE]
> You can only import one variable/function from each file at a time, to import multiple variables/functions, use a separate `import` statement.

## Exports
Exporting variables and functions is needed to use the `import` statement.

### Exporting a Variable or Function

```
let aVariable = "a value";
func aFunction(params){
   code
}

export aVariable;
export aFunction;
```
`aVariable` and `aFunction` is the variable or function you want to export. An `export` statement can only export one value at a time.

> [!IMPORTANT]
> You **cannot** export a value that is **not** a variable or function.

# Reserved Tokens
These are tokens reserved for GigaScript that can't be used as the name of classes, functions, or variables.

> [!NOTE]
> You can use any of the reserved tokens when used inside of a string.

## Reserved Keywords

```
let
const
func
class
true
false
undefined
new
null
private
public
if
else
while
for
continue
break
import
export
from
try
catch
print
math
timestamp
format
```

> [!CAUTION]
> Using any of these keywords as a class, function, or variable identifier **will** result in an error!

## Reserved Symbols

```
>
<
==
!=
!
&&
||
"
+
-
*
/
%
=
```

# Examples
You can see examples for GigaScript in this section. You can run these examples by copying the code in a `.g` file and then [running the file](https://github.com/aName2050/GigaScript/wiki/Run-GigaScript-or-GigaScript%E2%80%90X)

## Variables

### Example Script 1
```gigascript
let x = 32;
const aCoolObject = { x, z: 64, complex: { foo: "bar" } };

x = x * 2

print(x)
print(aCoolObject.complex)
```
`print(x)` should output `64`.
`print(aCoolObject.complex)` should output `{ foo: "bar" }`.

### How Example Script 1 Works

1. **Declare** a **mutable** variable called `x` with the value of `32`.
2. **Declare** a **constant** variable called `aCoolObject` with the value of { x, z: 64, complex: { foo: "bar" } }`.
3. **Reassign** the variable `x` to the result of `x` multiplied by 2, which should result in `64`.
4. **Print** the value of `x` to the console. Prints `64`.
5. **Print** the value of `aCoolObject.complex` to the console. Prints `{ foo: "bar" }`.
    * The `complex` property of `aCoolObject` is accessed and passed into the `print` function.

## Functions

### Example Script 2

```gigascript
func add(x, y){
   const result = x + y;
   result
}

print(add(1, 2))
```
`print(add(1, 2))` should output `3`.

### How Example Script 2 Works

1. **Declare** a function called `add` with parameters `x` and `y`.
2. Inside the function...
   1. **Declare** a **constant** variable called `result` with the value of `x` and `y` added together.
   2. **Return** the value of `result`. 
3. **Print** the result of adding `1` and `2` to the console. Prints `3`.

## Classes

### Example Script 3

```gigascript
class Person {
   public fname = "John";
   public lname = "Doe";

   public getName() {
      const fullName = fname + " " + lname;
      fullName
   }
}

const human = new Person();

print(human.getName())
```
`print(human.getName())` should output `"John Doe"`.

### How Example Script 3 Works

1. **Declare** a class called `Person`.
2. Inside the class...
   1. **Declare** a **public property** called `fname` with the value of `"John"`.
   2. **Declare** a **public property** called `lname` with the value of `"Doe"`.
   3. **Declare** a **public method** called `getName` with no parameters.
   4. Inside the method...
      1. **Declare** a **constant** variable with the name of `fullName` with the result of combining the strings `"John"`, `" "`, and `"Doe"`.
      2. **Return** the value of `fullName`.
3. **Declare** a **constant** variable called `human`.
   1. **Create** a **new** _instance_ of the class `Person`.
   2. **Assign** the returned **object value** to the variable `human`.
4. **Print** the result of calling `human.getName()`. Prints `"John Doe"`.
   * The `getName` method in the variable `human` is called.
   * The method returns the full name by combining the first name (`fname`) and the last name (`lname`).

## Conditionals

### Example Script 4

```gigascript
let passed = true;
let isTest = false;
let class = "computer science";

if(class == "computer science) {
   print("in computer science!")
   if(passed && !isTest) {
      print("passed the homework!")
   } else if (passed && isTest) {
      print("passed the test!")
   } else {
      print("failed")
   }
} else {
   print("This class isn't graded yet.")
}
```

### How Example Script 4 Works

1. **Declare** a **mutable** variable called `passed` with the value of `true`.
2. **Declare** a **mutable** variable called `isTest` with the value of `false`.
3. **Declare** a **mutable** variable called `class` with the value of `"computer science"`.
4. **Check** if `class` is **equal to** `"computer science"`.
   * If true...
      1. **Print** `"in computer science!"` to the console.
      2. **Check** if `passed` is `true` **and** the opposite of `isTest` is `true`
         * If true...
            1. **Print** `"passed the homework!"` to the console.
         * If not true
            1. **Check** if both `passed` and `isTest` is `true` instead.
               * If true
                  1. **Print** `"passed the test!"` to the console.
         * If all other conditions return `false`...
            1. **Print** `"failed"` to the console.
    * If false...
       1. **Print** `"This class isn't graded yet."` to the console.

## While

### Example Script 5

```gigascript
const max = 10;

while(max > 0) {
   print(max)
   max = max - 1
}
```
This should output:
```
10
9
8
7
6
5
4
3
2
1
```
to the console.

### How Example Script 5 Works

1. **Declare** a **constant** variable called `max` with the value of `10`.
2. **Create** a `while` loop with the condition `max > 0`. You would read this as "while `max` is greater than `0`, do..."
3. Inside the `while` loop...
   1. **Print** the value of `max` to the console.
   2. **Reassign** the value of `max` to the result of the value of `max` minus `1`.

## For

### Example Script 6

```gigascript
for(let i = 0; i < 5; i = i + 1) {
   print(i)
}
```
This should output:
```
1
2
3
4
5
```
to the console.

### How Example Script 6 Works

1. **Create** a `for` loop with the **initializer** `let i = 0`, the **condition** `i < 5`, and the **modifier** of `i = i + 1`.
   * The **initializer** is usually a **mutable** variable set to a specific value.
      * **Declare** a **mutable** variable called `i` with the value of `0`.
   * The **condition** usually **checks** if the **initializer** meets a certain condition.
      * **Check** if `i` is **less than** `5`
         * If true...
            * Continue running the loop
         * If false...
            * End the loop
   * The **modifier** usually modifies the value of the **initializer**.
      * After the loop **finishes** an iteration...
         * **Reassign** the value of `i` to the result of adding `1` to the value of `i`.
2. Inside the `for` loop
   1. **Print** the value of `i` to the console.

## Import & Export

### Example Script 7

_main.g_
```gigascript
import x from "anotherFile.g"

print(x)
```

_anotherFile.g_
```gigascript
const x = 10;

export x;
```
`print(x)` should output `10`.

### How Example Script 7 Works

_main.g_
1. **Import** the **variable** `x` from `anotherFile.g`.
2. **Print** the value of `x` to the console. Prints `10`.

_anotherFile.g_
1. **Declare** a **constant** variable called `x` with the value `10`.
2. **Export** the **variable** `x`.

