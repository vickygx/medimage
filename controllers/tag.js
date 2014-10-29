/*  All the functions related to manipulating and retrieving information 
    from the Tag database

    @author: Vicky Gong
*/
var Tag = require('../data/models/tag');
var errors = require('../errors/errors');
module.exports = {}


var getTagKey = function(tagname){
  return tagname.trim().toLowerCase();
}

/*  
    Function that adds a tag called tagname to the image with
    image id
    Inputs:
      fn - callback function 
*/
module.exports.addTagTo = function(imageId, tagname, fn){
  var tag_key = getTagKey(tagname);
  // Check if tag already associated with imageId
  Tag.find({_image: imageId, tag_name: tag_key}, function(err, tag){
    if (err)
      fn(err);
    else if (tag && tag.length > 0){
      return fn(errors.tags.alreadyExistsError);
    }
    else {
      // Create new tag relationship 
      var tag = new Tag({
        _image: imageId,
        tag_name: tag_key
      });

      // Add to database
      tag.save(fn);
    }
  });
}

/*  
    Function that removes a tag called tagname
    associated with the image of image id
    Inputs:
      fn - callback function 
*/
module.exports.removeTagFrom = function(imageId, tagname, fn){
  var tag_key = getTagKey(tagname);
  // Finds and removes the tag relationship object
  Tag.findOneAndRemove(
    {_image: imageId, tag_name: tag_key}, fn);
}

/**
 * Removes all tags associated with the specified image
 *
 * @param {ObjectID} imageID
 * @param {Function} fn - callback function
 */
module.exports.removeTagsFrom = function(imageID, fn) {
  Tag.remove({ _image: imageID }, fn);
}

/**
 * Gets a list of imageId and tags that are associated with that imageId
 *
 * @param {Array} of imageID
 * @param {Function} fn - callback function
 *
 * returns: list with each item in following format
 *      {_id: <MedImage id>, tags: <set of tags>}
 */
module.exports.getTagsByImageIDs = function(imageIDs, fn){
  Tag.aggregate(
    [
      { $match: {
          _image: {$in: imageIDs}
      }},
      { $group: {
          _id: "$_image",
          tags: {$addToSet: '$tag_name'}
      }},
    ], fn);
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
  var tag_keys = tags.map(function(tag){ return getTagKey(tag);});
  Tag.find({tag_name: {$in: tag_keys }}, fn);
}

/*  Function that searches for images with the listed tags
    and returns a sorted list of JSON containing the MedImage id and the tags
    matched with the image. This is sorted by number of tags.
      limit: integer indicicator how many photos passed into fn
      tags: list of strings of tag names
*/ 
module.exports.searchPhotosWithTags = function(tags, limit, fn){
  var tag_keys = tags.map(function(tag){ return getTagKey(tag);});
  Tag.aggregate(
    [
      { $match: {
          tag_name: {$in: tag_keys}
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

