**File extension:** `.gsx`

# Syntax
GigaScript-X has very cool syntax, similar to that of modern slang (mostly Gen-Z).
## Variables

A variable can hold any value supported by GigaScript-X.

### Declaring Mutable Variables
```gigascript-x
lit varName be value rn
```
`varName` can be any name you want, but must follow the following requirements:
- Cannot start with a number
- Must start a **letter** or an **underscore "_"**.
`value` can be any value you want that is supported by GigaScript-X.
```gigascript-x
lit anotherVar rn
```
Mutable variables do not need to have a variable assigned when they are declared.

> [!IMPORTANT]
> All variable declarations must end with the `rn` keyword.

### Declaring Constant Variables
```gigascript-x
bro varName be value rn
```
`varName` can be any name you want, but must follow the following requirements:
- Cannot start with a number
- Must start a **letter** or an **underscore "_"**.
`value` can be any value you want that is supported by GigaScript-X.

> [!IMPORTANT]
> Constant variables must have a value when declared.

### Reassigning Mutable Variables
> [!CAUTION]
> Constant variables cannot be reassigned!
```gigascript-x
varName be newValue
```
> [!NOTE]
> Reassignments shouldn't end with the `rn` keyword.

### Accessing Variables
To access a variable, simply reference it using the variable name.

```gigascript-x
varName
```
`varName` should be the name of your variable. You can use `varName` anywhere in your code. For examples, see [examples](https://github.com/aName2050/GigaScript/wiki/GigaScript-X-Documentation#Examples).

## Functions

Functions are very useful when you want to repeat the same task multiple times in different parts of your code.

### Declaring Functions

```gigascript-x
bruh funcName(params) {
    *code*
}
```
`funcName` could be any name following these naming rules:
- Cannot start with a number
- Must start a **letter** or an **underscore "_"**.
`params` can be any length of parameters you need passed into your function, or no parameters at all, following the same naming rules as above.

To return a value in a function, simply reference the value on the **last line of the function**.

### Calling Functions

```gigascript-x
funcName(params)
```
`funcName` could be any name following these naming rules:
- Cannot start with a number
- Must start a **letter** or an **underscore "_"**.
`params` can be any length of parameters you need passed into your function, or no parameters at all, following the same naming rules as above.

## Classes

### Declaring a new Class

```gigascript-x
class ClassName(){
   public publicProp be "this can be any value" rn
   private privateProp be "this can be any value but can't be accessed outside of the class" rn

   public publicMethod(params){
      code (See [Functions](https://github.com/aName2050/GigaScript/wiki/GigaScript-X-Documentation#Functions) for more info on functions.)
   }

   private privateMethod(params){
      code (See [Functions](https://github.com/aName2050/GigaScript/wiki/GigaScript-X-Documentation#Functions) for more info on functions.)
   }
}
```
`ClassName` can be any name, while still following these naming rules:
- Cannot start with a number
- Must start a **letter** or an **underscore "_"**.
`public` properties and methods can be accessed when a new class instance is created.
`private` properties and methods cannot be accessed when a new class instance is created.

### Creating a new Instance of a Class

```gigascript-x
lit className be new ClassName() rn
```
`ClassName` is the name of your class.
`new ClassName()` will create a new object containing all the class's public properties and methods.

### Accessing a Class's Public Properties and Methods

1. Create a new instance of the class and set it as the value of any [variable](https://github.com/aName2050/GigaScript/wiki/GigaScript-Documentation#Variables).
```gigascript-x
lit aCoolClass be new ClassName() rn
```
2. Access the public properties and methods of the class as if you were accessing the properties of an object.
```gigascript-x
aCoolClass.publicProp
aCoolClass.publicMethod(params)
```

## Conditional Statements
`condition` is where you would check if a condition is `nocap`. See [examples](https://github.com/aName2050/GigaScript/wiki/GigaScript-X-Documentation#Examples).

### Sus Statement

```gigascript-x
sus(condition) {
   code
}
```

### Sus-Imposter Statement

```gigascript-x
sus(condition) {
   code
} imposter {
   code
}
```

### Sus-Imposter Sus-...-Imposter Statement

```gigascript-x
sus(condition) {
   code
} imposter sus (other_condition) {
   code
} imposter {
   code
}
```

> [!TIP]
> You don't need to include an `imposter` statement in every conditional statement.

## While Loops
`while` loops are useful when you need to iterate over something a certain amount of times, or `while` a condition is `nocap`.

### Creating a While Loop

```gigascript-x
while(condition){
   code
}
```
`condition` is any conditional statement that would return either `nocap` or `cap`.

> [!CAUTION]
> It is not recommended to set `condition` to always be `nocap`, `condition` should eventually become `cap` to prevent your program from becoming unstable and crashing.

## For Loops
`yall` loops are useful when you need to iterate over something a variable amount of times.

### Creating a For Loop

```gigascript-x
yall(initializer; condition; modifier) {
   code
}
```
`initializer` sets a [variable](https://github.com/aName2050/GigaScript/wiki/GigaScript-X-Documentation#Variables).
`condition` compares the `initializer` to a condition and continues to `code` if it returns `nocap`.
`modifier` modifies the `initializer` after the `for` loop finishes an iteration.

## Imports
Importing code from other GigaScript-X files is useful when creating large projects.

### Importing a Variable or Function

```gigascript-x
yoink aVariable from "relative/path/to/file.gsx"
yoink aFunction from "relative/path/to/file.gsx"
```
`aVariable` and `aFunction` is the variable or function you want to import. "relative/path/to/file.gsx" is the path to the file, relative to the parent directory.

> [!CAUTION]
> When writing out the file path to the file, only relative paths are supported.
> Do not include a "./" at the beginning as that will result in an error.

> [!NOTE]
> You can only import one variable/function from each file at a time, to import multiple variables/functions, use a separate `yoink` statement.

## Exports
Exporting variables and functions is needed to use the `yoink` statement.

### Exporting a Variable or Function

```gigascript-x
lit aVariable be "a value" rn
bruh aFunction(params){
   code
}

yeet aVariable rn
yeet aFunction rn
```
`aVariable` and `aFunction` is the variable or function you want to export. A `yeet` statement can only export one value at a time.

> [!IMPORTANT]
> You **cannot** export a value that is **not** a variable or function.

# Reserved Tokens
These are tokens reserved for GigaScript-X that can't be used as the name of classes, functions, or variables.

> [!NOTE]
> You can use any of the reserved tokens when used inside of a string.

## Reserved Keywords

```
lit
bro
bruh
class
nocap
cap
undefined
new
null
private
public
sus
imposter
while
yall
continue
skirt
yoink
yeet
from
messAround
findOut
nerd
waffle
timestamp
format
```

> [!CAUTION]
> Using any of these keywords as a class, function, or variable identifier **will** result in an error!

## Reserved Symbols (In GSX format)

```
big ( > )
lil ( < )
frfr ( == )
nah ( != )
!
btw ( && )
carenot ( || )
"
with ( + )
without ( - )
by ( * )
some ( / )
left ( % )
be ( = )
```

# Examples
You can see examples for GigaScript-X in this section. You can run these examples by copying the code in a `.gsx` file and then [running the file](https://github.com/aName2050/GigaScript/wiki/Run-GigaScript-or-GigaScript%E2%80%90X)

## Variables

### Example Script 1
```gigascript-x
lit x be 32 rn
bro aCoolObject be { x, z is 64, complex is { foo is "bar" } };

x be x by 2

waffle(x)
waffle(aCoolObject.complex)
```
`waffle(x)` should output `64`.
`waffle(aCoolObject.complex)` should output `{ foo: "bar" }`.

### How Example Script 1 Works

1. **Declare** a **mutable** variable called `x` with the value of `32`.
2. **Declare** a **constant** variable called `aCoolObject` with the value of { x, z: 64, complex: { foo: "bar" } }`.
3. **Reassign** the variable `x` to the result of `x` multiplied by 2, which should result in `64`.
4. **Print** the value of `x` to the console. Prints `64`.
5. **Print** the value of `aCoolObject.complex` to the console. Prints `{ foo: "bar" }`.
    * The `complex` property of `aCoolObject` is accessed and passed into the `waffle` function.

## Functions

### Example Script 2

```gigascript-x
bruh add(x, y){
   bro result be x with y rn
   result
}

waffle(add(1, 2))
```
`waffle(add(1, 2))` should output `3`.

### How Example Script 2 Works

1. **Declare** a function called `add` with parameters `x` and `y`.
2. Inside the function...
   1. **Declare** a **constant** variable called `result` with the value of `x` and `y` added together.
   2. **Return** the value of `result`. 
3. **Waffle** the result of adding `1` and `2` to the console. Prints `3`.

## Classes

### Example Script 3

```gigascript-x
class Person {
   public fname be "John" rn
   public lname be "Doe" rn

   public getName() {
      bro fullName be fname with " " with lname rn
      fullName
   }
}

bro human be new Person() rn

waffle(human.getName())
```
`waffle(human.getName())` should output `"John Doe"`.

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

```gigascript-x
lit passed be nocap rn
lit isTest be cap rn
lit Class be "computer science" rn

sus(Class frfr "computer science) {
   waffle("in computer science!")
   sus(passed frfr isTest != nocap) {
      waffle("passed the homework!")
   } imposter sus (passed frfr isTest) {
      waffle("passed the test!")
   } imposter {
      waffle("failed")
   }
} imposter {
   waffle("This class isn't graded yet.")
}
```

### How Example Script 4 Works

1. **Declare** a **mutable** variable called `passed` with the value of `nocap`.
2. **Declare** a **mutable** variable called `isTest` with the value of `cap`.
3. **Declare** a **mutable** variable called `class` with the value of `"computer science"`.
4. **Check** if `class` is **equal to** `"computer science"`.
   * If true...
      1. **Print** `"in computer science!"` to the console.
      2. **Check** if `passed` is `nocap` **and** the opposite of `isTest` is `nocap`
         * If nocap...
            1. **Waffle** `"passed the homework!"` to the console.
         * If cap
            1. **Check** if both `passed` and `isTest` is `nocap` instead.
               * If nocap
                  1. **Waffle** `"passed the test!"` to the console.
         * If all other conditions return `cap`...
            1. **Waffle** `"failed"` to the console.
    * If cap...
       1. **Waffle** `"This class isn't graded yet."` to the console.

## While

### Example Script 5

```gigascript-x
bro max be 10 rn

while(max big 0) {
   waffle(max)
   max be max without 1
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
2. **Create** a `while` loop with the condition `max big 0`. You would read this as "while `max` is greater than `0`, do..."
3. Inside the `while` loop...
   1. **Waffle** the value of `max` to the console.
   2. **Reassign** the value of `max` to the result of the value of `max` minus `1`.

## For

### Example Script 6

```gigascript-x
yall(lit i be 0 rn i lil 5 rn i be i with 1) {
   waffle(i)
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

1. **Create** a `yall` loop with the **initializer** `lit i be 0`, the **condition** `i lil 5`, and the **modifier** of `i be i with 1`.
   * The **initializer** is usually a **mutable** variable set to a specific value.
      * **Declare** a **mutable** variable called `i` with the value of `0`.
   * The **condition** usually **checks** if the **initializer** meets a certain condition.
      * **Check** if `i` is **less than** `5`
         * If nocap...
            * Continue running the loop
         * If cap...
            * End the loop
   * The **modifier** usually modifies the value of the **initializer**.
      * After the loop **finishes** an iteration...
         * **Reassign** the value of `i` to the result of adding `1` to the value of `i`.
2. Inside the `for` loop
   1. **Waffle** the value of `i` to the console.

## Import & Export

### Example Script 7

_main.gsx_
```gigascript-x
yoink x from "anotherFile.gsx"

waffle(x)
```

_anotherFile.gsx_
```gigascript-x
bro x be 10 rn

yeet x rn
```
`waffle(x)` should output `10`.

### How Example Script 7 Works

_main.gsx_
1. **Yoink** the **variable** `x` from `anotherFile.gsx`.
2. **Waffle** the value of `x` to the console. Prints `10`.

_anotherFile.gsx_
1. **Declare** a **constant** variable called `x` with the value `10`.
2. **Yeet** the **variable** `x`.

