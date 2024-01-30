<template>
  <Story
    title="1. Basic/Spacing"
    icon="radix-icons:margin"
    :layout="{
      type: 'single'
    }"
  >
    <Variant title="Basic Usage">
      <p class="h4">
        Types d’espacement
      </p>

      <table class="table-spacing" aria-label="Types d'espacement">
        <thead>
          <tr>
            <th>Type de l’espacement + (token)</th>
            <th>Résultat</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>.margin--0</td>
            <td>margin: 0;</td>
          </tr>
          <tr>
            <td>.margin--auto</td>
            <td>0.50rem</td>
          </tr>
          <tr>
            <td>.margin-{position}--auto</td>
            <td>margin-{position}: auto;</td>
          </tr>
          <tr>
            <td>.margin--{token}</td>
            <td>margin: 0.25rem * {token};</td>
          </tr>
          <tr>
            <td>.margin-{position}--{token}</td>
            <td>margin-{position}: 0.25rem * {token};</td>
          </tr>
          <tr>
            <td>.padding--0</td>
            <td>padding: 0;</td>
          </tr>
          <tr>
            <td>.padding--auto</td>
            <td>padding: auto;</td>
          </tr>
          <tr>
            <td>.padding-{position}--auto</td>
            <td>padding-{position}: auto;</td>
          </tr>
          <tr>
            <td>.padding--{token}</td>
            <td>padding: 0.25rem * {token};</td>
          </tr>
          <tr>
            <td>.padding-{position}--{token}</td>
            <td>padding-{position}: 0.25rem * {token};</td>
          </tr>
          <tr>
            <td>.gap--{token}</td>
            <td>gap: 0.25rem * {token};</td>
          </tr>
        </tbody>
      </table>

      <p class="h4">
        Valeurs d’espacement
      </p>

      <table class="table-spacing" aria-label="Valeurs d'espacement">
        <thead>
          <tr>
            <th>Nom de l’espacement (token)</th>
            <th>Size (rem)</th>
            <th>Exemple d’utilisation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>0.25rem</td>
            <td>Margin entre icône et texte</td>
          </tr>
          <tr>
            <td>2</td>
            <td>0.50rem</td>
            <td>Margin entre label et input</td>
          </tr>
          <tr>
            <td>3</td>
            <td>0.75rem</td>
            <td>Padding dans les cards ou tableaux</td>
          </tr>
          <tr>
            <td>4</td>
            <td>1rem</td>
            <td><strong>Spacing de base</strong>. Margin entre les atomes et molécules</td>
          </tr>
          <tr>
            <td>5</td>
            <td>1.25rem</td>
            <td>Margin entre les molécules, les organismes et les sections</td>
          </tr>
          <tr>
            <td>6</td>
            <td>1.50rem</td>
            <td>Margin entre les molécules, les organismes et les sections</td>
          </tr>
          <tr>
            <td>8</td>
            <td>2rem</td>
            <td>Margin entre les organismes et les sections</td>
          </tr>
          <tr>
            <td>12</td>
            <td>3rem</td>
            <td>Margin entre les organismes et les sections</td>
          </tr>
          <tr>
            <td>16</td>
            <td>4rem</td>
            <td>Margin entre les organismes et les sections</td>
          </tr>
          <tr>
            <td>32</td>
            <td>8rem</td>
            <td>Margin entre les organismes et les sections</td>
          </tr>
        </tbody>
      </table>
      <p class="h4">
        Dimensions
      </p>

      <table class="table-spacing" aria-label="Types d'espacement">
        <thead>
          <tr>
            <th>Type de l’espacement + (token)</th>
            <th>Résultat</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>.min-width--{token}</td>
            <td>min-width: {token} * 0.25;</td>
          </tr>
        </tbody>
      </table>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
</script>

<style lang="scss">
.table-spacing {
  width: 100%;
  border: 0;
  border-collapse: collapse;

  thead {
    background: #F5F5F5;
    color: #666666;
    border-bottom: 1px solid #DBDBDB;
  }

  th {
    padding: 11px 16px;
    text-align: left;
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;

    &:first-child {
      border-top-left-radius: 8px;
    }

    &:last-child {
      border-top-right-radius: 8px;
    }
  }

  td {
    padding: 12px 16px;
    border-bottom: 1px solid #DBDBDB;
    color: #171717;
    font-weight: 400;
    font-size: 14px;
    line-height: 120%;
  }
}
</style>
<docs lang="md">
## Spacing
  <div class="container">
      <p><strong>L'espacement apporte du rythme et de la fluidité à l'interface.</strong>
  Nos tokens d'espacement sont basés sur la règle de 4, avec 16px comme unité de base.
  L'espacement peut être utilisé via les paddings et la margins dans les composants web et mobile.
      <br>
  La plupart des mesures s'alignent sur une grille de base 8/12/16 appliquée,
  c'est notre unité de base pour mobile, tablette et laptop.
  Les composants plus petits, tels que les icônes et les types, peuvent s'aligner
  sur une grille de base 4.
      <br>
  Ces unités de base nous aideront à maintenir la cohérence de la conception et à
  améliorer la communication entre les designers et les développeurs. Nous avons
  choisi une unité 8 car la plupart des tailles d'écran sont divisibles par 4 et 4
  lui-même est également un nombre facilement divisible.</p>
  </div>
  <div class="reponsive-iframe-container">
  <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FCmAQkyvJgicN6PHwf61DBZ%2F%25F0%259F%25A6%2584-Guidelines%3Ftype%3Ddesign%26node-id%3D87%253A2427%26mode%3Ddev" allowfullscreen></iframe>
</div>
</docs>
