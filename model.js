var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);
var model = Object.create(null);

var db = mongoose.connection;
db.on('error', console.log.bind(console, 'connection error'));
db.once('open', function () {
  console.log("we are connected");
});

var counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

var Counter = mongoose.model('counter', counterSchema);
// init

Counter.find({_id: 'entityId'}, function (err, arr) {
  if (arr.length === 0) {
    var newCounter = new Counter({_id: 'entityId', seq: 0});
    newCounter.save(function (err, counter) {
      console.log('init counter', counter);
    });
  } else {
    console.log('counter already created, with seq:', arr[0].seq);
  }
})

var urlSchema = new mongoose.Schema({
  _id: { type: Number },
  hostname: { type: String }
});

urlSchema.pre('save', function(next) {
  // update counter
  Counter.findByIdAndUpdate({ _id: 'entityId'}, { $inc: { seq: 1 } }, function (err, counter) {
    debugger;
    if (err) {
      return next(err);
    } else {
      this._id = counter.seq;  
      next();
    }
  }.bind(this));
});

var Url = mongoose.model('Url', urlSchema);


model.Url = Url;
model.Counter = Counter;

module.exports = model;