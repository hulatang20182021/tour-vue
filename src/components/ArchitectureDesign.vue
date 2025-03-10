<template>
  <div class="architecture-design">
    <!-- 技术架构图 -->
    <div class="design-card">
      <h3 class="layer-title">技术架构图</h3>
      <div class="tech-architecture">
        <div v-for="(layer, index) in techLayers" :key="index" class="tech-layer">
          <h4>{{ layer.name }}</h4>
          <el-tag
              v-for="tech in layer.techs"
              :key="tech"
              type="success"
              class="tech-tag">
            {{ tech }}
          </el-tag>
        </div>
      </div>
    </div>

    <!-- 系统模块 -->
    <div class="design-card">
      <h3 class="layer-title">系统模块</h3>
      <el-table :data="modules">
        <el-table-column prop="name" label="模块名称"></el-table-column>
        <el-table-column prop="type" label="类型"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
      </el-table>
    </div>
  </div>
</template>