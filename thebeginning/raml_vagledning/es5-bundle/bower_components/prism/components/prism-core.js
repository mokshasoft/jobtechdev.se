var _self="undefined"!==typeof window?window:"undefined"!==typeof WorkerGlobalScope&&babelHelpers.instanceof(self,WorkerGlobalScope)?self:{},Prism=function(){var lang=/\blang(?:uage)?-([\w-]+)\b/i,uniqueId=0,_=_self.Prism={manual:_self.Prism&&_self.Prism.manual,disableWorkerMessageHandler:_self.Prism&&_self.Prism.disableWorkerMessageHandler,util:{encode:function encode(tokens){if(babelHelpers.instanceof(tokens,Token)){return new Token(tokens.type,_.util.encode(tokens.content),tokens.alias)}else if("Array"===_.util.type(tokens)){return tokens.map(_.util.encode)}else{return tokens.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\u00a0/g," ")}},type:function type(o){return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1]},objId:function objId(obj){if(!obj.__id){Object.defineProperty(obj,"__id",{value:++uniqueId})}return obj.__id},clone:function(o,visited){var type=_.util.type(o);visited=visited||{};switch(type){case"Object":if(visited[_.util.objId(o)]){return visited[_.util.objId(o)]}var clone={};visited[_.util.objId(o)]=clone;for(var key in o){if(o.hasOwnProperty(key)){clone[key]=_.util.clone(o[key],visited)}}return clone;case"Array":if(visited[_.util.objId(o)]){return visited[_.util.objId(o)]}var clone=[];visited[_.util.objId(o)]=clone;o.forEach(function(v,i){clone[i]=_.util.clone(v,visited)});return clone;}return o}},languages:{extend:function extend(id,redef){var lang=_.util.clone(_.languages[id]);for(var key in redef){lang[key]=redef[key]}return lang},insertBefore:function insertBefore(inside,before,insert,root){root=root||_.languages;var grammar=root[inside];if(2==arguments.length){insert=arguments[1];for(var newToken in insert){if(insert.hasOwnProperty(newToken)){grammar[newToken]=insert[newToken]}}return grammar}var ret={};for(var token in grammar){if(grammar.hasOwnProperty(token)){if(token==before){for(var newToken in insert){if(insert.hasOwnProperty(newToken)){ret[newToken]=insert[newToken]}}}ret[token]=grammar[token]}}_.languages.DFS(_.languages,function(key,value){if(value===root[inside]&&key!=inside){this[key]=ret}});return root[inside]=ret},DFS:function DFS(o,callback,type,visited){visited=visited||{};for(var i in o){if(o.hasOwnProperty(i)){callback.call(o,i,o[i],type||i);if("Object"===_.util.type(o[i])&&!visited[_.util.objId(o[i])]){visited[_.util.objId(o[i])]=!0;_.languages.DFS(o[i],callback,null,visited)}else if("Array"===_.util.type(o[i])&&!visited[_.util.objId(o[i])]){visited[_.util.objId(o[i])]=!0;_.languages.DFS(o[i],callback,i,visited)}}}}},plugins:{},highlightAll:function highlightAll(async,callback){_.highlightAllUnder(document,async,callback)},highlightAllUnder:function highlightAllUnder(container,async,callback){var env={callback:callback,selector:"code[class*=\"language-\"], [class*=\"language-\"] code, code[class*=\"lang-\"], [class*=\"lang-\"] code"};_.hooks.run("before-highlightall",env);for(var elements=env.elements||container.querySelectorAll(env.selector),i=0,element;element=elements[i++];){_.highlightElement(element,!0===async,env.callback)}},highlightElement:function highlightElement(element,async,callback){var language,grammar,parent=element;while(parent&&!lang.test(parent.className)){parent=parent.parentNode}if(parent){language=(parent.className.match(lang)||[,""])[1].toLowerCase();grammar=_.languages[language]}element.className=element.className.replace(lang,"").replace(/\s+/g," ")+" language-"+language;if(element.parentNode){parent=element.parentNode;if(/pre/i.test(parent.nodeName)){parent.className=parent.className.replace(lang,"").replace(/\s+/g," ")+" language-"+language}}var code=element.textContent,env={element:element,language:language,grammar:grammar,code:code};_.hooks.run("before-sanity-check",env);if(!env.code||!env.grammar){if(env.code){_.hooks.run("before-highlight",env);env.element.textContent=env.code;_.hooks.run("after-highlight",env)}_.hooks.run("complete",env);return}_.hooks.run("before-highlight",env);if(async&&_self.Worker){var worker=new Worker(_.filename);worker.onmessage=function(evt){env.highlightedCode=evt.data;_.hooks.run("before-insert",env);env.element.innerHTML=env.highlightedCode;callback&&callback.call(env.element);_.hooks.run("after-highlight",env);_.hooks.run("complete",env)};worker.postMessage(JSON.stringify({language:env.language,code:env.code,immediateClose:!0}))}else{env.highlightedCode=_.highlight(env.code,env.grammar,env.language);_.hooks.run("before-insert",env);env.element.innerHTML=env.highlightedCode;callback&&callback.call(element);_.hooks.run("after-highlight",env);_.hooks.run("complete",env)}},highlight:function highlight(text,grammar,language){var env={code:text,grammar:grammar,language:language};_.hooks.run("before-tokenize",env);env.tokens=_.tokenize(env.code,env.grammar);_.hooks.run("after-tokenize",env);return Token.stringify(_.util.encode(env.tokens),env.language)},matchGrammar:function matchGrammar(text,strarr,grammar,index,startPos,oneshot,target){var Token=_.Token;for(var token in grammar){if(!grammar.hasOwnProperty(token)||!grammar[token]){continue}if(token==target){return}var patterns=grammar[token];patterns="Array"===_.util.type(patterns)?patterns:[patterns];for(var j=0;j<patterns.length;++j){var pattern=patterns[j],inside=pattern.inside,lookbehind=!!pattern.lookbehind,greedy=!!pattern.greedy,lookbehindLength=0,alias=pattern.alias;if(greedy&&!pattern.pattern.global){var flags=pattern.pattern.toString().match(/[imuy]*$/)[0];pattern.pattern=RegExp(pattern.pattern.source,flags+"g")}pattern=pattern.pattern||pattern;for(var i=index,pos=startPos,str;i<strarr.length;pos+=strarr[i].length,++i){str=strarr[i];if(strarr.length>text.length){return}if(babelHelpers.instanceof(str,Token)){continue}if(greedy&&i!=strarr.length-1){pattern.lastIndex=pos;var match=pattern.exec(text);if(!match){break}for(var from=match.index+(lookbehind?match[1].length:0),to=match.index+match[0].length,k=i,p=pos,len=strarr.length;k<len&&(p<to||!strarr[k].type&&!strarr[k-1].greedy);++k){p+=strarr[k].length;if(from>=p){++i;pos=p}}if(babelHelpers.instanceof(strarr[i],Token)){continue}delNum=k-i;str=text.slice(pos,p);match.index-=pos}else{pattern.lastIndex=0;var match=pattern.exec(str),delNum=1}if(!match){if(oneshot){break}continue}if(lookbehind){lookbehindLength=match[1]?match[1].length:0}var from=match.index+lookbehindLength,match=match[0].slice(lookbehindLength),to=from+match.length,before=str.slice(0,from),after=str.slice(to),args=[i,delNum];if(before){++i;pos+=before.length;args.push(before)}var wrapped=new Token(token,inside?_.tokenize(match,inside):match,alias,match,greedy);args.push(wrapped);if(after){args.push(after)}Array.prototype.splice.apply(strarr,args);if(1!=delNum)_.matchGrammar(text,strarr,grammar,i,pos,!0,token);if(oneshot)break}}}},tokenize:function tokenize(text,grammar){var strarr=[text],rest=grammar.rest;if(rest){for(var token in rest){grammar[token]=rest[token]}delete grammar.rest}_.matchGrammar(text,strarr,grammar,0,0,!1);return strarr},hooks:{all:{},add:function add(name,callback){var hooks=_.hooks.all;hooks[name]=hooks[name]||[];hooks[name].push(callback)},run:function run(name,env){var callbacks=_.hooks.all[name];if(!callbacks||!callbacks.length){return}for(var i=0,callback;callback=callbacks[i++];){callback(env)}}}},Token=_.Token=function(type,content,alias,matchedStr,greedy){this.type=type;this.content=content;this.alias=alias;this.length=0|(matchedStr||"").length;this.greedy=!!greedy};Token.stringify=function(o,language,parent){if("string"==typeof o){return o}if("Array"===_.util.type(o)){return o.map(function(element){return Token.stringify(element,language,o)}).join("")}var env={type:o.type,content:Token.stringify(o.content,language,parent),tag:"span",classes:["token",o.type],attributes:{},language:language,parent:parent};if(o.alias){var aliases="Array"===_.util.type(o.alias)?o.alias:[o.alias];Array.prototype.push.apply(env.classes,aliases)}_.hooks.run("wrap",env);var attributes=Object.keys(env.attributes).map(function(name){return name+"=\""+(env.attributes[name]||"").replace(/"/g,"&quot;")+"\""}).join(" ");return"<"+env.tag+" class=\""+env.classes.join(" ")+"\""+(attributes?" "+attributes:"")+">"+env.content+"</"+env.tag+">"};if(!_self.document){if(!_self.addEventListener){return _self.Prism}if(!_.disableWorkerMessageHandler){_self.addEventListener("message",function(evt){var message=JSON.parse(evt.data),lang=message.language,code=message.code,immediateClose=message.immediateClose;_self.postMessage(_.highlight(code,_.languages[lang],lang));if(immediateClose){_self.close()}},!1)}return _self.Prism}var script=document.currentScript||[].slice.call(document.getElementsByTagName("script")).pop();if(script){_.filename=script.src;if(!_.manual&&!script.hasAttribute("data-manual")){if("loading"!==document.readyState){if(window.requestAnimationFrame){window.requestAnimationFrame(_.highlightAll)}else{window.setTimeout(_.highlightAll,16)}}else{document.addEventListener("DOMContentLoaded",_.highlightAll)}}}return _self.Prism}();if("undefined"!==typeof module&&module.exports){module.exports=Prism}if("undefined"!==typeof global){global.Prism=Prism}