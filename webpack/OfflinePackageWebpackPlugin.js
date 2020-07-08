const fs = require('fs');
const _ = require('lodash');
const JSZip = require('jszip');
const mime = require('mime-types');
// const RawSource = require('webpack-sources').RawSource;

const zip = new JSZip();

module.exports = class OfflinePackagePlugin {
  // 应用函数
  constructor(options) {
    this.options = _.assign(
      {
        packageNameKey: 'packageName', // "packageId"
        packageNameValue: '', // packageId
        version: 1,
        folderName: 'package',
        indexFileName: 'index.json',
        baseUrl: '',
        fileTypes: [], // 可能包含的文件
        excludeFileName: [], // 排除在外的文件类型
        transformExtensions: /^(gz|map)$/i, // 转换扩展名称
        serialize: (manifest) => { // 格式化输入字符串
          return JSON.stringify(manifest, null, 2);
        }
      },
      options
    );
  }

  getFileType(str) { // 获取文件类型
    str = str.replace(/\?.*/, '');
    const split = str.split('.');
    let ext = split.pop();
    if (this.options.transformExtensions.test(ext)) {
      ext = split.pop() + '.' + ext;
    }
    return ext;
  }

  // 应用函数
  apply(compiler) {
    compiler.hooks.afterEmit.tapAsync(
      'OfflinePackagePlugin',
      (compilation, callback) => {
        // console.log(compilation.assets)
        const isFileTypeLimit = this.options.fileTypes.length > 0;

        // create index.json
        const content = {
          [this.options.packageNameKey]: this.options.packageNameValue,
          version: this.options.version,
          items: []
        };
        for (const filename in compilation.assets) {
          const fileType = this.getFileType(filename);

          if (this.options.excludeFileName.includes(filename)) {
            continue;
          }

          if (isFileTypeLimit && !this.options.fileTypes.includes(fileType)) {
            continue;
          }

          content.items.push({
            [this.options.packageNameKey]: this.options.packageNameValue, // packageId
            version: this.options.version, // version
            // remoteUrl: this.options.baseUrl + filename,
            path: filename, // filepath/name
            mimeType: mime.lookup(fileType)
          });
        }
        
        // index.json into compilation.assets
        const outputFile = this.options.serialize(content);
        compilation.assets[this.options.indexFileName] = {
          source: () => {
            return outputFile;
          },
          size: () => {
            return outputFile.length;
          }
        };
        // create zip file
        const folder = zip.folder(this.options.folderName);

        for (const filename in compilation.assets) {
          const fileType = this.getFileType(filename);
          if (this.options.excludeFileName.includes(filename)) {
            continue;
          }

          if (
            isFileTypeLimit &&
            !this.options.fileTypes.includes(fileType) &&
            filename !== this.options.indexFileName
          ) {
            continue;
          }

          const source = compilation.assets[filename].source();
          folder.file(filename, source);
        }
        zip
          .generateAsync({
            type: 'nodebuffer',
            streamFiles: true,
            compression: 'DEFLATE',
            compressionOptions: { level: 9 }
          })
          .then((content) => {n
            const outputPath = `./dist/${this.options.folderName}.zip`;
            // 这里已经输出完了.. 手动写入了
            // compilation.assets[outputPath] = new RawSource(content);
            fs.writeFile(outputPath, content,  "binary",function(err) { 
              console.log(err)
            });
            callback();
          });
      }
    );
  }
};
