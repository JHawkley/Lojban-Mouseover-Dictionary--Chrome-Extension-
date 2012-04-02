//The constructor has the ability to generate the dictionary lists automatically
//by parsing the XML file (obtained by the XML dump feature of jbovlaste),
//however that is obviously extremely inefficient, especially since a join
//is needed to get the english gloss word.  XML isn't known for being friendly
//with that sort of operation.

//So, I have been using JSON.stringify from the dev console after the program
//gets done generating the dictionary objects for each word type to create the JSON
//files containing the main dictionary and reformatting the definitions slightly
//using the regular expression below.

//Replace RegEx:  \$?(\w+?)_\{?(\d)\}?\s?(=?)\s?\$?
//Matches the sumti positions in the definitions and provides capture groups
//to reformat them into something kinder to the eyes.  Works well with RegExr.

//To force the program to regenerate the dictionary lists from the XML, just comment
//out all the JSON.parse calls for each list.

(function() {
var cmavolist, fuhivlalist, gismulist, lDict, lujvolist, rafsilist, read, readXml, _source,
  __hasProp = Object.prototype.hasOwnProperty;

read = function(url) {
  var h;
  h = new XMLHttpRequest();
  h.open('GET', url, false);
  h.send();
  if (h.status !== 200) return null;
  return h.response;
};

readXml = function(url) {
  var h, resDoc;
  h = new XMLHttpRequest();
  h.open('GET', url, false);
  h.send();
  if (h.status !== 200) return null;
  resDoc = h.responseXML;
  if (resDoc == null) {
    resDoc = (new DOMParser()).parseFromString(h.responseText, 'text/xml');
  }
  return resDoc;
};

_source = null;

cmavolist = null;

gismulist = null;

lujvolist = null;

fuhivlalist = null;

rafsilist = null;

try {
  cmavolist = JSON.parse(read('cmavo.json'));
  gismulist = JSON.parse(read('gismu.json'));
  lujvolist = JSON.parse(read('lujvo.json'));
  fuhivlalist = JSON.parse(read('fuhivla.json'));
} catch (_error) {}

lDict = (function() {

  function lDict() {
    var doRafsi, parse, source;
    try {
      parse = function(dictionary, type) {
        var newEntry, node, retVal, valsi, x, xpathStringLiteral, y, _i, _len, _ref;
        xpathStringLiteral = function(s) {
          if (s.indexOf('"' === -1)) return '"' + s + '"';
          if (s.indexOf("'" === -1)) return "'" + s + "'";
          return 'concat("' + s.replace(/"/g, '",\'"\',"') + '")';
        };
        retVal = {};
        x = dictionary.evaluate("/dictionary/direction[@from='lojban']/valsi[@type=" + (xpathStringLiteral(type)) + "]", dictionary, null, 4);
        while ((valsi = x.iterateNext()) != null) {
          newEntry = {
            word: valsi.attributes['word'].value
          };
          _ref = valsi.childNodes;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            node = _ref[_i];
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.nodeName === 'rafsi') {
                if (newEntry[node.nodeName] == null) newEntry[node.nodeName] = [];
                newEntry[node.nodeName].push(node.textContent);
              } else {
                newEntry[node.nodeName] = node.textContent;
              }
            }
          }
          y = dictionary.evaluate("/dictionary/direction[@from='English']/nlword[@valsi=" + (xpathStringLiteral(newEntry.word)) + "]/@word", dictionary, null, 9);
          newEntry.english = y.singleNodeValue != null ? y.singleNodeValue.value : '(no gloss word)';
          retVal[newEntry.word] = newEntry;
        }
        return retVal;
      };
      doRafsi = function() {
        var key, list, raf, retVal, value, _i, _j, _len, _len2, _ref, _ref2, _ref3;
        if (!((cmavolist != null) && (gismulist != null))) return null;
        retVal = {};
        _ref = [cmavolist, gismulist];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          list = _ref[_i];
          for (key in list) {
            if (!__hasProp.call(list, key)) continue;
            value = list[key];
            if (((_ref2 = value.rafsi) != null ? _ref2.length : void 0) > 0) {
              _ref3 = value.rafsi;
              for (_j = 0, _len2 = _ref3.length; _j < _len2; _j++) {
                raf = _ref3[_j];
                retVal[raf] = value;
              }
            }
          }
        }
        return retVal;
      };
      source = function() {
        if (_source == null) _source = readXml('lojban-english-xml-export.xml');
        return _source;
      };
      if (cmavolist == null) cmavolist = parse(source(), 'cmavo');
      if (gismulist == null) gismulist = parse(source(), 'gismu');
      if (lujvolist == null) lujvolist = parse(source(), 'lujvo');
      if (fuhivlalist == null) fuhivlalist = parse(source(), 'fu\'ivla');
      if (rafsilist == null) rafsilist = doRafsi();
    } catch (err) {
      window.error = err;
      alert(err);
    }
  }

  lDict.prototype.cmavo = function(word) {
    if (cmavolist[word] != null) return cmavolist[word];
    return null;
  };

  lDict.prototype.gismu = function(word) {
    if (gismulist[word] != null) return gismulist[word];
    return null;
  };

  lDict.prototype.lujvo = function(word) {
    if (lujvolist[word] != null) return lujvolist[word];
    if (fuhivlalist[word] != null) return fuhivlalist[word];
    return null;
  };

  lDict.prototype.rafsi = function(word) {
    if (rafsilist[word] != null) return rafsilist[word];
    return null;
  };

  return lDict;

})();

window.LojbanDictionary = lDict;
})();

/*  --Source CoffeeScript--

read = (url) ->
  h = new XMLHttpRequest()
  h.open 'GET', url, false
  h.send()
  return null if h.status isnt 200
  return h.response;

readXml = (url) ->
  h = new XMLHttpRequest()
  h.open 'GET', url, false
  h.send()
  return null if h.status isnt 200
  resDoc = h.responseXML
  resDoc = (new DOMParser()).parseFromString(h.responseText, 'text/xml') unless resDoc?
  return resDoc;

_source = null

cmavolist = null
gismulist = null
lujvolist = null
fuhivlalist = null
rafsilist = null
try
  cmavolist = JSON.parse(read 'cmavo.json')
  gismulist = JSON.parse(read 'gismu.json')
  lujvolist = JSON.parse(read 'lujvo.json')
  fuhivlalist = JSON.parse(read 'fuhivla.json')

class lDict
  constructor: ->
    try
      parse = (dictionary, type) ->
        xpathStringLiteral = (s) ->
          return '"'+s+'"' if s.indexOf '"' is -1
          return "'"+s+"'" if s.indexOf "'" is -1
          return 'concat("' + s.replace(/"/g, '",\'"\',"') + '")'
        retVal = {}
        x = dictionary.evaluate "/dictionary/direction[@from='lojban']/valsi[@type=#{xpathStringLiteral type}]", dictionary, null, 4
        while (valsi = x.iterateNext())?
          newEntry = { word: valsi.attributes['word'].value }
          for node in valsi.childNodes when node.nodeType is Node.ELEMENT_NODE
            if node.nodeName is 'rafsi'
              newEntry[node.nodeName] = [] unless newEntry[node.nodeName]?
              newEntry[node.nodeName].push node.textContent
            else
              newEntry[node.nodeName] = node.textContent
          y = dictionary.evaluate "/dictionary/direction[@from='English']/nlword[@valsi=#{xpathStringLiteral newEntry.word}]/@word", dictionary, null, 9
          newEntry.english = if y.singleNodeValue? then y.singleNodeValue.value else '(no gloss word)'
          retVal[newEntry.word] = newEntry
        return retVal
      doRafsi = () ->
        return null unless cmavolist? and gismulist?
        retVal = {}
        for list in [cmavolist, gismulist]
          for own key, value of list when value.rafsi?.length > 0
            retVal[raf] = value for raf in value.rafsi
        return retVal
      source = () ->
        _source = readXml 'lojban-english-xml-export.xml' unless _source?
        return _source
      cmavolist = parse source(), 'cmavo' unless cmavolist?
      gismulist = parse source(), 'gismu' unless gismulist?
      lujvolist = parse source(), 'lujvo' unless lujvolist?
      fuhivlalist = parse source(), 'fu\'ivla' unless fuhivlalist?
      rafsilist = doRafsi() unless rafsilist?
    catch err
      window.error = err
      alert err
  
  cmavo: (word) ->
    return cmavolist[word] if cmavolist[word]?
    return null
  
  gismu: (word) ->
    return gismulist[word] if gismulist[word]?
    return null
  
  lujvo: (word) ->
    return lujvolist[word] if lujvolist[word]?
    return fuhivlalist[word] if fuhivlalist[word]?
    return null
  
  rafsi: (word) ->
    return rafsilist[word] if rafsilist[word]?
    return null
window.LojbanDictionary = lDict
*/