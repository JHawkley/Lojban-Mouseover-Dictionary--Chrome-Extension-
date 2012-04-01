
// regexes
function formToRegex(form, head, tail) {
    /*
      Takes a string or an array of strings,
      interprets this as an OR of (a) consonant/vowel pattern(s),
      and returns a regular expression that matches.
      type is one of:
      - 'whole' (default) match the whole string
      - 'sequence' match a sequence of items
      - 'split' split a string up into parts described by form
     */
    if (!(form instanceof Array)) {
        form = [form];
    }
    // TODO: is Y a vowel???
    // TODO: what is h???

    // yo dawg i heard you like regex
    return new RegExp(
        head
            + '('
            + form.map(function (pat) {
                return pat
                    .replace(/[Cc]/g, '<C>')
                    .replace(/[Vv]/g, '<V>')
                    .replace(/[h']/g, '<h>')
                    .replace(/[Yy]/g, '<y>')
                    .replace(/<C>/g, "[bcdfgjklmnprstvxyz]")
                    .replace(/<V>/g, "[aeiou]")
                    .replace(/<h>/g, "[']")
                    .replace(/<y>/g, "[y]")
            }).join('|')
            + ')'
            + tail,
        'g');
}

var lojregex = {};
window.lojregex = lojregex;
lojregex.gismuForms = [
    'CVCCV',
    'CCVCV',
];
lojregex.cmavoForms = [
    // order might be important!!!
    'CVhV',
    'CVV',
    'CV',
    'CY',
    'VhV',
    'VV',
    'V',
];
lojregex.rafsiForms = [
    'CVhV',
    'CVV',
    'CCV',
    'CVC',
];
// match a whole gismu
lojregex.gismu = formToRegex(lojregex.gismuForms, '^', '$');
// match a sequence of cmavo
lojregex.cmavoSeq = formToRegex(lojregex.cmavoForms, '^', '+$');
// match each cmavo in a sequence
lojregex.cmavoSplitter = formToRegex(lojregex.cmavoForms, '', '');
//
lojregex.rafsiSplitter = formToRegex(lojregex.rafsiForms, '', '');
                           

function query(text) {
    // TODO: determine if text is gismu, lujvo, or cmavo
    // if lujvo, split into rafsi

    if (text.match(lojregex.gismu)) {
        //return { result: [['gismu']], select: 1 };
        return { result:[lookupGismu(text)], select: 1 };
    }
    else if (text.match(lojregex.cmavoSeq)) {
        return { select: 1,
                 result: ( text
                           .match(lojregex.cmavoSplitter)
                           .map(lookupCmavo)
                         )
               };
        // TODO: else luvjo, else rafsi sequence...
    }
    var result = lookupLujvo(text);
    if (result != null) return { result: [result], select: 1 };
    result = lookupRafsi(text);
    if (result != null) return { result: result, select: 1 };
    return { result: [['cannot', 'lex', 'the', 'selection']], select: 1 };
}

function lookupAny(text, func) {
    var def = func(text);
    if (def) {
        return [
            text,
            def.english,
            def.definition,
        ];
    } else {
        return null;
    }
}

function lookupCmavo(text) {
    return lookupAny(text, lojbanDictionary.cmavo);
}

function lookupGismu(text) {
    return lookupAny(text, lojbanDictionary.gismu);
}

function lookupLujvo(text) {
    return lookupAny(text, lojbanDictionary.lujvo);
}

function cleanArray(actual){
  var newArray = new Array();
  for(var i = 0; i<actual.length; i++){
    if (actual[i]){
      newArray.push(actual[i]);
    }
  }
  return newArray;
}

function lookupRafsi(text) {
    var doLookup = function(str) { return lookupAny(str, lojbanDictionary.rafsi); }
    var match = text.match(lojregex.rafsiSplitter);
    if (match == null) return null;
    var retVal = cleanArray(match.map(doLookup));
    if (retVal.length > 0) return retVal;
    return null;
}