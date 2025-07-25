# Bad Code / Good Code selon les revues de pull requests

## Tester l’égalité

### ❌ Mauvais code

```ts
// coercition implicite, moins lisible
if (!flag) {
  // ...
}

if (flag) {
  // ...
}
```

### ✅ Bon code

```ts
// explicite et sans conversion de type
if (flag === false) {
  // ...
}

if (flag === true) {
  // ...
}
```

> **Pourquoi ?**  
> Utiliser `===` garantit qu’on compare bien des booléens et évite toute conversion implicite de type, ce qui rend le code plus prévisible et plus facile à relire.
