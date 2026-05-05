/******************************************************************************
 *                                                                            *
 * VERSION --- v1.0 JS+PC support                                             *
 * MODULE ---- Syntax highlighting for <pre> tags in HTML documents           *
 * USAGE ----- Include ZZ_Syntax.js as a deferred script. Use class="[code]"  *
 *             in <pre> tags to identify the language. Call the function      *
 *             highlightSyntax() once page is fully loaded. Supported         *
 *             class names are given below.                                   *
 *                                                                            *
 * FUNCTIONS - highlightSyntax: finds all <pre> tags in page with valid class *
 *                       names and highlights keywords from the language as   *
 *                       defined in the SyntaxWords object.                   *
 *                                                                            *
 * OBJECTS --- SyntaxWords: collection of languages, words, and structures to *
 *                       highlight.
 *                                                                            *
 * CLASSES --- JavaScript, PseudoCode                                         *
 *                                                                            *
 * AUTHOR ---- Terra Macdonald, FruitFolio.com                                     *
 *                                                                            *
 ******************************************************************************/

SyntaxWords = {
    "javascript" : {
        "flowWords"  : {
            "colour":"#0000ff",
            "words":[
                "if",
                "else",
                "for",
                "try",
                "catch",
                "finally",
                "switch",
                "case",
                "break",
                "continue",
                "default",
                "do",
                "while",
                "goto",
                "return",
                "throw",
                "await",
                "yield",
                "debugger",
                "synchronized"
            ]
        },
        "typeWords"  : {
            "colour" : "#008080",
            "words" : [
                "class",
                "int",
                "interface",
                "boolean",
                "double",
                "float",
                "protected",
                "private",
                "public",
                "volatile",
                "void",
                "short",
                "static",
                "const",
                "byte",
                "enum",
                "final",
                "function",
                "abstract",
                "char",
                "long",
                "transient"
            ]
        },
        "valWords"   : {
            "colour" : "#800080",
            "words" : [
                "true",
                "false",
                "null",
                "Infinity",
                "NaN",
                "undefined"
            ]
        },
        "refWords"   : {
            "colour" : "#ff0000",
            "words" : [
                "this",
                "globalThis",
                "typeof",
                "instanceof",
                "implements",
                "extends",
                "super",
                "with",
                "throws",
                "arguments"
            ]
        },
        "otherWords" : {
            "colour" : "#808000",
            "words" : [
                "in",
                "of",
                "var",
                "let",
                "new",
                "delete",
                "import",
                "export",
                "package",
                "eval",
                "cosole.log",
                "native"
            ]
        },
        "sysWords" : {
            "colour" : "#ffffff",
            "words" : [
                "Math",
                "String",
                "RegExp",
                "Number",
                "Date",
                "BigInt",
                "JSON",
                "document"
            ]
        },
        "commentSymbols" : {
            "colour"     : "#005a32",
            "line"       : "//",
            "blockStart" : "/*",
            "blockEnd"   : "*/",
            "blockReg"   : "\/\\*(.*)\\*\/"
        }
    },
    "pseudo" : {
        "flowWords"  : {
            "colour":"#0000ff",
            "words":[
                "if",
                "else",
                "try",
                "throw",
                "catch",
                "cases",
                "break",
                "default",
                "return",
                "loop",
                "perform",
                "iterate",
                "recurse"
            ]
        },
        "typeWords"  : {
            "colour" : "#008080",
            "words" : [
                "class",
                "int",
                "boolean",
                "float",
                "void",
                "short",
                "const",
                "var",
                "byte",
                "enum",
                "function",
                "char",
                "array"
            ]
        },
        "valWords"   : {
            "colour" : "#800080",
            "words" : [
                "true",
                "false",
                "infinity",
                "NaN",
                "null"
            ]
        },
        "refWords"   : {
            "colour" : "#ff0000",
            "words" : [
                "this",
                "which",
                "in",
                "at",
                "each"
            ]
        },
        "otherWords" : {
            "colour" : "#808000",
            "words" : [
                "inner",
                "outer",
                "nested",
                "deep",
                "on",
                "let",
                "set",
                "as",
                "new",
                "instance",
                "initialise",
                "delete"
            ]
        },
        "commentSymbols" : {
            "colour"     : "#005a32",
            "line"       : "//",
            "blockStart" : "/*",
            "blockEnd"   : "*/",
            "blockReg"   : "\/\\*(.*)\\*\/"
        }
    }
};

function highlightSyntax(){
    for (let preBlock of document.getElementsByTagName('pre')){
        let newDiv = document.createElement('div');
        newDiv.classList.add('code-group');
        preBlock.parentNode.insertBefore(newDiv,preBlock);
        newDiv.append(preBlock);
    }
    for (let code in SyntaxWords){
        let codeGroup = SyntaxWords[code];
        let codeTags = document.getElementsByClassName('language-'+code);
        for (let segment of codeTags){
            if (code=="javascript") {
                let reg = RegExp('#([0-9a-f]{6})',"g");
                segment.innerHTML = segment.innerHTML.replaceAll(reg,'<span style="color:#$1">#$1</span>');
            }
            for (let wordType in codeGroup){
                let thisCol = codeGroup[wordType].colour;
                if (wordType == "commentSymbols") {
                    let reg = RegExp(codeGroup.commentSymbols.line+'(.*)\n',"gm");
                    segment.innerHTML = segment.innerHTML.replaceAll(reg,'<span style="color:'+thisCol+'">'+codeGroup.commentSymbols.line+'$1</span>\n');
                    if ("blockReg" in codeGroup.commentSymbols) {
                        reg = RegExp(codeGroup.commentSymbols.blockReg,"gs");
                        segment.innerHTML = segment.innerHTML.replaceAll(reg,'<span style="color:'+thisCol+'">'+codeGroup.commentSymbols.blockStart+'$1'+codeGroup.commentSymbols.blockEnd+'</span>');
                    }
                    continue;
                }
                for (let thisWord of codeGroup[wordType].words){
                    let reg = RegExp('(^|\\W|\\s)'+thisWord+'(\\W|\\s)',"g");
                    segment.innerHTML = segment.innerHTML.replaceAll(reg,'$1<span style="color:'+thisCol+'">'+thisWord+'</span>$2');
                }
            }
            var lines = segment.innerHTML.split('\n');
            numLeng = Math.ceil(Math.log10(lines.length+1));
            let newHTML = '';
            for(let iter=0;iter<lines.length;iter++){
                newHTML += '<span style="font-weight:bold;color:#000000">'+String(iter+1).padStart(numLeng,'0')+' |</span> '+lines[iter]+'\n';
            }
            segment.innerHTML = newHTML;
        }
    }
}