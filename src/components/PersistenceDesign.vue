<template>
  <div class="persistence-design">
    <!-- 数据库实体 -->
    <div class="design-card">
      <h3 class="layer-title">数据实体</h3>
      <el-table :data="entities">
        <el-table-column prop="name" label="实体名称"></el-table-column>
        <el-table-column label="字段">
          <template slot-scope="{row}">
            <el-tag
                v-for="field in row.fields"
                :key="field"
                class="field-tag">
              {{ field }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 表结构设计 -->
    <div class="design-card">
      <h3 class="layer-title">表结构设计</h3>
      <schema-designer :schemas="schemas"/>
    </div>
  </div>
</template>