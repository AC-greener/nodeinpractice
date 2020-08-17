var stream = require('stream');
//<co id="callout-streams-writable-1" />
GreenStream.prototype = Object.create(stream.Writable.prototype, {
  constructor: { value: GreenStream }
});

function GreenStream(options) {
  stream.Writable.call(this, options);
}
//所有的＿write 方法需要做的就是当数据被写人时调用提供的回调
GreenStream.prototype._write = function(chunk, encoding, callback) {
  console.log(chunk)
  process.stdout.write('\u001b[32m' + chunk + '\u001b[39m'); //<co id="callout-streams-writable-2" />
  callback(); //<co id="callout-streams-writable-3" />
};

process.stdin.pipe(new GreenStream()); //<co id="callout-streams-writable-4" />
