<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium" class="ry_form">
      <el-form-item label="波次号" prop="waveNo">
        <el-input
          v-model.trim="queryParams.waveNo"
          placeholder="请输入波次号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <DictRadio
          v-model="queryParams.status"
          @change="handleQuery"
          size="small"
          :radioData="dict.type.wms_wave_status"
          :showAll="'all'"
        />
      </el-form-item>
      <el-form-item class="flex_one tr">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <WmsTable v-loading="loading" :data="WaveList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="波次号" align="center" prop="waveNo" v-if="columns[0].visible"/>
      <el-table-column label="状态" align="center" prop="status" v-if="columns[1].visible">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.wms_wave_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" v-if="columns[1].visible"/>
      <el-table-column label="备注" align="center" prop="remark" v-if="columns[2].visible"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-edit"-->
<!--            @click="handleUpdate(scope.row)"-->
<!--            v-hasPermi="['wms:wave:edit']"-->
<!--          >修改</el-button>-->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleAllocation(scope.row)"
            v-hasPermi="['wms:wave:edit']"
          >分配库存</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            v-if="scope.row.status == 1"
            @click="handleDelete(scope.row)"
            v-hasPermi="['wms:wave:remove']"
          >取消波次</el-button>
        </template>
      </el-table-column>
    </WmsTable>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { listWave, getWave, delWave, addWave, updateWave, exportWave } from "@/api/wms/wave";

export default {
  name: "Wave",
  dicts: ["wms_wave_status"],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 波次表格数据
      WaveList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 15,
        waveNo: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        waveNo: [
          { required: true, message: "波次号不能为空", trigger: "blur" }
        ],
      },
      columns: [
            { key: 1, label: "波次号", visible:  true  },
            { key: 2, label: "状态", visible:  true  },
            { key: 3, label: "备注", visible:  true  },
                             ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleAllocation(row){
      this.$router.push({
        path: "/wms/wave/status",
        query: {
          id: row.id
        }
      });
    },
    /** 查询波次列表 */
    getList() {
      this.loading = true;
      const {pageNum, pageSize} = this.queryParams;
      const query = {...this.queryParams, pageNum: undefined, pageSize: undefined, type: 2};
      const pageReq = {page: pageNum - 1, size: pageSize};
      listWave(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.WaveList = content;
        this.total = totalElements;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        waveNo: null,
        status: "0",
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加波次";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getWave(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改波次";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateWave(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWave(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      const waveNo = row.waveNo;
      this.$modal.confirm('是否确认删除波次编号为"' + waveNo + '"的数据项？').then(function() {
        return delWave(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有波次数据项？').then(() => {
        this.exportLoading = true;
        return exportWave(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
