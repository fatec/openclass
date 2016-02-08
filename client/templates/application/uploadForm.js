Template.uploadForm.created = function() {
  Uploader.init(this);

  if (this.data) {
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

    // we display different result when running or not
    return progress.running ?
      info.name + ' - ' + progress.progress + '% - [' + progress.bitrate + ']' :
      info.name + ' - ' + info.size + 'B';
  },
  'progress': function() {
    return Template.instance().globalInfo.get().progress + '%';
  }
})
