<template>
    <div>
        <!--  -->
        <label for="upload" class="choose-img" :class="{uploading: isUploading}">选择图片上传</label>
        <input id="upload" type="file" multiple style="display:none;" accept="image/*"
        @change="onChange" ref="fileUpload" :disabled="isUploading">
        <div class="tip">提示：一次最多可选9张照片（单张图片大小 &lt; 1M）</div>

        <ul class="img-container">
            <li v-for="(image,index) in imageList" :key="index"
            :style="{background: `url(${image}) no-repeat center/contain`}"></li>
        </ul>
    </div>
</template>

<script>
// 导入 阿里云OSS 包
import OSS from 'ali-oss'

export default {
  data () {
    return {
      client: new OSS({
        region: 'oss-cn-shanghai',
        bucket: 'imooc-es-my'
        // 需要添加 accessKeyId 和 accessKeySecret
      }),
      imageList: [],
      // 是否正在上传
      isUploading: false
    }
  },
  methods: {
    onChange () {
      // 获取将要上传到文件信息
      // const fileDom = this.$refs.fileUpload
      // const newFiles = fileDom.files

      // 使用ES11新特性 可选链 写法：
      const newFiles = this.$refs?.fileUpload?.files
      //   console.log(newFiles)
      // 校验文件上传个数
      if (newFiles.length > 9) {
        alert('最多上传9个文件')
        return false
      }
      const files = []
      // 校验文件大小
      for (const file of newFiles) {
        // 将单位转换成 MB
        const size = file.size / 1024 / 1024
        if (size > 1) {
          alert('请选择1MB以内的照片！')
          return false
        }
        files.push(file)
      }

      this.uploadFilesByOSS2(files)
    },
    // 上传图片到阿里云OSS
    uploadFilesByOSS1 (files) {
      this.isUploading = true
      const uploadRequest = []
      for (const file of files) {
        uploadRequest.push(new Promise((resolve, reject) => {
          this.client.put(`${Math.random()}-${file.name}`, file)
            .then(res => {
              // console.log(res)
              // 将上传成功的图片显示在页面中
              //   this.imageList = [...this.imageList, res.url]
              resolve(res.url)
            })
            .catch(err => {
              console.log(err)
              reject(err)
            })
        }))
      }
      // Promise.all(uploadRequest)
      //   .then(res => {
      //     console.log(res)
      //     // 将上传成功的图片显示在页面中
      //     this.imageList = res
      //     this.isUploading = false
      //   })
      //   .catch(err => {
      //     console.log(err)
      //   })

      // 优化 Promise.all() 方法：如果其中一张照片上传失败，则会认为所有的都失败，导致一张照片都显示不出来
      Promise.allSettled(uploadRequest)
        .then(res => {
          // 遍历出 所有成功上传（fulfilled）的照片
          this.imageList = res.filter(item => item.status === 'fulfilled').map(item => item.value)
          this.isUploading = false
        })
    },

    // 使用 async/await 重写 uploadFilesByOSS1
    async uploadFilesByOSS2 (files) {
      const imgs = []
      for (const file of files) {
        const result = await this.client.put(`${Math.random()}-${file.name}`, file)
        imgs.push(result.url)
      }
      this.imageList = imgs
      this.isUploading = false
    }
  }
}
</script>

<style scope>
.choose-img {
    display: block;
    width: 150px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    background-color: #42b983;
    margin: 0 auto;
    border-radius: 5px;
    cursor: pointer;
    color: #fff;
}
.tip {
    font-size: 12px;
    color: #999;
}
.img-container > li {
    list-style: none;
    width: 150px;
    height: 100px;
    float: left;
    margin: 0 30px 30px 0;
    border: 1px solid #ccc;
}
.uploading {
    background-color: #ccc;
}
</style>
