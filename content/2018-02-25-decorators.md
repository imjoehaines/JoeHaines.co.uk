+++
title = "Decorators"
description = "and why they're the best"
+++
A decorator is a function or class that can extend the capabilities of another function or class without inheriting from it. It allows new code to add or alter behaviour while the existing code remains unchanged.

In JavaScript (and much of the functional world) decorators will usually be functions:

```js
const shouty = string => string + '!'
const extraShouty = string => string.toUpperCase()
const sayHi = string => 'Hi ' + string

console.log(
  shouty(
    extraShouty(
      sayHi('Bob')
    )
  )
)

// 'HI BOB!'
```

All of these functions accept and return the same type (a `String` in this case) so they can be used independently, or in any combination. Additional functions can be added to the chain without having to alter any of the existing ones.

In PHP (and much of the OOP world) decorators are usually classes, which means they will also usually implement the same interface as the classes they are decorating.

In my [Flowder](https://github.com/imjoehaines/flowder) library I use decorators to allow maximum flexibility when configuring fixture loading. For example, there is a [`PhpFileLoader`](https://github.com/imjoehaines/flowder/blob/145ad96abd049ab4dc30427c374578001359e73f/src/Loader/PhpFileLoader.php) which can load data from a PHP file. To extend this to deal with directories there is also a [`DirectoryLoader`](https://github.com/imjoehaines/flowder/blob/145ad96abd049ab4dc30427c374578001359e73f/src/Loader/DirectoryLoader.php) class, which takes any class implementing [`LoaderInterface`](https://github.com/imjoehaines/flowder/blob/145ad96abd049ab4dc30427c374578001359e73f/src/Loader/LoaderInterface.php) and calls its `load` method for every file inside a given directory.

In order to load a directory of fixture files, a `PhpFileLoader` and `DirectoryLoader` are composed together:

```php
<?php

$loader = new DirectoryLoader(
    new PhpFileLoader()
);
```

Implementing the `DirectoryLoader` is as easy as accepting a loader in its constructor&hellip;

```php
<?php

public function __construct(LoaderInterface $loader)
{
    $this->loader = $loader;
}
```

&hellip;and calling its `load` method when appropriate, inside its own `load` method:

```php
<?php

public function load($directory)
{
    foreach (glob($directory . '/*') as $file) {
        foreach ($this->loader->load($file) as $table => $data) {
            yield $table => $data;
        }
    }
}
```

Given a project of enough size, loading a directory full of files repeated may become very slow. To combat this, there is also a [`CachingLoader`](https://github.com/imjoehaines/flowder/blob/145ad96abd049ab4dc30427c374578001359e73f/src/Loader/CachingLoader.php) class that caches the result of another loader's `load` method and returns it for any other calls to `load`.

We can add this to our previous loader configuration&hellip;

```php
<?php

$loader = new CachingLoader(
    new DirectoryLoader(
        new PhpFileLoader()
    )
);
```

&hellip;and now we have a loader that will read all PHP files in a directory, cache the result of it and return that cached value for all other requests to load the data.

*Many more examples in many more languages can be [found on Wikipedia](https://en.wikipedia.org/wiki/Decorator_pattern#Examples).*

Decorators can be used in many situations instead of inheritance, which helps to reduce complexity in large code bases. It can also enable new functionality to be attached to legacy features without needing to edit the existing code, managing risk in hard to modify codebases.
