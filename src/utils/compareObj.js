/* eslint-disable */

export const compareObj = (obj1, obj2) => {
  // compute objects type
  const type1 = Object.prototype.toString.call(obj1);
  const type2 = Object.prototype.toString.call(obj2);
  if (type1 !== '[object Array]' && type1 !== '[object Object]') return false;
  if (type2 !== '[object Array]' && type2 !== '[object Object]') return false;

  // If the two objects are not the same type, return false  
  if (type1 !== type2) return false;

  // compare the length
  if (type1 === '[object Array]' && obj1.length !== obj2.length) return false;

  if (type1 === '[object Object]') {
    // compute keys
    const keys1 = Object.keys(obj1).sort((a ,b) => a > b);
    const keys2 = Object.keys(obj2).sort((a ,b) => a > b);

    // compare array of keys length
    if (keys1.length !== keys2.length) return false;
  }

  const compare = (item1, item2) => {
    const itemType = Object.prototype.toString.call(item1);

        // If an object or array, compare recursively
        if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
            if (!compareObj(item1, item2)) return false;
    }
    else {
            // If the two items are not the same type, return false
            if (itemType !== Object.prototype.toString.call(item2)) return false;
            if (item1 !== item2) return false;
        }
  }

  // Compare properties
    if (type1 === '[object Array]') {
        for (var i = 0; i < obj1.length; i++) {
            if (compare(obj1[i], obj2[i]) === false) return false;
        }
    } else {
        for (var key in obj1) {
            if (obj1.hasOwnProperty(key)) {
                if (compare(obj1[key], obj2[key]) === false) return false;
            }
        }
    }
  
  return true;
};

export const biggestObject = (obj1, obj2) => {
  if (!obj1 && !obj2) {
    return obj1
  }
  const nbKeys1 = !!obj1 && Object.keys(obj1).length || 0;
  const nbKeys2 = !!obj2 && Object.values(obj2).length || 0;
  if (nbKeys1 > nbKeys2) {
    return obj1
  } else if (nbKeys1 < nbKeys2) {
    return obj2
  } else {
    const nbValues1 = Object.keys(obj1).filter((key) => obj1[key].length > obj2[key].length || !!obj2[key]);
    const nbValues2 = Object.keys(obj2).filter((key) => obj2[key].length > obj1[key].length || !!obj1[key]);
    return (nbValues1 > nbValues2) ? obj1 : obj2;
  }
};