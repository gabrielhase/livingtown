this.models || (this.models = {}); // namespace models to separate them from angular code

models.Message = (function() {

  function Message(message, lat, lng) {
    // user-friendly validation is done in the view
    // if a message > 140 chars gets here, it's a hack so just trim
    if (message.length > 140) {
      message = message.substring(0, 140);
    }
    this.message = message;
    this.lat = lat;
    this.lng = lng;
  }

  return Message;
})();
