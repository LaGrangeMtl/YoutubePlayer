(function (root, factory) {
    var nsParts = 'lagrange/forms/AjaxPoster'.split('/');
    var name = nsParts.pop();
    var ns = nsParts.reduce(function(prev, part){
        return prev[part] = (prev[part] || {});
    }, root);

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define('lagrange/forms/AjaxForm', ['jquery'], factory);
    } else {
        // Browser globals
        ns[name] = factory(root.jQuery);
    }
}(this, function ($) {
    //==============================================================================
    //  AjaxPoster : Constructor function
    //
    //  @params : options : Object containing several settings necessary for the
    //                      well behavior of AjaxPoster. These settings are :
    //                      {
    //                          type: 'POST',
    //                          url: '',
    //                          dataType: 'JSON',
    //                          debugOnFailure: true,
    //                          onSuccess:this.onSuccess,
    //                          onFailure:this.onFailure,
    //                          beforePosting:this.beforePosting,
    //                          afterPosting:this.afterPosting      
    //                      }
    //==============================================================================
    var AjaxPoster = function(options){
        this.isPosting = false;

        this.init(options);
    };

    AjaxPoster.prototype = {
        //==========================================================================
        //  init : Itinialisation function. Set options using the user defined
        //          options and the default ones.
        //
        //  @params : options : Object passed by the constructor function
        //==========================================================================
        init:function(options){
            var _self = this;

            // Default values
            var defaultOptions = {
                type: 'POST',
                url: '',
                dataType: "JSON",
                debugOnFailure: true,
                onSuccess:this.onSuccess,
                onFailure:this.onFailure,
                beforePosting:this.beforePosting,
                afterPosting:this.afterPosting
            };

            this.options = $.extend({}, defaultOptions, options);
        },

        //==========================================================================
        //  post : Main function of AjaxPoster to be called when we want to POST
        //          or GET data to/from a server.
        //
        //  @params : post : Post object usually representing values of a form. When
        //                    using AjaxForm, use AjaxForm.getPost() as post. 
        //
        //  @returns : afterPostDfd : $.Deferred() so that we can use it 
        //                            asynchronously and still know when it is done.
        //==========================================================================
        post:function(post){
            var _self = this;

            // Deactivate form while posting
            if(_self.isPosting === true){
                _self.deactivateForm();
                return;
            }
            
            _self.isPosting = true;
            var beforePostDfd = _self.options.beforePosting();
            var postDfd = $.Deferred();
            var afterPostDfd = $.Deferred();


            postDfd = $.ajax({
                type:_self.options.type,
                url:_self.options.url,
                dataType:_self.options.dataType,
                data:post
            });
            
            $.when(postDfd, beforePostDfd).then(
                function(data){
                    _self.options.onSuccess(data);
                },
                function(data, textStatus){
                    if(_self.options.debugOnFailure)
                        _self.debugFailure(data, textStatus);

                    _self.options.onFailure();
                }
            ).always(function(){
                afterPostDfd = _self.options.afterPosting();

                afterPostDfd.done(function(){
                    _self.reactivateForm();
                });
            }); 

            return afterPostDfd;
        },

        //=====================================================================
        //  deactivateForm : Deactivates posting while we are already posting,
        //                   thus preventing double posts to database.
        //=====================================================================
        deactivateForm:function(){
            console.log('Warning : Cannot POST or GET right now because we are already posting. The post function will reactivate after the POST or GET is completed.');
        },

        //===================================================================
        //  reactivateForm : Reactivates the form after posting is complete
        //===================================================================
        reactivateForm:function(){
            this.isPosting = false;
        },

        //=========================================================
        //  beforePosting : Actions that are done before posting.
        //
        //  This function can / should be overwritten, this
        //  function MUST return a $.Deferred()
        //
        //  @returns : dfd : $.Deferred()
        //=========================================================
        beforePosting:function(){
            var dfd = $.Deferred();

            console.log("Do this before posting");
            setTimeout(function(){
                dfd.resolve();
            }, 2000);

            return dfd;
        },

        //===================================================================
        //  afterPosting : Actions that are done after posting, regardless
        //                 of the result of the request.
        //
        //  This function can / should be overwritten, this
        //  function MUST return a $.Deferred()
        //
        //  @returns : dfd : $.Deferred()
        //===================================================================
        afterPosting:function(){
            var dfd = $.Deferred();
            console.log("Do this after posting");
            
            dfd.resolve();
            return dfd;
        },

        //====================================================
        //  onSuccess : Called upon success of the request.
        //
        //  This function can / should be overwritten.
        //====================================================
        onSuccess:function(data){
            var _data = data[0];
            console.log(_data);
        },

        //====================================================
        //  onFailure : Called upon success of the request.
        //
        //  This function can / should be overwritten.
        //====================================================
        onFailure:function(){
            console.log("Do this after failure");
        },

        //==================================================================
        //  debugFailure : Called upon failure of the request.
        //
        //  This function is by default mapping errors and logging them.
        //  This behavior can be changed by setting options.debugOnFailure 
        //  to false. Logs the error in the console.
        //
        //  @params : x : Request object
        //
        //  @params : exception : Exception object
        //==================================================================
        debugFailure:function(x, exception){
            var message;
            var statusErrorMap = {
                '400' : "Server understood the request but request content was invalid.",
                '401' : "Unauthorised access.",
                '403' : "Forbidden resouce can't be accessed",
                '404' : "File not found",
                '500' : "Internal Server Error.",
                '503' : "Service Unavailable"
            };

            if (x.status) {
                message = statusErrorMap[x.status];

                if(!message)
                    message="Unknow Error, status code : " + x.status;                  
            }
            else if(exception=='parsererror'){
                message="Error.\nParsing JSON Request failed.";
            }
            else if(exception=='timeout'){
                message="Request Timed out.";
            }
            else if(exception=='abort'){
                message="Request was aborted by the server";
            }
            else {
                message="Unknow Error, exception : " + exception;
            }

            console.log(message);
        }
    };

    return AjaxPoster;
}));