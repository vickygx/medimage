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
  tag.save(fn);
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
    {_image: imageId, tag_name: tagname}, fn);
}

/*  
    Function to retrieve that tags associated with an image id
    Inputs:
      fn - callback function 
*/
module.exports.getTagsOf = function(imageId, fn){
  // Finds all tags associated with the image id
  Tag.find( {_image: imageId}, 
             'tag_name',
             fn);
}

/*  
    Function that retrieves all the photos that have at 
    least one of the tags in the tags list
    Inputs:
      fn - callback function 
*/
module.exports.getPhotosWithEitherTag = function(tags, fn){
  Tag.find({tag_name: {$in: tags }}, fn);
}

/*  Function that searches for images with the listed tags
    and returns a list of JSON containing the MedImage object and the tags
    matched with the image. 
    params: 
      limit: integer indicicator how many photos passed into fn
      tags: list of strings of tag names
*/ 
module.exports.searchPhotosWithTags = function(tags, limit, fn){
  Tag.aggregate(
    [
      { $match: {
          tag_name: {$in: tags}
      }},
      { $group: {
          _id: "$_image",
          count: { $sum: 1 },
          tags: {$addToSet: '$tag_name'}
      }},
      { $sort : { count: -1 }},
      { $limit : limit }
    ], fn);
}
