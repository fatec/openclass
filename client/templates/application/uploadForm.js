Template.uploadForm.created = function() {
  Uploader.init(this);

  if (this.data) {
    console.log(this.data);
        //Resizer.resize(files[0], {width: 300, height: 300, cropSquare: true}, function(err, file) {

    this.autoStart = this.data.autoStart;
  }
}

Template.uploadForm.rendered = function () {
  Uploader.render.call(this);


};

Template.uploadForm.events({
  'click .start': function (e) {
    //Uploader.startUpload.call(Template.instance(), e);
  }
});

Template.uploadForm.helpers({
  'infoLabel': function() {
    var instance = Template.instance();

    // we may have not yet selected a file
    var info = instance.info.get()
    if (!info) {
      return;
    }


    var progress = instance.globalInfo.get();

    if (progress.progress != 100) {
      $(".post-submit--button-submit").hide();
      $(".post-edit--button-submit").hide();

    }
    // else
    //     $(".post-submit--button-submit").hide();


    // we display different result when running or not
    return progress.running ?
      info.name + ' - ' + progress.progress + '% - [' + progress.bitrate + ']' :
      info.name + ' - ' + info.size + 'B';
  },
  'progress': function() {
    return Template.instance().globalInfo.get().progress + '%';
  }
})