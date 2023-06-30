<script setup lang="ts">
</script>

<template>
  <Story
    title="Basic/Spacing"
    icon="radix-icons:margin"
    :layout="{
      type: 'single'
    }"
  >
    <Variant title="Basic Usage">
      <p class="h4">
        Types d’espacement
      </p>

      <table>
        <thead>
          <th>Type de l’espacement + (token)</th>
          <th>Résultat</th>
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
        </tbody>
      </table>

      <p class="h4">
        Valeurs d’espacement
      </p>

      <table>
        <thead>
          <th>Nom de l’espacement (token)</th>
          <th>Size (rem)</th>
          <th>Exemple d’utilisation</th>
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
    </Variant>
  </Story>
</template>

<style lang="scss">
table {
  width: 100%;
  border: 0;
  border-collapse: collapse;
}

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

.el-col {
  margin-bottom: 10px;
}

.grid-item {
  min-height: 36px;
}

.grid-item-light {
  background: #d3dce6;
}

.grid-item-dark {
  background: #e5e9f2;
}
</style>
