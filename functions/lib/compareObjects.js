const transform = require('lodash/transform')
const isEqual = require('lodash/isEqual')
const isObject = require('lodash/isObject')

/**
 * Deep diff between two objects
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
module.exports = (object, base) => {
   return transform(object, (result, value, key) => {
      if (!isEqual(value, base[key])) {
         result[key] =
            isObject(value) && isObject(base[key]) ? difference(value, base[key]) : value
      }
   })
}
