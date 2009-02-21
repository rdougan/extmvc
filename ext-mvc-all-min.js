ExtMVC={version:"0.5b1"};Ext.ns("ExtMVC.Model","ExtMVC.plugin","ExtMVC.view","ExtMVC.view.scaffold");ExtMVC.Inflector={Inflections:{plural:[[(/(quiz)$/i),"$1zes"],[(/^(ox)$/i),"$1en"],[(/([m|l])ouse$/i),"$1ice"],[(/(matr|vert|ind)ix|ex$/i),"$1ices"],[(/(x|ch|ss|sh)$/i),"$1es"],[(/([^aeiouy]|qu)y$/i),"$1ies"],[(/(hive)$/i),"$1s"],[(/(?:([^f])fe|([lr])f)$/i),"$1$2ves"],[(/sis$/i),"ses"],[(/([ti])um$/i),"$1a"],[(/(buffal|tomat)o$/i),"$1oes"],[(/(bu)s$/i),"$1ses"],[(/(alias|status)$/i),"$1es"],[(/(octop|vir)us$/i),"$1i"],[(/(ax|test)is$/i),"$1es"],[(/s$/i),"s"],[(/$/),"s"]],singular:[[(/(quiz)zes$/i),"$1"],[(/(matr)ices$/i),"$1ix"],[(/(vert|ind)ices$/i),"$1ex"],[(/^(ox)en/i),"$1"],[(/(alias|status)es$/i),"$1"],[(/(octop|vir)i$/i),"$1us"],[(/(cris|ax|test)es$/i),"$1is"],[(/(shoe)s$/i),"$1"],[(/(o)es$/i),"$1"],[(/(bus)es$/i),"$1"],[(/([m|l])ice$/i),"$1ouse"],[(/(x|ch|ss|sh)es$/i),"$1"],[(/(m)ovies$/i),"$1ovie"],[(/(s)eries$/i),"$1eries"],[(/([^aeiouy]|qu)ies$/i),"$1y"],[(/([lr])ves$/i),"$1f"],[(/(tive)s$/i),"$1"],[(/(hive)s$/i),"$1"],[(/([^f])ves$/i),"$1fe"],[(/(^analy)ses$/i),"$1sis"],[(/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$/i),"$1$2sis"],[(/([ti])a$/i),"$1um"],[(/(n)ews$/i),"$1ews"],[(/s$/i),""]],irregular:[["move","moves"],["sex","sexes"],["child","children"],["man","men"],["person","people"]],uncountable:["sheep","fish","series","species","money","rice","information","equipment"]},ordinalize:function(A){if(11<=parseInt(A,10)%100&&parseInt(A,10)%100<=13){return A+"th"}else{switch(parseInt(A,10)%10){case 1:return A+"st";case 2:return A+"nd";case 3:return A+"rd";default:return A+"th"}}},pluralize:function(C){var E=ExtMVC.Inflector.uncountableOrIrregular(C);if(E){return E}for(var A=0;A<ExtMVC.Inflector.Inflections.plural.length;A++){var B=ExtMVC.Inflector.Inflections.plural[A][0];var D=ExtMVC.Inflector.Inflections.plural[A][1];if(B.test(C)){return C.replace(B,D)}}return C},singularize:function(C){var E=ExtMVC.Inflector.uncountableOrIrregular(C);if(E){return E}for(var A=0;A<ExtMVC.Inflector.Inflections.singular.length;A++){var B=ExtMVC.Inflector.Inflections.singular[A][0];var D=ExtMVC.Inflector.Inflections.singular[A][1];if(B.test(C)){return C.replace(B,D)}}return C},uncountableOrIrregular:function(E){for(var C=0;C<ExtMVC.Inflector.Inflections.uncountable.length;C++){var B=ExtMVC.Inflector.Inflections.uncountable[C];if(E.toLowerCase==B){return B}}for(var C=0;C<ExtMVC.Inflector.Inflections.irregular.length;C++){var D=ExtMVC.Inflector.Inflections.irregular[C][0];var A=ExtMVC.Inflector.Inflections.irregular[C][1];if((E.toLowerCase==D)||(E==A)){return A}}return false}};String.prototype.capitalize=function(){return this.charAt(0).toUpperCase()+this.substr(1).toLowerCase()};String.prototype.titleize=function(){return this.replace(/\w\S*/g,function(A){return A.charAt(0).toUpperCase()+A.substr(1).toLowerCase()})};String.prototype.camelize=function(){return this.replace(/_/g," ").titleize().replace(/ /g,"")};String.prototype.underscore=function(){return this.toLowerCase().replace(/ /g,"_")};String.prototype.singularize=function(){return ExtMVC.Inflector.singularize(this)};String.prototype.pluralize=function(){return ExtMVC.Inflector.pluralize(this)};String.prototype.escapeHTML=function(){return this.replace(/&/g,"&amp;").replace(/>/g,"&gt;").replace(/</g,"&lt;").replace(/"/g,"&quot;")};String.prototype.toCurrency=function(H){if(typeof(H)=="undefined"){var H="$"}var B=this.split(".")[0],F=this.split(".")[1];var A=Math.floor(B.length/3);var E=B.length%3,G=E;var C=E==0?[]:[B.substr(0,E)];for(var D=0;D<A;D++){C.push(B.substr(E+(D*3),3))}B=H+C.join(",");return F?String.format("{0}.{1}",B,F):B};ExtMVC.Router=function(){};ExtMVC.Router.prototype={mappings:[],namedRoutes:{},connect:function(B,C){var A=new ExtMVC.Route(B,C);this.mappings.push(A);return A},name:function(A,B,C){this.namedRoutes[A]=this.connect(B,C)},root:function(A){var A=A||{};this.connect("",Ext.applyIf(A,{action:"index"}))},resources:function(A,I){if(arguments[1]&&typeof(arguments[1])=="string"){var H=arguments[arguments.length-1];var B=(typeof(H)=="object")?H:{};for(var C=0;C<arguments.length;C++){if(!(H===arguments[C]&&typeof(H)=="object")){this.resources(arguments[C],B)}}return}var G=String.format("{0}_path",A.pluralize());var E=String.format("new_{0}_path",A.singularize());var F=String.format("{0}_path",A.singularize());var D=String.format("edit_{0}_path",A.singularize());this.name(G,A,Ext.apply({},{controller:A,action:"index"}));this.name(E,A+"/new",Ext.apply({},{controller:A,action:"new"}));this.name(F,A+"/:id",Ext.apply({},{controller:A,action:"show",conditions:{":id":"[0-9]+"}}));this.name(D,A+"/:id/edit",Ext.apply({},{controller:A,action:"edit",conditions:{":id":"[0-9]+"}}))},redirectTo:function(){var A=this.urlFor.apply(this,arguments);if(A){Ext.History.add(A);return true}else{return false}},linkTo:function(B,A){var A=A||{};var C=this.urlFor(B);if(C){return Ext.applyIf(A,{url:C,cls:[B.controller,B.action,B.id].join("-").replace("--","-").replace(/-$/,""),text:this.constructDefaultLinkToName(B,A),handler:function(){Ext.History.add(C)}})}else{throw new Error("No match for that url specification")}},constructDefaultLinkToName:function(B,A){if(!B||!B.controller||!B.action){return""}var A=A||{};Ext.applyIf(A,{singularName:B.controller.singularize()});var C=B.action.titleize();if(C=="Index"){return"Show "+B.controller.titleize()}else{return C+" "+A.singularName.titleize()}},recognise:function(C){for(var D=0;D<this.mappings.length;D++){var A=this.mappings[D];var B=A.matchesFor(C);if(B){return B}}return false},urlFor:function(D,B){var A;if(typeof(D)=="string"){if(A=this.namedRoutes[D]){var B=B||{};if(typeof(B)=="number"){B={id:B}}if(B.data&&B.data.id){B={id:B.data.id}}return A.urlForNamed(B)}}else{for(var E=0;E<this.mappings.length;E++){A=this.mappings[E];var C=A.urlFor(D);if(C){return C}}}return false},withOptions:function(B,A){var B=B||{};var D=this;var C={};C.prototype=this;Ext.apply(C,{connect:function(E,F){var F=F||{};Ext.applyIf(F,B);D.connect.call(D,E,F)},name:function(E,F,G){var G=G||{};Ext.applyIf(G,B);D.name.call(D,E,F,G)}});A.call(this,C)}};ExtMVC.Router.defineRoutes=function(A){A.connect(":controller/:action");A.connect(":controller/:action/:id")};ExtMVC.Route=function(C,A){this.mappingString=C;this.options=A||{};this.paramMatchingRegex=new RegExp(/:([0-9A-Za-z\_]*)/g);this.paramsInMatchString=this.mappingString.match(this.paramMatchingRegex)||[];this.paramsInStringWithOptions=[];this.conditions=this.options.conditions||{};if(this.options.conditions){delete this.options.conditions}for(var B=0;B<this.paramsInMatchString.length;B++){this.paramsInStringWithOptions.push(this.paramsInMatchString[B])}for(o in A){this.paramsInStringWithOptions.push(":"+o)}this.matcherRegex=this.convertToUsableRegex(C)};ExtMVC.Route.prototype={recognises:function(A){return this.matcherRegex.test(A)},matchesFor:function(B){if(!this.recognises(B)){return false}var E={};var D=this.paramsInMatchString;var A=B.match(this.matcherRegex);A.shift();for(var C=D.length-1;C>=0;C--){E[D[C].replace(":","")]=A[C]}for(option in this.options){E[option]=this.options[option]}return E},urlForNamed:function(A){var A=A||{};return this.urlFor(Ext.applyIf(A,this.options))},urlFor:function(C){var B=this.mappingString;for(o in C){if(C[o]&&this.options[o]&&C[o]!=this.options[o]){return false}}var E=[];for(o in C){E.push(":"+o)}E=E.sort();var A=this.paramsInStringWithOptions.sort();if(A.length!=E.length){return false}for(var D=0;D<E.length;D++){if(E[D]!=A[D]){return false}}for(o in C){B=B.replace(":"+o,C[o])}return B},convertToUsableRegex:function(A){var E=this.paramsInMatchString;for(var B=E.length-1;B>=0;B--){var C=this.conditions[E[B]];var D=String.format("({0})",C||"[a-zA-Z0-9_,]+");A=A.replace(new RegExp(E[B]),D)}return new RegExp("^"+A+"$")}};ExtMVC.Controller=function(B){var B=B||{};Ext.applyIf(B,{autoRegisterViews:true});ExtMVC.Controller.superclass.constructor.call(this,B);try{this.os=ExtMVC.OS.getOS()}catch(C){}this.views={};this.runningViews={};this.actions={};this.addEvents("init","beforedefaultaction");if(B.autoRegisterViews&&B.viewsPackage){for(var A in B.viewsPackage){this.registerView(A.toLowerCase(),B.viewsPackage[A])}}this.fireEvent("init",this)};Ext.extend(ExtMVC.Controller,Ext.util.Observable,{registerView:function(B,A){this.views[B]=A},registerViews:function(B){for(var A in B){this.registerView(A,B[A])}},getViewClass:function(A){return this.views[A]},renderMethod:"renderNow",addTo:null,model:null,scaffoldViewName:function(A){return ExtMVC.view.scaffold[A.titleize()]},renderView:function(F,D,C){var C=C||{};var D=D||{};Ext.applyIf(C,{renderTo:Ext.getBody(),renderNow:true,renderOnce:true});var B;if(typeof((this.getViewClass(F)))=="function"){B=new (this.getViewClass(F))(D)}else{if(this.model){try{B=new (this.scaffoldViewName(F))(this.model)}catch(E){}}}if(!B||typeof(B)=="undefined"){return}var A=this.getRunningView(B.id);if(A){if(C.renderOnce){B.destroy();return A}else{throw new Error("The view ID "+B.id+" has already been taken.  Each view instance must have a unique ID")}}else{return this.launchView(B)}},launchView:function(B,A){var A=A||{};Ext.applyIf(A,{renderNow:true});B.on("close",function(){this.destroyView(B.id)},this);B.on("destroy",function(C){delete this.runningViews[C.id]},this);this.runningViews[B.id]=B;if(this.renderMethod=="render"&&A.renderNow){B.render(A.renderTo,A.renderPosition);return B}else{if(this.addTo&&A.renderNow){this.addTo.add(B).show();this.addTo.doLayout();return B}}},getRunningView:function(A){return this.runningViews[A]},getRunningViews:function(B){if(!B.test){return[]}var C=[];for(var A in this.runningViews){if(B.test(A)){C.push(this.runningViews[A])}}return C},destroyView:function(A){var B=this.getRunningView(A);if(B){B.destroy();delete this.runningViews[A]}},destroyViews:function(B){if(!B.test){return[]}for(var A in this.runningViews){if(B.test(A)){this.destroyView(A)}}},registerAction:function(B,A,C){var C=C||{};Ext.applyIf(C,{before_filter:true,after_filter:true,overwrite:true});if(C.before_filter){this.addEvents("before_"+B)}if(C.after_filter){this.addEvents("after_"+B)}if(!this.getAction(B)||C.overwrite==true){this.actions[B]=A}},getAction:function(A){return this.actions[A]},fireAction:function(B,E,D){var E=E||this;var D=D||[];var A=this.getAction(B);if(A){if(this.fireEvent("before_"+B)){A.apply(E,D);this.fireEvent("after_"+B)}}else{if(this.fireEvent("beforedefaultaction",B,E,D)){var C;if(C=this.renderView(B,D[0])){C.show()}}}},handleEvent:function(D,B,A,C){var C=C||this;D.on(B,function(){this.fireAction(A,C,arguments)},this)}});Ext.reg("controller",ExtMVC.Controller);Ext.ns("ExtMVC.plugin.CrudController");(function(){var A=ExtMVC.plugin.CrudController;A.registerActions=function(B,C){Ext.apply(this,C,A.defaultFunctions);this.addEvents("findsuccess","findfailure");this.model=B;if(!this.model){throw new Error("You must provide a model to this.actsAsCrudController().  Pass it as the first argument to actsAsCrudController or set 'this.model = YourModel' before calling actsAsCrudController.")}this.registerAction("new",function(){this.form=this.renderView("new")},{overwrite:false});this.registerAction("edit",function(){this.form=this.renderView("edit");this.form.el.mask("Loading...","x-mask-loading");this.loadForm(this.form)},{overwrite:false});this.registerAction("create",function(D){D.el.mask("Saving...","x-mask-loading");this.onCreate(D)},{overwrite:false});this.registerAction("update",function(D){D.el.mask("Saving...","x-mask-loading");this.onUpdate(D)},{overwrite:false});this.registerAction("destroy",function(F,D){var F=F||this.os.params.id;if(F){var E=new this.model({id:F});E.destroy({scope:this,success:this.onDestroySuccess.createDelegate(this,[D]),failure:this.onDestroyFailure})}},{overwrite:false})};A.defaultFunctions={modelObj:null,loadUrl:null,saveUrl:null,loadForm:function(B){this.model.findById(this.os.params.id,{scope:this,url:this.loadUrl,success:this.onFindSuccess,failure:this.onFindFailure,callback:B.el.unmask.createDelegate(B.el)})},onFindSuccess:function(B){this.editModelObj=B;this.form.getForm().loadRecord(B);this.fireEvent("findsuccess",B)},onFindFailure:function(){this.fireEvent("findfailure");Ext.Msg.show({title:"Load Failed",msg:"The item could not be loaded",buttons:{yes:"Try again",no:"Back"},scope:this,fn:function(B){B=="yes"?this.loadForm():Ext.History.back()}})},onCreate:function(B){this.newModelObj=new this.model({});this.onSave(B,this.newModelObj,{success:this.onCreateSuccess,failure:this.onCreateFailure})},onUpdate:function(B){this.onSave(B,this.editModelObj,{success:this.onUpdateSuccess,failure:this.onUpdateFailure})},onSave:function(D,C,B){D.el.mask("Saving...","x-mask-loading");C.update(D.getValues(),Ext.apply({},B,{scope:this,url:this.saveUrl,callback:function(){D.el.unmask()}}))},onSaveSuccess:function(B){this.os.router.redirectTo(Ext.apply({},{action:"index"},this.os.params))},onCreateSuccess:function(){this.onSaveSuccess()},onUpdateSuccess:function(){this.onSaveSuccess()},onCreateFailure:function(C,B){this.addErrorMessages(C,B)},onUpdateFailure:function(C,B){this.addErrorMessages(C,B)},addErrorMessages:function(C,B){this.form.getForm().clearInvalid();this.form.getForm().markInvalid(C.errors.forForm())},onDestroySuccess:function(B){if(B){B.reload()}},onDestroyFailure:function(B){Ext.Msg.alert("Delete Failed","Sorry, something went wrong when trying to delete that item.  Please try again")}};ExtMVC.Controller.prototype.actsAsCrudController=A.registerActions})();ExtMVC.OS=function(A){ExtMVC.OS.superclass.constructor.call(this,A);this.addEvents("beforelaunch","launch");this.initialiseNamespaces();var B=this;ExtMVC.OS.getOS=function(){return B}};Ext.extend(ExtMVC.OS,ExtMVC.Controller,{registerController:function(A,B){this.controllers[A]=B},getController:function(A){var B=this.controllers[A];if(B){if(typeof B==="function"){this.controllers[A]=new this.controllers[A]()}return this.controllers[A]}else{return null}},controllers:{},launch:function(){if(this.fireEvent("beforelaunch",this)){this.initializeRouter();this.initializeViewport();if(this.usesHistory){this.initialiseHistory()}this.onLaunch();this.fireEvent("launch",this)}},usesHistory:false,dispatchHistoryOnLoad:true,viewportBuilder:"leftmenu",viewportBuilderConfig:{},initializeViewport:function(){var A=ExtMVC.ViewportBuilderManager.find(this.viewportBuilder);if(A){A.build(this)}},params:{},dispatch:function(B,C,A){var B=B||{};Ext.applyIf(B,{action:"index"});this.params=B;var D;if(D=this.getController(B.controller)){D.fireAction(B.action,C||D,A||[])}},onLaunch:Ext.emptyFn,initializeRouter:function(){if(this.router){return}this.router=new ExtMVC.Router();ExtMVC.Router.defineRoutes(this.router)},name:undefined,initialiseNamespaces:function(A){var A=A||this.name;if(A){Ext.ns(A,A+".controllers",A+".models",A+".views")}},initialiseHistory:function(){this.historyForm=Ext.getBody().createChild({tag:"form",action:"#",cls:"x-hidden",id:"history-form",children:[{tag:"div",children:[{tag:"input",id:"x-history-field",type:"hidden"},{tag:"iframe",id:"x-history-frame"}]}]});if(this.dispatchHistoryOnLoad){Ext.History.init(function(B){var A=document.location.hash.replace("#","");var C=this.router.recognise(A);if(C){this.dispatch(C)}},this)}else{Ext.History.init()}Ext.History.on("change",this.handleHistoryChange,this)},handleHistoryChange:function(B){var A=this.router.recognise(B);if(A){this.dispatch(A,null,[{url:B}])}},setsTitle:function(A,B){var B=B||A.title||A.initialConfig?A.initialConfig.title:null;if(B){A.on("show",function(){document.title=B});A.on("activate",function(){document.title=B})}}});Ext.reg("os",ExtMVC.OS);ExtMVC.Model=function(I,B){Ext.applyIf(this,{newRecord:I.id?false:true});var G=ExtMVC.Model.recordFor(this.modelName,I);var D=new G(I||{});D.init(this);Ext.applyIf(this,this.constructor.instanceMethods);var A=this.constructor.hasMany;if(A){if(typeof A=="string"){A=[A]}for(var F=0;F<A.length;F++){var H=A[F];if(typeof H=="string"){H={name:H}}H=new ExtMVC.Model.HasManyAssociation(this,H);this[H.associationName]=H}}var K=this.constructor.belongsTo;if(K){if(typeof K=="string"){K=[K]}for(var F=0;F<K.length;F++){var J=K[F];if(typeof J=="string"){J={name:J}}var E=new ExtMVC.Model.BelongsToAssociation(this,J);this[E.associationName]=E;var C=this.constructor.parentModel||J.name;if(C&&!this.parent){this.parent=E}}}Ext.apply(this,D)};ExtMVC.Model.define=function(modelNameWithNamespace,config){var config=config||{};var nsRegex=/(.+)\.([A-Za-z]*)$/;var match=nsRegex.exec(modelNameWithNamespace);var namespace=null;if(match){var namespace=match[1];var modelName=match[2];Ext.ns(namespace)}Ext.applyIf(config,{namespace:namespace,modelName:modelName,className:modelName,adapter:"REST"});eval(modelNameWithNamespace+" = Ext.extend(ExtMVC.Model, config)");var className=eval(modelNameWithNamespace);if(className.prototype.extend){var extendsModel=eval(className.prototype.extend);var parentFields=extendsModel.fields;for(var i=parentFields.length-1;i>=0;i--){var childFields=className.prototype.fields;var alreadyDefined=false;for(var j=0;j<childFields.length;j++){if(childFields[j].name==parentFields[i].name){alreadyDefined=true;break}}if(!alreadyDefined){className.prototype.fields.unshift(parentFields[i])}}Ext.applyIf(className,extendsModel.prototype)}className.prototype.fields=new Ext.util.MixedCollection();Ext.each(config.fields,function(f){className.prototype.fields.add(new Ext.data.Field(f))});Ext.apply(className,{adapter:config.adapter,modelName:modelName,className:className,namespace:namespace,record:ExtMVC.Model.recordFor(modelName,config.fields)});ExtMVC.Model.addClassMethodsToModel(className,config)};ExtMVC.Model.RecordExtensions={init:function(B){Ext.applyIf(B,{className:ExtMVC.Model.classifyName(B.modelName),controllerName:ExtMVC.Model.controllerName(B.modelName),foreignKeyName:ExtMVC.Model.foreignKeyName(B.modelName),humanPluralName:ExtMVC.Model.pluralizeHumanName(B.modelName),humanSingularName:ExtMVC.Model.singularizeHumanName(B.modelName),underscoreName:B.modelName});var A=ExtMVC.Model.AdapterManager.find(B.adapter||ExtMVC.Model.prototype.adapter);if(A){Ext.apply(B,A.instanceMethods);A.initialize(this)}Ext.apply(B,ExtMVC.Model.ValidationExtensions);B.initializeValidationExtensions();Ext.apply(this,B)},url:function(){var A=this.data.id?this:this.constructor;if(this.parent&&this.parent.lastFetched){return ExtMVC.UrlBuilder.urlFor(this.parent.get({},-1),A)}else{return ExtMVC.UrlBuilder.urlFor(A)}},setValues:function(A){this.beginEdit();for(var B in A){this.set(B,A[B])}this.endEdit()},readErrors:function(A){this.errors.readServerErrors(A)}};ExtMVC.Model.ValidationExtensions={initializeValidationExtensions:function(){this.validations=this.validations||[];this.errors=new ExtMVC.Model.Validation.Errors(this)},isValid:function(){return this.errors.isValid()}};ExtMVC.Model.models=[];Ext.apply(ExtMVC.Model,{recordFor:function(C,A){var B=ExtMVC.Model.models[C];if(!B){B=Ext.data.Record.create(A);Ext.apply(B.prototype,ExtMVC.Model.RecordExtensions);ExtMVC.Model.models[C]=B}return B},urlizeName:function(A){return A.toLowerCase().pluralize()},classifyName:function(A){return this.singularizeHumanName(A).replace(/ /g,"")},singularizeHumanName:function(A){return A.replace(/_/g," ").titleize()},pluralizeHumanName:function(A){return A.pluralize().replace(/_/g," ").titleize()},controllerName:function(A){return this.pluralizeHumanName(A).replace(/ /g,"")+"Controller"},foreignKeyName:function(A){return A.toLowerCase()+"_id"},addClassMethodsToModel:function(B,C){var C=C||{};Ext.applyIf(C,{urlName:ExtMVC.Model.urlizeName(B.prototype.modelName)});var A=ExtMVC.Model.AdapterManager.find(B.adapter||ExtMVC.Model.prototype.adapter);if(A&&A.classMethods){Ext.apply(B,A.classMethods)}Ext.apply(B,{getReader:function(){if(!B.reader){B.reader=new Ext.data.JsonReader({totalProperty:"totalCount",root:B.jsonName||B.prototype.modelName.toLowerCase()},B)}return B.reader}},C)}});Ext.ns("ExtMVC.Model.Adapter","ExtMVC.Model.Validation");ExtMVC.Model.AdapterManager={adapters:{},register:function(A,B){this.adapters[A]=B},find:function(B,A){return this.adapters[B]}};ExtMVC.Model.Cache=function(A){var A=A||{};ExtMVC.Model.Cache.superclass.constructor.call(this,A);this.addEvents("beforeadd","add","beforeclear","clear")};Ext.extend(ExtMVC.Model.Cache,Ext.util.Observable,{caches:{},add:function(B){if(this.fireEvent("beforeadd",B)){var A=B.className;var C=B.data.id;if(A&&C){B.cachedAt=new Date();this.caches[A]=this.caches[A]||{};this.caches[A][C]=B;this.fireEvent("add",B);return true}else{return false}}},fetch:function(C){this.caches[C.modelName]=this.caches[C.modelName]||{};var C=C||{};var B=this.caches[C.modelName][C.id];if(B){if(C.staleTime){if(typeof C.staleTime=="number"){var A=new Date();A.setTime(A.getTime()-(1000*C.staleTime));C.staleTime=A}if(C.staleTime.getTime&&B.cachedAt>C.staleTime){return B}}else{return B}}},clear:function(D){var D=D||0;var B=new Date();B.setTime(B.getTime()-(1000*D));if(this.fireEvent("beforeclear",D)){if(D==0){this.caches={}}else{for(var C=0;C<this.caches.length;C++){for(var A=0;A<this.caches[C].length;A++){if(this.caches[C][A].cachedAt<B){delete this.caches[C][A]}}}}this.fireEvent("clear",D)}}});ExtMVC.UrlBuilder=function(){};ExtMVC.UrlBuilder.prototype={baseUrlNamespace:"",baseUrlFormat:"",segmentJoiner:"/",urlFor:function(){var C={};var H=Array.prototype.slice.call(B,B.length-1)[0];if(typeof H=="object"&&!H.className){Ext.apply(C,H,{format:this.baseUrlFormat,urlNamespace:this.baseUrlNamespace});var B=Array.prototype.slice.call(B,0,B.length-1)}Ext.applyIf(C,{format:this.baseUrlFormat,urlNamespace:this.baseUrlNamespace});var F=[C.urlNamespace];for(var E=0;E<B.length;E++){var I=B[E];var G=[];switch(typeof I){case"string":G=[I];break;case"object":G=this.segmentsForInstance(I);break;case"function":G=this.segmentsForClass(I);break}for(var D=0;D<G.length;D++){F.push(G[D])}}var A=F.join(this.segmentJoiner);if(C.format){A+="."+C.format}return A},segmentsForInstance:function(A){return[A.constructor.urlName,A.data.id]},segmentsForClass:function(B,C){var A=[B.urlName];if(C){A.push(C)}return A}};ExtMVC.UrlBuilder=new ExtMVC.UrlBuilder();ExtMVC.Model.Association={hasManyAssociationName:function(A){return A.toLowerCase()+"s"},belongsToAssociationName:function(A){return A.toLowerCase()}};ExtMVC.Model.HasManyAssociation=function(ownerObject,config){var config=config||{};Ext.applyIf(config,{offset:0,limit:25,associationName:ExtMVC.Model.Association.hasManyAssociationName(config.name)});Ext.applyIf(config,{primaryKey:"id",foreignKey:ownerObject.foreignKeyName,extend:{},className:(ownerObject.constructor.namespace?ownerObject.constructor.namespace+"."+config.name:config.name)});var associatedObjectClass=eval(config.className);function callOwnerObjectClassMethod(method,args,scope){return ownerObject.constructor[method].apply(scope||ownerObject.constructor,args||[])}function callAssociatedObjectClassMethod(method,args,scope){return associatedObjectClass[method].apply(scope||associatedObjectClass,args||[])}return Ext.applyIf(config.extend,{associationName:config.associationName,associationType:"hasMany",url:function(){var args=[ownerObject,associatedObjectClass];for(var i=0;i<arguments.length;i++){args.push(arguments[i])}return ExtMVC.UrlBuilder.urlFor.apply(ExtMVC.UrlBuilder,args)},findById:function(id,options){var options=options||{};if(!options.conditions){options.conditions=[]}options.conditions.push({key:config.foreignKey,value:ownerObject.data[config.primaryKey]});return callAssociatedObjectClassMethod("findById",[id,options])},findAll:function(storeOptions){var storeOptions=storeOptions||{};Ext.applyIf(storeOptions,{url:this.url(),listeners:{load:{scope:this,fn:function(store,records,options){Ext.each(records,function(record){record.newRecord=false;if(record.parent&&record.parent.set){record.parent.set(ownerObject)}},this)}}}});return callAssociatedObjectClassMethod("findAll",[storeOptions])},create:function(fields,saveConfig){return this.build(fields).save(saveConfig)},build:function(fields){var fields=fields||{};var obj=new associatedObjectClass(fields);var assocName=ExtMVC.Model.Association.belongsToAssociationName(ownerObject.className);obj[assocName].set(ownerObject);return obj},add:function(modelObject){},destroy:function(id){}})};ExtMVC.Model.BelongsToAssociation=function(ownerObject,config){var config=config||{};Ext.applyIf(config,{associationName:ExtMVC.Model.Association.belongsToAssociationName(config.name)});Ext.applyIf(config,{primaryKey:"id",foreignKey:ownerObject.foreignKeyName,extend:{},className:(ownerObject.constructor.namespace?ownerObject.constructor.namespace+"."+config.name:config.name)});var associatedObjectClass=eval(config.className);function callOwnerObjectClassMethod(method,args,scope){return ownerObject.constructor[method].apply(scope||ownerObject.constructor,args||[])}function callAssociatedObjectClassMethod(method,args,scope){return associatedObjectClass[method].apply(scope||associatedObjectClass,args||[])}return{associationName:config.associationName,associationClass:associatedObjectClass,associationType:"belongsTo",lastFetched:null,set:function(modelObject){this.lastFetched=new Date();this.cachedObject=modelObject;ownerObject.data[modelObject.foreignKeyName]=modelObject.data[config.primaryKey]},get:function(options,cacheFor){var options=options||{};var cacheFor=cacheFor||0;Ext.applyIf(options,{loadSuccess:Ext.emptyFn,loadFailure:Ext.emptyFn});var cacheIsCurrent=(((new Date()-this.lastFetched)/1000)<cacheFor)||(cacheFor==-1);if(this.lastFetched&&this.cachedObject&&cacheIsCurrent){options.loadSuccess.call(options.scope||this,this.cachedObject);return this.cachedObject}else{Ext.apply(options,{loadSuccess:options.loadSuccess.createInterceptor(function(obj){this.cachedObject=obj;this.lastFetched=new Date()},this)});return callAssociatedObjectClassMethod("findById",[1,options])}}}};ExtMVC.Model.Adapter.Abstract={initialize:function(A){},classMethods:{find:function(A){},findById:function(B,A){return this.findByField("id",B,A)},findByField:function(C,B,A){},findAll:function(A){}},instanceMethods:{save:Ext.emptyFn,reload:Ext.emptyFn,destroy:Ext.emptyFn}};ExtMVC.Model.AbstractAdapter={initAdapter:function(){Ext.applyIf(this,{urlNamespace:"/admin",urlExtension:".ext_json",urlName:ExtMVC.Model.urlizeName(this.modelName)})},save:function(A){var A=A||true;console.log("saving model")},destroy:function(A){var A=A||{};console.log("destroying model")},load:function(B,A){var A=A||true;console.log("loading model")},singleDataUrl:function(A){return this.namespacedUrl(String.format("{0}/{1}",this.urlName,this.data.id))},collectionDataUrl:function(){return this.namespacedUrl(this.urlName)},treeUrl:function(){return this.namespacedUrl(String.format("{0}/tree",this.urlName))},treeReorderUrl:function(){return this.namespacedUrl(String.format("{0}/reorder/{1}",this.urlName,this.data.id))},namespacedUrl:function(A){return(String.format("{0}/{1}{2}",this.urlNamespace,A,this.urlExtension))}};Ext.ns("ExtMVC.Model.Adapter");(function(){var B=ExtMVC.Model.Adapter;B.REST={initialize:function(A){B.Abstract.initialize(A)},classMethods:{find:function(C,A){var D;if(D=parseInt(C,10)){return this.findById(D,A)}switch(C){case"first":return this.findById(1,A);default:return this.findAll(A)}},findById:function(C,A){var A=A||{};if(A.url==null){A.url=this.singleDataUrl(C)}return this.performFindRequest(A)},findByField:function(D,C,A){var D=D||"id";var A=A||{};A.conditions=A.conditions||[];A.conditions.push({key:D,value:C,comparator:"="});return this.performFindRequest(A)},findAll:function(D){var D=D||{};var C=D.url?this.namespacedUrl(D.url):this.collectionDataUrl();var A={};Ext.apply(A,this.proxyConfig,{url:C,method:"GET"});return new Ext.data.Store(Ext.applyIf(D,{autoLoad:true,remoteSort:false,proxy:new this.proxyType(A),reader:this.getReader()}))},performFindRequest:function(A){var A=A||{};Ext.applyIf(A,{scope:this,url:this.collectionDataUrl(),method:"GET",success:Ext.emptyFn,failure:Ext.emptyFn});var F={successFn:A.success,failureFn:A.failure};var E=this;A.success=function(H,I){E.parseSingleLoadResponse(H,I,F)};var G=A.params||"";if(A.conditions&&A.conditions[0]){for(var C=0;C<A.conditions.length;C++){var D=A.conditions[C];G+=String.format("{0}{1}{2}",D.key,(D.comparator||"="),D.value)}delete A.conditions}A.params=G;return Ext.Ajax.request(A)},urlExtension:"",urlNamespace:"",port:80,host:"",proxyType:Ext.data.HttpProxy,proxyConfig:{},parseSingleLoadResponse:function(C,D,E){var A=this.getReader().read(C);if(A&&A.records[0]){A.records[0].newRecord=false;E.successFn.call(D.scope,A.records[0])}else{E.failureFn.call(D.scope,C)}},singleDataUrl:function(A){return this.namespacedUrl(String.format("{0}/{1}",this.urlName,A))},collectionDataUrl:function(){return this.namespacedUrl(this.urlName)},treeUrl:function(){return this.namespacedUrl(String.format("{0}/tree",this.urlName))},treeReorderUrl:function(){return this.namespacedUrl(String.format("{0}/reorder/{1}",this.urlName,this.data.id))},namespacedUrl:function(A){A=A.replace(/^\//,"");return(String.format("{0}{1}/{2}{3}",this.hostName(),this.urlNamespace,A,this.urlExtension))},hostName:function(){var A=this.port==80?"":this.port.toString();if(this.host==""){return""}else{return this.port==80?this.host:String.format("{0}:{1}",this.host,this.port)}}},instanceMethods:{save:function(D){var D=D||{};if(D.performValidations===true){}var A=this;var G=D.params||this.namespaceFields();if(!this.newRecord){G._method="put"}delete D.params;var F=D.success||Ext.emptyFn;var E=D.failure||Ext.emptyFn;delete D.success;delete D.failure;D.success=function(H){A.newRecord=false;F.call(D.scope||A,A,H)};D.failure=function(H){A.readErrors(H.responseText);E.call(D.scope||A,A,H)};var C=this.url();Ext.applyIf(D,{url:C,method:"POST",params:G});Ext.Ajax.request(D)},update:function(C,A){C=C||{};A=A||{};this.setValues(C);this.save(A)},reload:function(){console.log("reloading")},destroy:function(A){var A=A||{};Ext.Ajax.request(Ext.applyIf(A,{url:this.url(),method:"post",params:"_method=delete"}))},namespaceFields:function(){var A=this.fields;var D=this.modelName;var F={};for(var C=0;C<A.length;C++){var E=A.items[C];if(E.virtual){continue}F[String.format("{0}[{1}]",D.toLowerCase(),E.mapping||E.name)]=this.data[E.name]}return F}}}})();ExtMVC.Model.AdapterManager.register("REST",ExtMVC.Model.Adapter.REST);ExtMVC.Model.Validation.Errors=function(A){this.modelObject=A};ExtMVC.Model.Validation.Errors.prototype={errors:[],forForm:function(){var A={};Ext.each(this.modelObject.fields.items,function(C){var B=this.forField(C.name);if(B.length>0){A[C.name]=this.joinErrors(B)}},this);return A},multipleErrorConnector:"and",joinErrors:function(C){var C=C||[];var B="";if(C.length<=1){B=C[0]}else{var A=C.slice(0,C.length-1);B=String.format("{0} {1} {2}",A.join(", "),this.multipleErrorConnector,C[C.length-1])}return(/\.$/.test(B)?B:B+".").capitalize()},forField:function(D){var A=[];for(var C=0;C<this.errors.length;C++){var B=this.errors[C];if(B[0]==D){A.push(B[1])}}return A},isValid:function(A){return this.errors.length==0},clearErrors:function(){this.errors=[]},readServerErrors:function(A,C){var A=A||{};if(C!==true){this.clearErrors()}if(typeof(A)=="string"){A=Ext.decode(A)}var D=A.errors;if(D){for(var B=0;B<D.length;B++){this.errors.push(D[B])}}}};ExtMVC.ViewportBuilderManager={viewportBuilders:{},register:function(A,B){this.viewportBuilders[A]=B},find:function(B,A){var C=this.viewportBuilders[B];if(C){return new C(A)}}};ExtMVC.ViewportBuilder=function(A){this.initialConfig=A};ExtMVC.ViewportBuilder.prototype={build:Ext.emptyFn};ExtMVC.view.scaffold.ScaffoldFormPanel=Ext.extend(Ext.form.FormPanel,{constructor:function(B,A){var A=A||{};this.model=B;this.os=ExtMVC.OS.getOS();this.controllerName=this.model.modelName.pluralize();this.controller=this.os.getController(this.controllerName);ExtMVC.view.scaffold.ScaffoldFormPanel.superclass.constructor.call(this,A)},initComponent:function(){Ext.applyIf(this,{autoScroll:true,items:this.buildItems(this.model),keys:[{key:Ext.EventObject.ESC,scope:this,handler:this.onCancel},{key:"s",ctrl:true,scope:this,stopEvent:true,handler:this.saveHandler}],buttons:[{text:"Save",scope:this,iconCls:"save",handler:this.saveHandler},{text:"Cancel",scope:this,iconCls:"cancel",handler:this.onCancel}]});this.os.setsTitle(this);ExtMVC.view.scaffold.ScaffoldFormPanel.superclass.initComponent.apply(this,arguments)},formItemConfig:{anchor:"-40",xtype:"textfield"},ignoreFields:["id","created_at","updated_at"],buildItems:function(model){var formFields;if(formFields=eval(String.format("{0}.views.{1}.FormFields",model.namespace.split(".")[0],model.modelName.pluralize()))){return formFields}var items=[];for(var i=0;i<model.fields.length;i++){var f=model.fields[i];if(this.ignoreFields.indexOf(f.name)==-1){items.push(Ext.applyIf({name:f.name,fieldLabel:(f.name.replace(/_/g," ")).capitalize()},this.formItemConfig))}}return items},onCreate:function(){this.controller.fireAction("create",null,[this.getForm()])},onUpdate:function(){this.controller.fireAction("update",null,[this.getForm()])},onCancel:Ext.History.back});Ext.reg("scaffold_form_panel",ExtMVC.view.scaffold.ScaffoldFormPanel);ExtMVC.view.scaffold.Index=function(B,A){var A=A||{};this.model=B;this.os=ExtMVC.OS.getOS();this.controllerName=B.modelName.pluralize();this.controller=this.os.getController(this.controllerName);A.columns=A.columns||this.buildColumns(B);A.store=A.store||B.findAll();var C=this.hasTopToolbar?this.buildTopToolbar():null;var D=this.hasBottomToolbar?this.buildBottomToolbar(A.store):null;Ext.applyIf(A,{title:"Showing "+B.prototype.modelName.pluralize().capitalize(),viewConfig:{forceFit:true},id:B.prototype.modelName+"s_index",loadMask:true,tbar:C,bbar:D,listeners:{dblclick:{scope:this,fn:function(F){var E=this.getSelectionModel().getSelected();if(E){this.os.router.redirectTo({controller:this.controllerName,action:"edit",id:E.data.id})}}}},keys:[{key:"a",scope:this,handler:this.onAdd},{key:"e",scope:this,handler:this.onEdit},{key:Ext.EventObject.DELETE,scope:this,handler:this.onDelete}]});ExtMVC.view.scaffold.Index.superclass.constructor.call(this,A);ExtMVC.OS.getOS().setsTitle(this)};Ext.extend(ExtMVC.view.scaffold.Index,Ext.grid.GridPanel,{preferredColumns:["id","title","name","first_name","last_name","login","username","email","email_address","content","message"],ignoreColumns:["password","password_confirmation"],narrowColumns:["id"],wideColumns:["message","content","description","bio"],hasTopToolbar:true,hasBottomToolbar:true,buildColumns:function(C){var E=[];var A=[];for(var D=0;D<C.fields.length;D++){var G=C.fields[D];if(this.preferredColumns.indexOf(G.name)>-1){E.push(this.buildColumn(G.name))}}for(var D=C.fields.length-1;D>=0;D--){var G=C.fields[D];if(this.preferredColumns.indexOf(G.name)==-1&&this.ignoreColumns.indexOf(G.name)==-1){E.push(this.buildColumn(G.name))}if(this.wideColumns.indexOf(G.name)){A.push(G.name)}}var F=E.length+(2*A.length);for(var D=E.length-1;D>=0;D--){var B=E[D];if(this.narrowColumns.indexOf(B.id)>-1){Ext.applyIf(B,{width:30})}else{if(this.wideColumns.indexOf(B.id)>-1){Ext.applyIf(B,{width:200})}else{Ext.applyIf(B,{width:100})}}}return E},buildColumn:function(A){var A=A||{};if(typeof(A)=="string"){A={name:A}}return Ext.applyIf(A,{id:A.name,header:A.name.replace(/_/g," ").titleize(),sortable:true,dataIndex:A.name})},buildTopToolbar:function(){this.addButton=new Ext.Button({text:"New "+this.model.modelName.titleize(),scope:this,iconCls:"add",handler:this.onAdd});this.editButton=new Ext.Button({text:"Edit selected",scope:this,iconCls:"edit",disabled:true,handler:this.onEdit});this.deleteButton=new Ext.Button({text:"Delete selected",disabled:true,scope:this,iconCls:"delete",handler:this.onDelete});this.getSelectionModel().on("selectionchange",function(A){if(A.getCount()>0){this.deleteButton.enable();this.editButton.enable()}else{this.deleteButton.disable();this.editButton.disable()}},this);return[this.addButton,"-",this.editButton,"-",this.deleteButton]},buildBottomToolbar:function(A){var B=new this.model({});return new Ext.PagingToolbar({store:A,displayInfo:true,pageSize:25,emptyMsg:String.format("No {0} to display",B.humanPluralName)})},onAdd:function(){this.os.router.redirectTo({controller:this.controllerName,action:"new"})},onEdit:function(){var A=this.getSelectionModel().getSelected();if(A){this.os.router.redirectTo({controller:this.controllerName,action:"edit",id:A.data.id})}},onDelete:function(){Ext.Msg.confirm("Are you sure?",String.format("Are you sure you want to delete this {0}?  This cannot be undone.",this.model.modelName.titleize()),function(A){if(A=="yes"){var B=this.getSelectionModel().getSelected();if(B){this.controller.fireAction("destroy",null,[B.data.id,this.store])}}},this)}});Ext.reg("scaffold_index",ExtMVC.view.scaffold.Index);ExtMVC.view.scaffold.New=Ext.extend(ExtMVC.view.scaffold.ScaffoldFormPanel,{initComponent:function(){Ext.applyIf(this,{title:"New "+this.model.prototype.modelName.capitalize(),saveHandler:this.onCreate});ExtMVC.view.scaffold.New.superclass.initComponent.apply(this,arguments)}});Ext.reg("scaffold_new",ExtMVC.view.scaffold.New);ExtMVC.view.scaffold.Edit=Ext.extend(ExtMVC.view.scaffold.ScaffoldFormPanel,{initComponent:function(){Ext.applyIf(this,{title:"Edit "+this.model.prototype.modelName.capitalize(),saveHandler:this.onUpdate});ExtMVC.view.scaffold.Edit.superclass.initComponent.apply(this,arguments)}});Ext.reg("scaffold_edit",ExtMVC.view.scaffold.Edit);ExtMVC.view.HasManyEditorGridPanel=Ext.extend(Ext.grid.EditorGridPanel,{initComponent:function(){Ext.applyIf(this,{autoScroll:true,store:this.association.findAll(),viewConfig:{forceFit:true}});if(this.hasTopToolbar){this.addTopToolbar()}ExtMVC.view.HasManyEditorGridPanel.superclass.initComponent.apply(this,arguments);this.on("afteredit",function(A){A.record.save({success:function(){A.record.commit()}})},this);this.getSelectionModel().on("selectionchange",function(A,B){if(this.deleteButton){this.deleteButton.enable()}},this)},hasTopToolbar:true,hasNewButton:true,hasDeleteButton:true,addTopToolbar:function(B){var A=[];if(this.hasNewButton){this.newButton=new Ext.Toolbar.Button({iconCls:"add",text:"Add",scope:this,handler:this.onAdd});A.push(this.newButton);A.push("-")}if(this.hasDeleteButton){this.deleteButton=new Ext.Toolbar.Button({text:"Remove selected",disabled:true,iconCls:"delete",scope:this,handler:this.onDelete});A.push(this.deleteButton)}Ext.applyIf(this,{tbar:A})},windowConfig:{},onAdd:function(A){if(!this.addWindow){this.addWindow=new Ext.Window(Ext.applyIf(this.windowConfig,{title:"New",layout:"fit",modal:true,height:300,width:400,items:[this.form],closeAction:"hide",buttons:[{text:"Save",iconCls:"save",scope:this,handler:this.onSaveNew},{text:"Cancel",iconCls:"cancel",scope:this,handler:this.onCancelNew}]}))}this.addWindow.show()},onDelete:function(B){var A=this.getSelectionModel().selection.record;if(A){A.destroy({scope:this,success:function(){this.store.reload()},failure:function(){Ext.Msg.alert("Delete failed","Something went wrong while trying to delete - please try again");this.store.reload()}})}this.deleteButton.disable()},onSaveNew:function(){this.association.create(this.form.getForm().getValues(),{scope:this,success:function(B,A){this.store.reload();this.addWindow.hide()},failure:function(B,A){this.form.getForm().clearInvalid();this.form.getForm().markInvalid(B.errors.forForm())}})},onCancelNew:function(A){this.addWindow.hide()}});Ext.reg("hasmany_editorgrid",ExtMVC.view.HasManyEditorGridPanel);