
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
                    .replace(/[Yy]/g, '<Y>')
                    .replace(/<C>/g, "['abcdefgijklmnoprstuvxyz]")
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
    'VhV',
    'VV',
    'V',
];
// match a whole gismu
lojregex.gismu = formToRegex(lojregex.gismuForms, '^', '$');
// match a sequence of cmavo
lojregex.cmavoSeq = formToRegex(lojregex.cmavoForms, '^', '+$');
// match each cmavo in a sequence
lojregex.cmavoSplitter = formToRegex(lojregex.cmavoForms, '', '');
                           

function query(text) {
    // TODO: determine if text is gismu, lujvo, or cmavo
    // if lujvo, split into rafsi

    if (text.match(lojregex.gismu)) {
        return { result: [['gismu']], select: 1 };
        return { result:[lookupGismu(text)], select: 1 };
    } else if (text.match(lojregex.cmavoSeq)) {
        return { select: 1,
                 result: ( text
                           .match(lojregex.cmavoSplitter)
                           //.map(alert)
                           .map(lookupCmavo)
                         )
               };
        // TODO: else luvjo, else rafsi sequence...
    } else {
        return { result: [['cannot', 'lex', 'the', 'selection']], select: 1 };
    }
}

function lookupCmavo(text) {
    var def = lojbanDictionary.cmavo(text);
    if (def) {
        //alert('cmavo');
        return [
            text,
            def.eng,
            def.def,
        ];
    } else {
        return null;
    }
}

function lookupRafsi(text) {
    alert('NOOOOOO');
    throw 'asdfadfadsf';
}

function lookupGismu(text) {
    def = lojbanDictionary.gismu(text);
    if (def) {
        return [
            text,
            def.eng,
            def.def,
        ];
    } else {
        return null;
    }
}