/*

(\.[^\r\n\s\"\']|[\,][^\s"']|[\;\:][^\s]|\b[Ss]ec\b|\b[Aa]rc\b|\b[Bb]om\b|\b[Cc]omers?|\. [a-z]|\b1\b|[a-zA-z]\d|\d[a-zA-Z]|\b[Bb]um|[\^\@«»\*£]+|\bdien?\b|—\-|\-—|[.,!? \r\n]\-|\-[.,!? \r\n]|\btiling|(^|\s)['"]($|\s)|\b[Tt]ire\b)
*/

function doSel(func)
{
    return () => {
        var textbox = document.getElementById('wpTextbox1');
        var selStart = textbox.selectionStart;
        var selEnd = textbox.selectionEnd;
        var text = textbox.value.substring(selStart, selEnd);
        console.log(text);
        if (!text.length)
            return;

        var res = func(text, selStart, selEnd, text.length);

        textbox.focus();
        textbox.value = textbox.value.substring(0, selStart)
            + res + textbox.value.substring(textbox.selectionEnd);
        textbox.selectionStart = selStart;
        textbox.selectionEnd = selStart + res.length;
    }
}

function doSelOrAll(func)
{
    return () => {
        var textbox = document.getElementById('wpTextbox1');
        var selStart = textbox.selectionStart;
        var selEnd = textbox.selectionEnd;
        var text = textbox.value;
        if (textbox.selectionStart != textbox.selectionEnd)
            text = text.substring(selStart, textbox.selectionEnd);
        console.log(text);

        var res = func(text, selStart, selEnd, text.length);

        if (textbox.selectionStart != textbox.selectionEnd) {
            textbox.focus();
            textbox.value = textbox.value.substring(0, selStart)
                + res + textbox.value.substring(textbox.selectionEnd);
            textbox.selectionStart = selStart;
            textbox.selectionEnd = selStart + res.length;
        } else {
            textbox.focus();
            textbox.value = res;
            textbox.selectionStart = 0;
            textbox.selectionEnd = res.length;
        }
    }
}

function doInsert(func)
{
    return () => {
        var textbox = document.getElementById('wpTextbox1');
        var selStart = textbox.selectionStart;
        var selEnd = textbox.selectionEnd;

        var res = func();

        textbox.focus();
        textbox.value = textbox.value.substring(0, selStart)
            + res + textbox.value.substring(textbox.selectionEnd);
        textbox.selectionStart = textbox.selectionEnd = selStart + res.length;
    }
}

function simpleTag(tag)
{
    return function(text)
    {
        var addSpace = false;
        if (text.endsWith(' '))
        {
            addSpace = true;
            text = text.substring(0, text.length - 1);
        }
        res = '{{' + tag + '|' + text + '}}';
        if (addSpace)
            res += ' ';
        return res;
    }
}

function fixHyphens(poem) {
    var text = $('#wpTextbox1').val();

    text = text.replaceAll(/\.( +\.){1,}/g, function(m) { return m.replaceAll(' ', ''); });
    text = text.replace(/([^\.\{])(\.\.\.\.\.+)([^\.\|\}])/g, (m, p1, p2, p3) => { return (p1 || '') + '{{...|' + p2.length + "}}" + (p3 || ''); });
    text = text.replace(/([^\.\{])\.\.\.\.([^\.\|\}])/g, '$1{{....}}$2');
    text = text.replace(/([^\.\{])\.\.\.([^\.\|\}])/g, '$1{{...}}$2');

    text = text.replace(/ *\n */g, '\n');
    text = text.replace(/  /g, ' ');
    text = text.replace(/\t/g, '{{bar|2}}');
    text = text.replace(/‘\s+‘/g, '“');
    text = text.replace(/’\s+’/g, '”');
    text = text.replace(/“[ ]*/g, '"');
    text = text.replace(/[ ]*”/g, '"');
    text = text.replace(/[‘][ ]*/g, "'");
    text = text.replace(/[’]/g, "'");
    text = text.replace(/[ ]*([\!\,\.\?\;\:])/g, '$1');
    text = text.replace(/¬\n([^ \n]+) +/g, '$1\n');
    text = text.replace(/¬\n([^ \n]+)\n/g, '$1\n');

    if (!poem)
    {
        text = text.replace(/([\-—])\n([^ \n]+) +/g, '$1$2\n');
        text = text.replace(/([\-—])\n([^ \n]+)\n/g, '$1$2\n');
        text = text.replace(/([\-])\n([^ \n]+) +/g, '$1$2\n');
        text = text.replace(/([\-])\n([^ \n]+)\n/g, '$1$2\n');
    }

    text = text.replace(/ *— */g, '—');
    text = text.replace(/\n+$/g, '\n');

    $('#wpTextbox1').val(text);
}

function addNop() {
    var text = $('#wpTextbox1').val();

    text = text.replace(/\n+$/g, '');
    text += '\n{{nop}}\n';

    $('#wpTextbox1').val(text);
}

function diSc(text) {

    var addQuote = (() => {
        if (text.startsWith('"') || text.startsWith('“') || text.startsWith('”'))
        {
            text = text.substring(1);
            return true;
        }
        return false;
    })();
    var res = "{{di|";
    if (addQuote)
        res += 'fl="|';
    res += text.substring(0, 1) + "}}";
    text = text.substring(1);
    if (text.startsWith(' '))
    {
        res += ' ';
        text = text.substring(1);
    }
    var addSpace = (() => {
        if (text.endsWith(' '))
        {
            text = text.substring(0, text.length - 1);
            return true;
        }
        return false;
    })();
    if (text.length)
    {
        res += "{{sc|" + text + "}}";
    }
    if (addSpace)
        res += ' ';

    return res;
}

function diUc(text) {
    var addQuote = (() => {
        if (text.startsWith('"') || text.startsWith('“') || text.startsWith('”'))
        {
            text = text.substring(1);
            return true;
        }
        return false;
    })();
    var res = "{{di|";
    if (addQuote)
        res += 'fl="|';
    res += text.substring(0, 1) + "}}";
    text = text.substring(1);
    if (text.startsWith(' '))
    {
        res += ' ';
        text = text.substring(1);
    }
    var addSpace = (() => {
        if (text.endsWith(' '))
        {
            text = text.substring(0, text.length - 1);
            return true;
        }
        return false;
    })();
    if (text.length)
    {
        res += "{{uc|" + text.toLowerCase() + "}}";
    }
    if (addSpace)
        res += ' ';

    return res;
}

function mytoolbar_CUc(text) {
    return "{{c|{{uc|" + text + "}}}}";
}

function mytoolbar_cr() {

    var textbox = document.getElementById('wpTextbox1');
    var selStart = textbox.selectionStart

    var res = "{{cr|fct|60}}";

    textbox.focus();
    textbox.value = textbox.value.substring(0, selStart) + res + textbox.value.substring(selStart);
    textbox.selectionStart = selStart;
    textbox.selectionEnd = selStart + res.length;
}

function mytoolbar_section(text) {

    var sectionName = prompt("Enter section name:");
    if (!sectionName)
        return;

    var res = text;
    if (!res.startsWith("\n"))
        res = "\n" + res;
    if (!res.endsWith("\n"))
        res = res + "\n";
    res = "## " + sectionName + " ##" + res + "####\n";

    return res
}

function mytoolbar_poem(ppoem)
{
    return function(text)
    {
        var res = text;
        var addN = false;
        if (!res.startsWith("\n"))
            res = "\n" + res;
        if (res.endsWith("\n"))
            add_n = true;
        else
            res = res + "\n";

        if (ppoem)
            res = "{{ppoem|" + res + "}}";
        else
            res = "<poem>" + res + "</poem>";

        if (addN)
            res = res + "\n";

        return res;
    };
}

function mytoolbar_block(type)
{
    return function(text) {
        var prependCr = false;
        var appendCr = false;
        if (text.startsWith('\n'))
        {
            text = text.substring(1);
            prependCr = true;
        }
        if (text.endsWith('\n'))
        {
            text = text.substring(0, text.length - 1);
            appendCr = true;
        }
        res = "{{" + type + " block|" + text + "}}";
        if (prependCr)
            res = "\n" + res;
        if (appendCr)
            res += "\n";

        return res;
    };
}

function mytoolbar_lp(text)
{
    var addSpace = false;
    if (text.endsWith(' '))
    {
        addSpace = true;
        text = text.substring(0, text.length - 1);
    }
    res = '{{lp||';
    if (text.length > 1)
    {
        res += text.substring(0, text.length - 1) + "|" + text.substring(text.length - 1);
    }
    else
    {
        res += text;
    }
    res += "}}";
    if (addSpace)
        res += ' ';
    return res;
}

function mytoolbar_cbs(text) {
    var prependCr = false;
    var appendCr = false;
    if (text.startsWith('\n'))
    {
        text = text.substring(1);
        prependCr = true;
    }
    if (text.endsWith('\n'))
    {
        text = text.substring(0, text.length - 1);
        appendCr = true;
    }
    res = "{{center block/s}}" + text + "{{center block/e}}";
    if (prependCr)
        res = "\n" + res;
    if (appendCr)
        res += "\n";

    return res;

}

function mytoolbar_cbs_tb() {
    var header = document.getElementById("wpHeaderTextbox");
    var footer = document.getElementById("wpFooterTextbox");
    header.value = header.value + "{{center block/s}}";
    footer.value = "\n{{center block/e}}" + footer.value;
}

function mytoolbar_cbs_b() {
    doSelOrAll((text) => {
        return "{{center block/s}}" + text;
    })();
    var footer = document.getElementById("wpFooterTextbox");
    footer.value = "\n{{center block/e}}" + footer.value;
}

function mytoolbar_cbs_t() {
    doSelOrAll((text) => {
        var res = text;
        if (res.endsWith('\n'))
        {
            res = res.substring(0, res.length - 1);
        }
        return res + "{{center block/e}}\n";
    })();
    var header = document.getElementById("wpHeaderTextbox");
    header.value = header.value + "{{center block/s}}";
}

function mytoolbar_dhr() {
    return '{{dhr}}';
}

function mytoolbar_gaps(ppoem) {
    return function(text) {
        var step = parseInt(prompt("Enter the interval between lines (default: 1)"));
        var offset = parseInt(prompt("Enter the offset of the first gap (default: 1)"));
        var width = parseInt(prompt("Enter the gap width in 'em' (default: 2)"));
        var gap = ppoem ? "::" : "{{gap}}";
        if (isNaN(step))
            step = 1;
        if (isNaN(offset))
            offset = 1;
        if (!isNaN(width) && width != 2)
            gap = ppoem ? ":".repeat(width) : "{{gap|" + width + "em}}";

        var res = text;
        var addNewLine = (() => {
            if (res.endsWith("\n"))
            {
                res = res.substring(0, res.length - 1);
                return true;
            }
            return false;
        })();

        res = res.split("\n\n").map((couplet) => {
            return couplet.split("\n").map((line, ix) => {
                if (ix >= offset) {
                    ix -= offset;
                    if (ix % (step + 1) == 0)
                        return gap + line;
                }
                return line;
            }).join("\n");
        }).join("\n\n");

        if (addNewLine)
            res += "\n";

        console.log(res);

        return res;
    }
}

function mytoolbar_overfloat_left(text)
{
    var depth = parseFloat(prompt("Enter depth:"));
    text = "{{overfloat left|" + text;
    if (!depth.isNaN)
        text += "|depth=" + depth + "em";
    return text + "}}";
}

function mytoolbar_paragraphs(text)
{
    const append = text.match(/\n+$/g);
    if (append)
        text = text.substring(0, text.length - append[0].length);

    var res = text.split("\n\n").map((paragraph) =>
    {
        var result = "";
        paragraph.split("\n").forEach((line, i, lines) => {
            result += line;
            if (i == lines.length - 1)
                return;
            if (line.endsWith("¬"))
            {
                result = result.substring(0, result.length - 1);
                return;
            }
            if (line.endsWith("-") || line.endsWith("−") || line.endsWith("—"))
                return;
            if (i < lines.length - 1)
                if (lines[i + 1].startsWith("-") || lines[i + 1].startsWith("−") || lines[i + 1].startsWith("—"))
                    return;
            result += " ";
        });
        return result;
    }).join("\n\n");

    if (append)
        res += append[0];

    return res;
}

function add_button(id, name, callback)
{
    $('.MyCustomToolbar').append('<input id="' + id + '" type="button" class="oo-ui-buttonElement-button" value="' + name +'" />');
    $('#' + id).click(callback);
}

$(document).ready(function() {
    var page_heading = $('#firstHeading').text();
    if (!page_heading.startsWith('Editing Page:') && !page_heading.startsWith('Creating Page:'))
        return;

    if ($('.MyCustomToolbar').length)
        return;

    $('#firstHeading').append('<div class="MyCustomToolbar" style="all:unset;display:inline-block;margin-left:1em;"></div>');
    add_button('FixScannos', 'Fix scannos', ()=>{fixHyphens(false);});
    add_button('FixScannosP', '(P))', ()=>{fixHyphens(true);});
    add_button('AddNOP', 'Add NOP', addNop);
    add_button('DiSc', '{{di|}}{{sc}}', doSel(diSc));
    add_button('DiUc', '{{di|}}{{UC|}}', doSel(diUc));
    add_button('mytoolbar_CUc', '{{c|{{UC|}}}}', doSel(mytoolbar_CUc));
    add_button('mytoolbar_cr', 'cr', mytoolbar_cr);
    add_button('mytoolbar_section', 'section', doSel(mytoolbar_section));
    add_button('mytoolbar_poem', '<poem>', doSelOrAll(mytoolbar_poem()));
    add_button('mytoolbar_ppoem', '{{ppoem|}}', doSelOrAll(mytoolbar_poem(true)));
    add_button('mytoolbar_c', 'c', doSel(simpleTag('c')));
    add_button('mytoolbar_cb', 'cb', doSelOrAll(mytoolbar_block('center')));
    add_button('mytoolbar_ib', 'ib', doSelOrAll(mytoolbar_block('italic')));
    add_button('mytoolbar_sc', 'sc', doSel(simpleTag('sc')));
    add_button('mytoolbar_lp', 'lp', doSel(mytoolbar_lp));
    add_button('mytoolbar_cbs', 'cb/s', doSelOrAll(mytoolbar_cbs));
    add_button('mytoolbar_cbs_tb', 'cb/s↕', mytoolbar_cbs_tb);
    add_button('mytoolbar_cbs_b', 'cb/s↓', mytoolbar_cbs_b);
    add_button('mytoolbar_cbs_t', 'cb/s↑', mytoolbar_cbs_t);
    add_button('mytoolbar_dhr', 'dhr', doInsert(mytoolbar_dhr));
    add_button('mytoolbar_gaps', 'gaps', doSel(mytoolbar_gaps()));
    add_button('mytoolbar_gaps2', 'gaps2', doSel(mytoolbar_gaps(true)));
    add_button('mytoolbar_n', 'n', doSel(simpleTag('n')));
    add_button('mytoolbar_ofl', 'ofl', doSel(mytoolbar_overfloat_left));
    add_button('mytoolbar_paragraphs', '⇄', doSelOrAll(mytoolbar_paragraphs));

    var tid = setInterval(() => {
        var $label = $("label[for='wpTextbox1']");
        if ($label.length) {
            var $toolbar = $('.MyCustomToolbar');
            $toolbar.detach();
            $label.append($toolbar);
            clearInterval(tid);
        }
    }, 500);

    var tid2 = setInterval(() => {
        var $label = $("label[for='wpFooterTextbox']");
        if ($label.length) {
            var textbox = document.getElementById('wpFooterTextbox');
            var text = textbox.value;
            if (text.length && !text.startsWith('\n'))
                textbox.value = '\n' + text;
            clearInterval(tid2);
        }
    }, 500);
});
