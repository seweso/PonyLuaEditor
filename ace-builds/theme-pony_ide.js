define("ace/theme/pony_ide",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

exports.isDark = true;
exports.cssClass = "ace-pony-ide";
exports.cssText = ".ace-pony-ide .ace_gutter {\
background: #2c3036;\
color: #8F908A\
}\
.ace-pony-ide .ace_print-margin {\
width: 1px;\
background: #54565a\
}\
.ace-pony-ide {\
background-color: #24282c;\
color: #F8F8F2\
}\
.ace-pony-ide .ace_cursor {\
color: #F8F8F0\
}\
.ace-pony-ide .ace_marker-layer .ace_selection {\
background: #41494e\
}\
.ace-pony-ide.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px #24282c;\
}\
.ace-pony-ide .ace_marker-layer .ace_step {\
background: rgb(102, 82, 0)\
}\
.ace-pony-ide .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid #41494e\
}\
.ace-pony-ide .ace_marker-layer .ace_active-line {\
background: #202020\
}\
.ace-pony-ide .ace_gutter-active-line {\
background-color: #272727\
}\
.ace-pony-ide .ace_marker-layer .ace_selected-word {\
border: 1px solid #41494e\
}\
.ace-pony-ide .ace_invisible {\
color: #4f5256\
}\
.ace-pony-ide .ace_entity.ace_name.ace_tag,\
.ace-pony-ide .ace_keyword,\
.ace-pony-ide .ace_meta.ace_tag,\
.ace-pony-ide .ace_storage {\
color: #F92672\
}\
.ace-pony-ide .ace_punctuation,\
.ace-pony-ide .ace_punctuation.ace_tag {\
color: #fff\
}\
.ace-pony-ide .ace_constant.ace_character,\
.ace-pony-ide .ace_constant.ace_language,\
.ace-pony-ide .ace_constant.ace_numeric,\
.ace-pony-ide .ace_constant.ace_other {\
color: #AE81FF\
}\
.ace-pony-ide .ace_invalid {\
color: #F8F8F0;\
background-color: #F92672\
}\
.ace-pony-ide .ace_invalid.ace_deprecated {\
color: #F8F8F0;\
background-color: #AE81FF\
}\
.ace-pony-ide .ace_support.ace_constant,\
.ace-pony-ide .ace_support.ace_function {\
color: #66D9EF\
}\
.ace-pony-ide .ace_fold {\
background-color: #A6E22E;\
border-color: #F8F8F2\
}\
.ace-pony-ide .ace_storage.ace_type,\
.ace-pony-ide .ace_support.ace_class,\
.ace-pony-ide .ace_support.ace_type {\
font-style: italic;\
color: #66D9EF\
}\
.ace-pony-ide .ace_entity.ace_name.ace_function,\
.ace-pony-ide .ace_entity.ace_other,\
.ace-pony-ide .ace_entity.ace_other.ace_attribute-name,\
.ace-pony-ide .ace_variable {\
color: #A6E22E\
}\
.ace-pony-ide .ace_variable.ace_parameter {\
font-style: italic;\
color: #FD971F\
}\
.ace-pony-ide .ace_string {\
color: #E6DB74\
}\
.ace-pony-ide .ace_comment {\
color: #62747d\
}\
.ace-pony-ide .ace_indent-guide {\
background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWPQ0FD0ZXBzd/wPAAjVAoxeSgNeAAAAAElFTkSuQmCC) right repeat-y\
}";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});
                (function() {
                    window.require(["ace/theme/pony_ide"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            