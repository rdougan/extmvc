Ext.ns('ExtMVC.Model.Adapter');

(function() {
  var A = ExtMVC.Model.Adapter;
  
  A.REST = {
    initialize: function(model) {
      // console.log('initialising REST adapter');
      
      A.Abstract.initialize(model);
    },
    
    classMethods: {
      /**
       * Generic find method, accepts many forms:
       * find(10, opts)      // equivalent to findById(10, opts)
       * find('all', opts)   // equivalent to findAll(opts)
       * find('first', opts) // equivalent to findById(1, opts)
       */
      find: function(what, options) {
        var id;
        if (id = parseInt(what, 10)) {
          return this.findById(id, options);
        };
        
        switch(what) {
          case 'first': return this.findById(1, options);
          default     : return this.findAll(options);
        }
      },
      
      /**
       * Shortcut for findByField('id', 1, {})
       */
      findById: function(id, options) {
        // return this.findByField('id', id, options);
        var options = options || {};
        
        // TODO
        // Old code before below fix
        // Ext.applyIf(options, {
        //   url: this.singleDataUrl(id)
        // });
        
        // This needs to be done as url is set as 'null' in
        // crudcontroller.js line 133.
        // this is temp n00b hack which teh master can fix. can't use apply either.
        if (options.url == null) {
          options.url = this.singleDataUrl(id);
        };
        
        return this.performFindRequest(options);
      },
          
      /**
       * Performs a custom find on a given field and value pair.  e.g.:
       * User.findByField('email', 'adama@bsg.net') creates the following request:
       * GET /users?email=adama@bsg.net
       * And creates an array of User objects based on the server's response
       * @param {String} fieldName The name of the field to search on
       * @param {String/Number} matcher The field value to search for
       * @param {Object} options An object which should contain at least a success function, which will
       * be passed an array of instantiated model objects
       */
      findByField: function(fieldName, matcher, options) {
        var fieldName = fieldName || 'id';
        var options   = options || {};
        
        options.conditions = options.conditions || [];
        options.conditions.push({key: fieldName, value: matcher, comparator: '='});
                
        return this.performFindRequest(options);
      },
      
      findAll: function(options) {
        var options = options || {};
        
        var url = options.url ? this.namespacedUrl(options.url) : this.collectionDataUrl();
        
        var proxyOpts = {};
        Ext.apply(proxyOpts, this.proxyConfig, {
          url:    url,
          method: "GET"
        });
        
        return new Ext.data.Store(
          Ext.applyIf(options, {
            autoLoad:   true,
            remoteSort: false,
            proxy:      new this.proxyType(proxyOpts),
            reader:     this.getReader()
          })
        );
      },
      
      /**
       * Private, internal methods below here.  Not expected to be useful by anything else but
       * are left public for now just in case
       */
       
      /**
       * Underlying function which handles all find requests.  Private
       */
      performFindRequest: function(options) {
        var options = options || {};
        Ext.applyIf(options, {
          scope:   this,
          url:     this.collectionDataUrl(),
          method:  'GET',
          success: Ext.emptyFn,
          failure: Ext.emptyFn
        });
        
        //keep a handle on user-defined callbacks
        var callbacks = {
          successFn: options.success,
          failureFn: options.failure
        };
        
        // FIXME fix scope issue
        // For some reason the scope isnt correct on this?
        // cant figure out why. scope is set on the applyIf block so it should work..
        var scope = this;
        
        options.success = function(response, opts) {
          scope.parseSingleLoadResponse(response, opts, callbacks);
        };
        
        /**
         * Build params variable from condition options.  Params should always be a string here
         * as we're dealing in GET requests only for a find
         */
        var params = options.params || '';
        if (options.conditions && options.conditions[0]) {
          for (var i=0; i < options.conditions.length; i++) {
            var cond = options.conditions[i];
            params += String.format("{0}{1}{2}", cond['key'], (cond['comparator'] || '='), cond['value']);
          };
          
          delete options.conditions;
        };
        options.params = params;

        return Ext.Ajax.request(options);
      },
      
      /**
       * @property urlExtension
       * @type String
       * Extension appended to the end of all generated urls (e.g. '.js').  Defaults to blank
       */
      urlExtension: '',

      /**
       * @property urlNamespace
       * @type String
       * Default url namespace prepended to all generated urls (e.g. '/admin').  Defaults to blank
       */
      urlNamespace: '',
      
      /**
       * @property port
       * @type Number
       * The web server port to contact (defaults to 80).  Requires host to be set also
       */
      port: 80,
      
      /**
       * @property host
       * @type String
       * The hostname of the server to contact (defaults to an empty string)
       */
      host: "",
      
      /**
       * @property proxyType
       * @type Function
       * A reference to the DataProxy implementation to use for this model (Defaults to Ext.data.HttpProxy)
       */
      proxyType: Ext.data.HttpProxy,
      
      /**
       * @property proxyConfig
       * @type Object
       * Config to pass to the DataProxy when it is created (e.g. use this to set callbackParam on ScriptTagProxy, or similar)
       */
      proxyConfig: {},
      
      /**
       * Called as the 'success' method to any single find operation (e.g. findById).
       * The default implementation will parse the response into a model instance and then fire your own success of failure
       * functions as provided to findById.  You can override this if you need to do anything different here, for example
       * if you are loading via a script tag proxy with a callback containing the response
       * @param {String} response The raw text of the response
       * @param {Object} options The options that were passed to the Ext.Ajax.request
       * @param {Object} callbacks An object containing a success function and a failure function, which should be called as appropriate
       */
      parseSingleLoadResponse: function(response, options, callbacks) {
        var m = this.getReader().read(response);
        if (m && m.records[0]) {
          m.records[0].newRecord = false;
          callbacks.successFn.call(options.scope, m.records[0]);
        } else {
          callbacks.failureFn.call(options.scope, response);
        };
      },
      
      /**
       * URL to retrieve a JSON representation of this model from
       */
      singleDataUrl : function(id) {
        return this.namespacedUrl(String.format("{0}/{1}", this.urlName, id));
      },
  
      /**
       * URL to retrieve a JSON representation of the collection of this model from
       * This would typically return the first page of results (see {@link #collectionStore})
       */
      collectionDataUrl : function() {
        return this.namespacedUrl(this.urlName);
      },
  
      /**
       * URL to retrieve a tree representation of this model from (in JSON format)
       * This is used when populating most of the trees in ExtMVC, though
       * only applies to models which can be representated as trees
       */
      treeUrl: function() {
        return this.namespacedUrl(String.format("{0}/tree", this.urlName));
      },
  
      /**
       * URL to post details of a drag/drop reorder operation to.  When reordering a tree
       * for a given model, this url is called immediately after the drag event with the
       * new configuration
       * TODO: Provide more info/an example here
       */
      treeReorderUrl: function() {
        return this.namespacedUrl(String.format("{0}/reorder/{1}", this.urlName, this.data.id));
      },
  
      /**
       * Provides a namespaced url for a generic url segment.  Wraps the segment in this.urlNamespace and this.urlExtension
       * @param {String} url The url to wrap
       * @returns {String} The namespaced URL
       */
      namespacedUrl: function(url) {
        url = url.replace(/^\//, ""); //remove any leading slashes
        return(String.format("{0}{1}/{2}{3}", this.hostName(), this.urlNamespace, url, this.urlExtension));
      },
      
      /**
       * Builds the hostname if host and optionally port are set
       * @return {String} The host name including port, if different from port 80
       */
      hostName: function() {
        var p = this.port == 80 ? '' : this.port.toString();
        
        if (this.host == "") {
          return "";
        } else {
          return this.port == 80 ? this.host : String.format("{0}:{1}", this.host, this.port);
        };
      }
    },
    
    instanceMethods: {
      /**
       * Saves this model instance to the server.
       * @param {Object} options An object passed through to Ext.Ajax.request.  The success option is a special case,
       * and is called with the newly instantiated model instead of the usual (response, options) signature
       */
      save: function(options) {
        var options = options || {};
        
        if (options.performValidations === true) {
          //TODO: tie in validations here
        };
        
        //keep a reference to this record for use in the success and failure functions below
        var record = this;
        
        //set a _method param to fake a PUT request (used by Rails)
        var params = options.params || this.namespaceFields();
        if (!this.newRecord) { params["_method"] = 'put'; }
        delete options.params;
        
        //if the user passes success and/or failure functions, keep a reference to them to allow us to do some pre-processing
        var userSuccessFunction = options.success || Ext.emptyFn;
        var userFailureFunction = options.failure || Ext.emptyFn;
        delete options.success; delete options.failure;
        
        //function to call if Ext.Ajax.request is successful
        options.success = function(response) {
          //definitely not a new record any more
          record.newRecord = false;
          
          userSuccessFunction.call(options.scope || record, record, response);
        };
        
        //function to call if Ext.Ajax.request fails
        options.failure = function(response) {
          //parse any errors sent back from the server
          record.readErrors(response.responseText);
          
          userFailureFunction.call(options.scope || record, record, response);
        };
        
        //do this here as the scope in the block below is not always going to be 'this'
        var url = this.url();
        
        Ext.applyIf(options, {
          // url:     url, url == null sometimes so this doesnt work
          method:  'POST',
          params:  params
        });
        
        //fix for the above
        if (options.url == null) {
          options.url = url;
        };
        
        Ext.Ajax.request(options);
      },
      
      /**
       * Updates the model instance and saves it.  Use setValues({... new attrs ...}) to change attributes without saving
       * @param {Object} updatedAttributes An object with any updated attributes to apply to this instance
       * @param {Object} saveOptions An object with save options, such as url, callback, success, failure etc.  Passed straight through to save()
       */
      update: function(updatedAttributes, saveOptions) {
        updatedAttributes = updatedAttributes || {};
        saveOptions = saveOptions || {};
        
        this.setValues(updatedAttributes);
        this.save(saveOptions);
      },
      
      reload: function() {
        console.log('reloading');
      },
      
      destroy: function(options) {
        var options = options || {};
        
        Ext.Ajax.request(
          Ext.applyIf(options, {
            url:    this.url(),
            method: 'post',
            params: "_method=delete"
          })
        );
      },
      
      /**
       * Namespaces fields within the modelName string, taking into account mappings.  For example, a model like:
       * 
       * modelName: 'user',
       * fields: [
       *   {name: 'first_name', type: 'string'},
       *   {name: 'last_name',  type: 'string', mapping: 'last'}
       * ]
       * 
       * Will be decoded to an object like:
       * 
       * {
       *   'user[first_name]': //whatever is in this.data.first_name
       *   'user[last]':       //whatever is in this.data.last_name
       * }
       *
       * Note especially that the mapping is used in the key where present.  This is to ensure that mappings work both
       * ways, so in the example above the server is sending a key called last, which we convert into last_name.  When we
       * send data back to the server, we convert last_name back to last.
       */
      namespaceFields: function() {
        var fields    = this.fields;
        var namespace = this.modelName;
        
        var nsfields = {};
        
        for (var i=0; i < fields.length; i++) {
          var item = fields.items[i];
          
          //don't send virtual fields back to the server
          if (item.virtual) {continue;}
          
          nsfields[String.format("{0}[{1}]", namespace.toLowerCase(), item.mapping || item.name)] = this.data[item.name];
        };
        
        //not sure why we ever needed this... 
        // for (f in fields) {
        //   nsfields[String.format("{0}[{1}]", namespace.toLowerCase(), this.data[f.name])] = fields.items[f];
        // }
        
        return nsfields;
      }
    }
  };
})();

ExtMVC.Model.AdapterManager.register('REST', ExtMVC.Model.Adapter.REST);