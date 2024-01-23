# GigaScript Syntax

Each version of GigaScript has its own syntax

## GigaScript (.g) <img src="https://github.com/aName2050/GigaScript/blob/main/assets/GigaScript.png" />

### Variables

Declaring mutable variables

```
let varName = value;
```

Declaring constant variables

```
const varName = value;
```

> [!NOTE]
> All variable **declarations** must end in a semicolon (;)

Reassigning a mutable variable

```
varName = newValue
```

> [!NOTE]
> Variable **assignments or reassignments** do not need to end in a semicolon (;)

> [!WARNING]
> Semicolons (;) should **only** be used when **declaring variables**! Using semicolons (;) anywhere else will result in an error.

### Functions

Declaring a function

```
func funcName(params) {
  code
}
```

Calling a function

```
funcName(params)
```

### If Statements

If Statement

```
if (comparison) {
  code
}
```

If-Else Statement

```
if (comparison) {
  code
} else {
  code
}
```

Chained If-Else Statement

```
if (comparison) {
  code
} else if (other_comparison) {
  code
} else {
 code
}
```

> [!NOTE]
> You do not need to include an `else` statement at the end of every **Chained If-Else** statement. An `else` statement is a catch-all for if all the other comparisons return `false`.

### For Loops

```
for(initializer; comparison; modifier) {
  code
}
```

### Comparisons

Equals

```
value == value
```

Greater Than

```
value > value
```

Less Than

```
value < value
```

Not Equal

```
value != value
```

And

```
value && value
```

Or

```
value || value
```

### Mathematical Operations

Addition

```
num + num
```

Subtraction

```
num - num
```

Multiplication

```
num * num
```

Division

```
num / num
```

Modulo

```
num % num
```

### Try-Catch Statement

```
try {
  code
} catch {
  code
}
```

> [!WARNING]
> `catch` doesn't return anything. `error` is global variable, which is assigned a value when `catch` catches an error in the `try` block.

## GigaScript-X (.gsx) <img src="https://github.com/aName2050/GigaScript/blob/main/assets/GigaScript-X.png" />

### Variables

Declaring mutable variables

```
lit varName be value rn
```

Declaring constant variables

```
bro varName be value rn
```

> [!NOTE]
> All variable **declarations** must end with the `rn` keyword.

Reassigning a mutable variable

```
varName be newValue
```

> [!NOTE]
> Variable **assignments or reassignments** do not need to end with the `rn` keyword.

> [!WARNING]
> `rn` keywords should **only** be used when **declaring variables**! Using the `rn` keyword anywhere else will result in an error.

### Functions

Declaring a function

```
bruh funcName(params) {
  code
}
```

Calling a function

```
funcName(params)
```

### If Statements

If Statement

```
sus (comparison) {
  code
}
```

If-Else Statement

```
sus (comparison) {
  code
} imposter {
  code
}
```

Chained If-Else Statement

```
sus (comparison) {
  code
} imposter sus (other_comparison) {
  code
} imposter {
 code
}
```

> [!NOTE]
> You do not need to include an `imposter` statement at the end of every **Chained If-Else** statement. An `imposter` statement is a catch-all for if all the other comparisons return `cap`.

### For Loops

```
yall(initializer; comparison; modifier) {
  code
}
```

### Comparisons

Equals

```
value frfr value
```

Greater Than

```
value big value
```

Less Than

```
value lil value
```

Not Equal

```
value nah value
```

And

```
value btw value
```

Or

```
value carenot value
```

### Mathematical Operations

Addition

```
num with num
```

Subtraction

```
num without num
```

Multiplication

```
num by num
```

Division

```
num some num
```

Modulo

```
num left num
```

### Try-Catch Statement

```
messAround {
  code
} findOut {
  code
}
```

> [!WARNING]
> `findOut` doesn't return anything. `error` is global variable, which is assigned a value when `findOut` catches an error in the `messAround` block.
