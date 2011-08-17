//var i18n = chrome.i18n.getMessage;

var info = {
    about: 'register',
    //    name: i18n('extName'),
    name: 'Lojban',
    unit: 'word',
    first: 1,
    badge: "JBO",
    items: {
        classes: ['type', 'eng', 'def'],
        //        names: [i18n('char'), i18n('charcode')],
        name: ['type', 'eng', 'def'],
        samples: ['A', '65']
    },
    wordDef: {
        isWord: "a-z,'"
    },
    max: 100,
    
    styles: {
        "outer": {
            backgroundColor:    "#439c17",
            borderRadius:       8,
            borderColor:        "#51b320",
            borderWidth:        3,
        },
        "type": {
            fontSize:           20,
            fontFamily:         "sans-serif",
            color:    "#ff0000",
        },
        "eng": {
            fontSize:           20,
            fontFamily:         "sans-serif",
        },
        "def": {
            color:              "#b3e6b3",
            fontSize:           14,
        }
    }
        
};

// no that's not random garbage
// it's the extension id of Mouseover Dictionary Framework
if (chrome.extension) {
    chrome.extension.sendRequest('fcabdhekhndgdciilfhbmiepfnjabeda', info);


    chrome.extension.onRequestExternal.addListener(
        function(request, sender, sendResponse) {
            switch(request.about) {
            case 'available?':
                sendResponse(info);
                break;
            case 'load':
                // load external data if needed
                // *might* happen more than once before unload...
                sendResponse({complete: true});
                break;
            case 'unload':
                // unload external data if it was loaded ...?
                sendResponse({complete: true});
                break;
            case 'firstQuery':
            case 'oneTimeQuery':
                sendResponse(query(request.text));
                break;
            default:
                sendResponse({});
            }
        }
    );
}

// regexes

function formToRegexStringSimple(form) {
    // TODO: is Y a vowel???
    // TODO: what is h???
    var alpha = "['abcdefgijklmnoprstuvxyz]";
    var vowel = "[aeiou]";
    var consonant = "[bcdfgjklmnprstvxz]";
    var apos = "[']";
    var schwa = "[y]";
    var letters = form.split('');
    var prefix = '';
    var regexes = [];
    for (var i=0; i<letters.length; i++) {
        switch (letters[i]) {
        case 'C':
        case 'c':
            regexes.push(consonant);
            break;
        case 'V':
        case 'v':
            regexes.push(vowel);
            // 1st letter is vowel implies can start with full stop?
            if (i===0) prefix = '\\.?'; 
            break;
        case 'h':
        case "'":
            regexes.push(apos);
            break;
        case 'Y':
        case 'y':
            regexes.push(schwa);
            break;
        case '|':
            regexes.push("|");
            break;
        default:
            throw 'error: formToRegexString: bad lojban form';
            break;
        }
    }
    return prefix + regexes.join('');
}

function formToRegexStringComplex(form) {
    return "("
        + (form
           .split("|")
           .map(formToRegexStringSimple)
           .join(")|("))
        + ")";
}

function formToRegex(form) {
    return new RegExp("^(" + formToRegexStringComplex(form) + ")$");
}

function formToRegexSequence(form) {
    return new RegExp("^(" + formToRegexStringComplex(form) + ")+$");
}

var lojregex = {};
window.lojregex = lojregex;
lojregex.gismuForms = [
    'CVCCV',
    'CCVCV',
];
lojregex.cmavoForms = [
    'V',
    'VV',
    'VhV',
    'CV',
    'CVV',
    'CVhV',
];
// match a whole gismu
lojregex.gismu = formToRegex(lojregex.gismuForms.join("|"));
// match a whole cmavo
lojregex.cmavo = formToRegex(lojregex.cmavoForms.join("|"));
// match a sequence of cmavo
lojregex.cmavoSeq = formToRegexSequence(lojregex.cmavoForms.join("|"));
// match each cmavo in a sequence
lojregex.cmavoSplitter = new RegExp(
    formToRegexStringComplex(lojregex.cmavoForms.join("|")),
    'g');

                           

function query(text) {
    // TODO: determine if text is gismu, lujvo, or cmavo
    // if lujvo, split into rafsi

    if (text.match(lojregex.gismu)) {
        return {result:[lookup(text, 'gismu')], select: 1};
    } else if (text.match(lojregex.cmavo)) {
        // TODO: remove this redundant case (cmavo seq covers it)
        type = 'cmavo';
        return {result:[lookup(text, 'cmavo')], select: 1};
    } else if (text.match(lojregex.cmavoSeq)) {
        return { select: 1,
                 result: ( text
                           .match(lojregex.cmavoSplitter)
                           .map(lookupCmavo)
                         )
               };
    } else {
        return { result: [['cannot', 'lex', 'selection']], select: 1 };
    }
}

function lookupCmavo(text) {
    return lookupCmavo(text, 'cmavo');
}
function lookup(text, type) {
    // lookup a single basic word and return its definition
    var eng;
    var def;
    if (typeof lojbanDictionary == 'undefined') {
        // BIG fail: where is the dictionary???
        eng = '---';
        def = '(no dictionary found!!!)';
    } else {
        var entry = lojbanDictionary[text];
        window.entry = entry;
        if (typeof entry == 'undefined') {
            eng = '---';
            def = '(no definition found)';
        } else {
            eng = entry.english;
            def = entry.definition;
        }
    }
    return [type, eng, def];
    
}