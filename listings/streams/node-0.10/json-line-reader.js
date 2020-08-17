var stream = require('stream');
var util = require('util');
var fs = require('fs');

function JSONLineReader(source) {
  stream.Readable.call(this); //<co id="callout-streams-json-line-1" />
  this._source = source;
  // console.log('source', source)
  this._foundLineEnd = false;
  this._buffer = '';

  source.on('readable', function() {
    console.log('readable')
    // console.log(this)
    this.read(); //<co id="callout-streams-json-line-2" />
  }.bind(this));
}

util.inherits(JSONLineReader, stream.Readable); //<co id="callout-streams-json-line-3" />

//_read 方法＠检查缓冲区是否为空＠，如果是， 从源读取更多数据添加到内部的缓冲区 。
JSONLineReader.prototype._read = function(size) { //<co id="callout-streams-json-line-4" />
  var chunk;
  var line;
  var lineIndex;
  var result;

  //当类准备好接收更多数据时，在源上调用 read（） 。
  if (this._buffer.length === 0) { //<co id="callout-streams-json-line-5" />
    chunk = this._source.read();
    console.log('cc',chunk)
    this._buffer += chunk;
  }
  lineIndex = this._buffer.indexOf('\n');

  if (lineIndex !== -1) {
    //从 buffer 的开始截取第一行来获取一些文本进行解析 。
    line = this._buffer.slice(0, lineIndex); //<co id="callout-streams-json-line-6" />
    if (line) {
      result = JSON.parse(line);
      this._buffer = this._buffer.slice(lineIndex + 1);
      this.emit('object', result); //<co id="callout-streams-json-line-7" />
      //把解析好的 JSON 发送回内部队列 
      this.push(util.inspect(result)); //<co id="callout-streams-json-line-8" />
    } else {
      this._buffer = this._buffer.slice(1);
    }
  }
};

var input = fs.createReadStream(__dirname + '/json-lines.txt', {
  encoding: 'utf8'
}); //<co id="callout-streams-json-line-9" />
var jsonLineReader = new JSONLineReader(input);

jsonLineReader.on('object', function(obj) {
  console.log('pos:', obj.position, '- letter:', obj.letter);
});
