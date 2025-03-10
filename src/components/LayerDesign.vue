<template>
  <div class="layer-design">
    <!-- 模块管理 -->
    <div class="design-card">
      <div class="card-header">
        <h3 class="layer-title">{{ title }}</h3>
        <el-button @click="openModuleDialog">新增模块</el-button>
      </div>
      <el-tree :data="modules" node-key="id">
        <span slot-scope="{ node }" class="tree-node">
          {{ node.label }}
          <el-button type="text" @click="editModule(node)">编辑</el-button>
        </span>
      </el-tree>
    </div>

    <!-- 接口列表 -->
    <div class="design-card" v-if="layerType !== 'ui'">
      <h3 class="layer-title">接口定义</h3>
      <interface-list :data="interfaces"/>
    </div>

    <!-- 组件属性（仅界面层） -->
    <div class="design-card" v-if="layerType === 'ui'">
      <h3 class="layer-title">组件规范</h3>
      <el-collapse>
        <el-collapse-item
            v-for="module in modules"
            :title="module.name"
            :key="module.id">
          <div>Props: {{ module.props.join(', ') }}</div>
          <div>Events: {{ module.events.join(', ') }}</div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>