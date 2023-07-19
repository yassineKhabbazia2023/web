<script setup lang="ts">
import { ref } from 'vue'

const radiusGroup = ref([
  {
    name: 'No Radius',
    type: ''
  },
  {
    name: 'Small Radius',
    type: 'small'
  },
  {
    name: 'Large Radius',
    type: 'base'
  },
  {
    name: 'Round Radius',
    type: 'round'
  }
])

function getValue(type: string) {
  const getCssVarValue = (prefix: string, type: string) =>
    getComputedStyle(document.documentElement).getPropertyValue(
      `--el-${prefix}-${type}`
    )
  return getCssVarValue('border-radius', type)
}
</script>

<template>
  <Story
    title="Basic/Border"
    icon="teenyicons:border-radius-solid"
    source=" "
    :layout="{
      type: 'grid',
      width: '100%',
    }"
  >
    <Variant title="Border radius Custom Pegase">
      <el-row class="demo-radius">
        <el-col :span="12">
          <div class="title">
Radius 4px
</div>
          <code class="code-value">.radius--1</code>
          <div
            class="radius radius--1"
          />
        </el-col>
        <el-col :span="12">
          <div class="title">
Radius 8px
</div>
          <code class="code-value">.radius--2</code>
          <div
            class="radius radius--2"
          />
        </el-col>
        <el-col :span="12">
          <div class="title">
Radius 12px
</div>
          <code class="code-value">.radius--3</code>
          <div
            class="radius radius--3"
          />
        </el-col>
        <el-col :span="12">
          <div class="title">
Radius 16px
</div>
          <code class="code-value">.radius--4</code>
          <div
            class="radius radius--4"
          />
        </el-col>
        <el-col :span="12">
          <div class="title">
Radius 20px
</div>
          <code class="code-value">.radius--5</code>
          <div
            class="radius radius--5"
          />
        </el-col>
        <el-col :span="12">
          <div class="title">
Radius 24px
</div>
          <code class="code-value">.radius--6</code>
          <div
            class="radius radius--6"
          />
        </el-col>
        <el-col :span="12">
          <div class="title">
Radius 32px
</div>
          <code class="code-value">.radius--7</code>
          <div
            class="radius radius--7"
          />
        </el-col>
        <el-col :span="12">
          <div class="title">
Radius 48px
</div>
          <code class="code-value">.radius--8</code>
          <div
            class="radius radius--8"
          />
        </el-col>
        <el-col :span="12">
          <div class="title">
Radius circle
</div>
          <code class="code-value">.radius--circle</code>
          <div
            class="radius radius--circle"
            style="width: 100px;"
          />
        </el-col>
      </el-row>
    </Variant>
    <Variant title="Border radius Element Plus">
      <el-row class="demo-radius">
        <el-col
          v-for="(radius, i) in radiusGroup"
          :key="i"
          :span="12"
        >
          <div class="title">
            {{ radius.name }}
          </div>
          <code class="code-value">border-radius: {{ getValue(radius.type) || '0px' }}</code>
          <div
            class="radius"
            :style="{
              borderRadius: radius.type
                ? `var(--el-border-radius-${radius.type})`
                : '',
            }"
          />
        </el-col>
      </el-row>
    </Variant>
    <Variant title="Border style">
      <table class="demo-border">
        <tbody>
          <tr>
            <td class="text">
              Name
            </td>
            <td class="text">
              Thickness
            </td>
            <td class="line">
              Demo
            </td>
          </tr>
          <tr>
            <td class="text">
              Solid
            </td>
            <td class="text">
              1px
            </td>
            <td class="line">
              <div />
            </td>
          </tr>
          <tr>
            <td class="text">
              Dashed
            </td>
            <td class="text">
              2px
            </td>
            <td class="line">
              <div class="dashed" />
            </td>
          </tr>
        </tbody>
      </table>
    </Variant>
  </Story>
</template>

<style scoped>
.demo-border .text {
  width: 15%;
}
.demo-border .line {
  width: 70%;
}
.demo-border .line div {
  width: 100%;
  height: 0;
  border-top: 1px solid var(--el-border-color);
}
.demo-border .line .dashed {
  border-top: 2px dashed var(--el-border-color);
}

.demo-radius .title {
  color: var(--el-text-color-regular);
  font-size: 18px;
  margin: 10px 0;
}

.demo-radius .el-col {
  margin-top: 20px;
}

.demo-radius .radius {
  height: 100px;
  width: 70%;
  border: 1px solid var(--el-border-color);
  margin-top: 20px;
}

.code-value {
  border: 1px solid var(--el-border-color);
  background-color: var(--el-fill-color-light);
  font-size: 16px;
  margin: 10px 0;
  white-space: nowrap;
  color: black;
}
</style>
<docs lang="md">
## Border
<div class="container">
<p><strong>Notre système de rayon suit une règle de multiple de 4.</strong>
<br>
L'échelle crée un équilibre visuel qui facilite la compréhension de l'interface. Les borders
permettent de garder une identité cohérente, durable et globale.</p>
<iframe class="responsive-iframe"
  src="https://www.figma.com/file/CmAQkyvJgicN6PHwf61DBZ/%F0%9F%A6%84-Guidelines?type=design&
  node-id=7-419&t=TM4euOaCfpu9qi5K-0"></iframe>
</div>
</docs>
