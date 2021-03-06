+++
title = "Why I don't like Typescript"
description = "There are lots of reasons but it's fine if you like it!"
+++
Typescript is unarguably a _very_ popular language. According to [GitHub's “State of the Octoverse”](https://github.blog/2018-11-15-state-of-the-octoverse-top-programming-languages/) it was the 3rd fastest growing language of 2018 and [StackOverflow ranks it 12th](https://insights.stackoverflow.com/survey/2018#technology) in terms of the “Most Popular Technologies” in their 2018 developer survey.

In this post I'm going to put forward my case for **Why I Don't Like Typescript**.

Before I start I want to make it clear that this is my opinion. You might disagree and that's fine! Some of the things in this post are subjective because different people have different experiences and expectations so something that bothers me might not bother you. If you like using Typescript then you should keep using it, all I'd encourage you to do is checkout some of the other options as you might like them more.

### Its type inference is poor at best

Type inference means that a programming language can detect the type of a variable without the programmer explicitly stating it. Some languages do this better than others but Typescript disappointed me with how poor its inference is, especially for a relatively new language.

Let's look at an example:

```js
function one(name, age) {
    return two(name, age)
}

function two(name, age) {
    return age + name.length
}

export default one
```

This module (rather pointlessly) will add a given `age` to the length of the given `name`. We know from the export statement that the function `two` is effectively private — only `one` can call it because it's not exported or stored globally. That means that type hinting `two` is entirely pointless if `one` is type hinted because calling `one` is the only way to call `two` so we don't get any extra safety from typing both functions. However Typescript requires you to add types to **both** `one` and `two` as it can't seem to infer what the `name` and `age` parameters passed to `two` are, even though they have been passed directly by `one`.

```typescript
function one(name: string, age: number): number {
    return two(name, age)
}

function two(name: string, age: number): number {
    return age + name.length
}

export default one
```

This doesn't seem like a big deal in this single example, but across a large code base this leads to huge amounts of pointless type annotations. If you've never used a language with a [Hindley–Milner type system](https://en.wikipedia.org/wiki/Hindley%E2%80%93Milner_type_system) then you might not realise how much nicer it can be when the compiler does most of the hard work of determining types for you.

### Unsafe type system

Typescript's type system is inherently unsafe — they admit as much in [the official handbook](https://www.typescriptlang.org/docs/handbook/type-compatibility.html#a-note-on-soundness):

> TypeScript’s type system allows certain operations that can't be known at compile-time to be safe

Whether this is OK or not depends on what you think the goal of a language like Typescript should be. If you want to promote type safety in JavaScript then this decision makes sense — it's much easier to convert existing JavaScript code to Typescript by allowing common patterns that are unsafe. If, however, you think the goal of a typed compile-to-JS language should be to allow you to write safe programs then you might want to look elsewhere.

Typescript's type system also has another problem; it's way too easy to ignore. What I mean by this are the “escape hatches” built into the language, such as the `any` type and [type assertions](https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md#416-type-assertions).

The `any` type is widely recognised as a potential problem, but it's worth highlighting how using it is incredibly unsafe and how the “`noImplicitAny`” configuration option isn't enabled by default. Given that you can enable this option easily and it's fairly widely known, I don't think this is a _major_ problem with Typescript.

Type assertions, on the other hand, completely defeats the point of a type system. If you're unfamiliar, a type assertions allows you to mark a variable as any type you like, without having to prove that to the compiler. For example:

```typescript
interface RemoteData {
    property1: string,
    property2: number
}

fetch('https://example.com')
    .then(response => response.json())
    .then(data => <RemoteData> data)
```

Here we've declared an interface with two typed properties and made a fetch call where we are able to declare `data` to be of the type `RemoteData` without having to prove it to the compiler. Typescript places some limitations on this — if you have a number and assert that it's a string Typescript won't let you. However AJAX requests are some of the most dangerous places in a code base as the result is always unknowable until the response is available.

Allowing you to mark a JSON payload as any type you like without having to prove it to the compiler opens a massive, dangerous hole in a code base. While a best practice would always be to validate the response and manually convert it to the correct type, any sufficiently large code base will inevitably end up with undesirable code without any intentional maliciousness.

### Community type definitions

One of the main things pushing Typescript's usage is the [DefinitelyTyped](https://definitelytyped.org/) project and other community led type definitions for open source libraries.

The problem with these is that there's nothing to prove that the types are correct. All they give you is a false sense of security because the type definition comes from someone who didn't write the original code, may lag behind new releases or be outright wrong. A type definition that's incorrect can lead to runtime errors that can't be caught by the Typescript compiler because it trusts a third party type definition to be absolutely correct.

Without much better inference and a Typescript runtime to check for type errors during a program's execution, there's not a lot that can be improved here, but the current situation is untenable to me.

In order to have a code base that's protected from these kinds of errors, you need a _really_ good unit test suite to help ensure all of the typings are correct. This is fine, but if you're going to ensure type safety through an incredibly thorough test suite then does Typescript add anything?

### What's the alternative?

Typescript does what it sets out to do pretty well — it's a compile-to-JavaScript language that looks and feels **a lot** like JavaScript which massively reduces the barrier to entry for front end developers. What it doesn't do that well is provide a type system that _ensures_ type safety (as much as a type system can).

Languages like [Elm](https://elm-lang.org/) and [Purescript](http://www.purescript.org/) provide type systems that are safer than Typescript's — Elm boasts “no runtime exceptions” as one of its main features. However this comes with a cost. Both languages require a lot more learning than Typescript does and they follow a paradigm that is likely to be unfamiliar to many JavaScript developers.

Personally I would always chose Elm over Typescript but for a company that decision isn't as easy. Elm's community is much smaller and breaking changes between releases are common (though releases are relatively infrequent), so it might not be as attractive as a language that's backed by Microsoft and a massive community.

It all depends whether you think the trade-offs are worth it.
