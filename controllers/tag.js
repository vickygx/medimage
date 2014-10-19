/*  All the functions related to manipulating and retrieving information 
    from the tag database
*/
var Tag = require('../data/models/tag');
module.exports = {}


/*  
    Function that adds a tag called tagname to the image with
    image id
    Inputs:
      fn - callback function 
*/
module.exports.addTagTo = function(imageId, tagname, fn){
  // Create new tag relationship 
  var tag = new Tag({
    _image: imageId,
    tag_name: tagname.trim()
  });

  // Add to database
  tag.save(function(err, tg){
    fn(err, tg);
  });
}


/*  
    Function that removes a tag called tagname
    associated with the image of image id
    Inputs:
      fn - callback function 
*/
module.exports.removeTagFrom = function(imageId, tagname, fn){
  // Finds and removes the tag relationship object
  Tag.findOneAndRemove(
    {_image: imageId, tag_name: tagname},
    function(err, tg){
      fn(err, tg);
    });
}

/*  
    Function to retrieve that tags associated with an image id
    Inputs:
      fn - callback function 
*/
module.exports.getTagsOf = function(imageId, fn){
  // Finds all tags associated with the image id
  Tag.find(
    {_image: imageId}, 
    'tag_name',
    function(err, tags){
      fn(err, tags);
    });
}


/*  
    Function that retrieves all the photos that have all the tags
    in the tags list.
    Inputs:
      fn - callback function 
*/
module.exports.getPhotosWithEveryTag = function(tags, fn){
}

/*  
    Function that retrieves all the photos that have at 
    least one of the tags in the tags list
    Inputs:
      fn - callback function 
*/
module.exports.getPhotosWithEitherTag = function(tags, fn){
}
