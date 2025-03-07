<template>
  <div class="tours-container">
    <el-card class="box-card">
      <div slot="header" class="header">
        <span class="header-title">旅游景点管理</span>
        <div class="header-controls">
          <el-input v-model="searchTitle" placeholder="输入标题进行搜索" class="search-input"></el-input>
          <el-button type="primary" @click="fetchData">搜索</el-button>
          <el-button type="success" @click="handleAddTour">添加景点</el-button>
        </div>

      </div>
      <el-table :data="tours" style="width: 100%">
        <el-table-column label="图片" width="120">
          <template slot-scope="scope">
            <el-image
                :src="scope.row.img"
                class="tour-image"
                :alt="scope.row.title"
                fit="cover"
                lazy
            />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="景点名称" width="180"></el-table-column>
        <el-table-column prop="title_en" label="别名" width="180"></el-table-column>
        <el-table-column prop="comments" label="评论数" min-width="100"></el-table-column>
        <el-table-column prop="score" label="评分" min-width="100"></el-table-column>
        <el-table-column prop="nation" label="国家" min-width="120"></el-table-column>
        <el-table-column prop="city" label="城市" width="120"></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button @click="handleEditTour(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="handleDeleteTour(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="totalItems"
        layout="total, sizes, prev, pager, next, jumper"
    />

    <el-dialog title="编辑景点" :visible.sync="dialogVisible">
      <el-form :model="form">
        <el-form-item label="景点名称" :label-width="formLabelWidth">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="别名" :label-width="formLabelWidth">
          <el-input v-model="form.alias"></el-input>
        </el-form-item>
        <el-form-item label="评论数" :label-width="formLabelWidth">
          <el-input v-model="form.reviewCount" type="number"></el-input>
        </el-form-item>
        <el-form-item label="评分" :label-width="formLabelWidth">
          <el-input v-model="form.rating" type="number"></el-input>
        </el-form-item>
        <el-form-item label="精选评论" :label-width="formLabelWidth">
          <el-input v-model="form.featuredReview"></el-input>
        </el-form-item>
        <el-form-item label="国家" :label-width="formLabelWidth">
          <el-input v-model="form.country"></el-input>
        </el-form-item>
        <el-form-item label="城市" :label-width="formLabelWidth">
          <el-input v-model="form.city"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveTour">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {tours} from "@/api/tour.js";

export default {
  data() {
    return {
      tours: [],
      searchTitle:'',
      totalItems: 0,
      currentPage: 1,
      pageSize: 10,
      dialogVisible: false,
      form: {
        name: '',
        alias: '',
        reviewCount: 0,
        rating: 0,
        featuredReview: '',
        country: '',
        city: ''
      },
      formLabelWidth: '100px'
    };
  },
  mounted() {
    //加载数据
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loadData()
    },
    //加载数据
    loadData() {
      tours(this.searchTitle, this.currentPage, this.pageSize).then(res => {
        // console.log(res.data.data.records);
        this.tours = res.data.data.records
        this.totalItems = res.data.data.total
      })
    },

    handleCurrentChange(page) {
      this.currentPage = page;
      this.loadData();
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.loadData();
    },
    handleAddTour() {
      this.dialogVisible = true;
      this.form = { name: '', alias: '', reviewCount: 0, rating: 0, featuredReview: '', country: '', city: '' };
    },
    handleEditTour(tour) {
      this.dialogVisible = true;
      this.form = { ...tour };
    },
    handleDeleteTour(tour) {
      this.tours = this.tours.filter(t => t.id !== tour.id);
    },
    handleSaveTour() {
      if (this.form.id) {
        const index = this.tours.findIndex(t => t.id === this.form.id);
        if (index !== -1) {
          this.$set(this.tours, index, { ...this.form });
        }
      } else {
        const newTour = { ...this.form, id: this.tours.length + 1 };
        this.tours.push(newTour);
      }
      this.dialogVisible = false;
    },
  }
};
</script>

<style scoped>
.tours-container {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-footer {
  text-align: right;
}
.tours-container {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
}

.dialog-footer {
  text-align: right;
}

.header-title {
  font-size: 18px;
  font-weight: bold;
}

.header-controls {
  display: flex;
  align-items: center;
}

.search-input {
  width: 300px;
  margin-right: 10px; /* Adjust spacing between input and buttons */
}

.box-card{
  max-height: calc(100vh - 150px);
  overflow-y: auto;
}

</style>

