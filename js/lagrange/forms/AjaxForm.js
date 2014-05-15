(function (root, factory) {
    var nsParts = 'lagrange/forms/AjaxForm'.split('/');
    var name = nsParts.pop();
    var ns = nsParts.reduce(function(prev, part){
        return prev[part] = (prev[part] || {});
    }, root);

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define('lagrange/forms/AjaxForm', ['jquery', 'lagrange/forms/AjaxPoster'], factory);
    } else {
        // Browser globals
        ns[name] = factory(root.jQuery, ns.AjaxPoster);
    }
}(this, function ($, AjaxPoster) {
    //===================================================================================
    //  AjaxPoster : Constructor function
    //
    //  @params : form : jQuery object of the form
    //
    //  @params : postingOptions : Object containing several settings necessary for 
    //                              the well behavior of AjaxPoster. These settings are :
    //                              {
    //                                  type: 'POST',
    //                                  url: '',
    //                                  dataType: 'JSON',
    //                                  debugOnFailure: true,
    //                                  onSuccess:this.onSuccess,
    //                                  onFailure:this.onFailure,
    //                                  beforePosting:this.beforePosting,
    //                                  afterPosting:this.afterPosting      
    //                              }
    //===================================================================================
    var AjaxForm = function(form, postingOptions) {
        this.form = form;

        this.fields = [];
        this.AjaxPoster = new AjaxPoster(postingOptions);
        this.setupForm();
    };
    
    AjaxForm.prototype = {
        //===========================================================
        // setupFields : Sets the fields of the form in this.fields
        //===========================================================
        setupFields:function(){
            var _self = this;
            _self.form.find(':input').not('[type=submit]').each(function(){
                var input = $(this);

                _self.fields.push({
                    "input": input,
                    "type": input.attr("type")
                });
            });
        },

        //===========================================================
        // setupForm : Sets the form and validation on click, and
        //              calls validCb after validation. Posts to the
        //              server using AjaxPoster.
        //
        // @params : validCb : function to be called after validation
        //                      of the form.
        //===========================================================
        setupForm:function(validCb) {
            this.setupFields();

            var _self = this;
            _self.form.find('[type=submit]').on('click', function(e) {
                e.preventDefault();

                for (var i = 0; i < _self.fields.length; i++) {
                    switch (_self.fields[i]["type"]) {
                        case "email":
                            if (!_self.validateEmailInput(_self.fields[i]["input"]))
                                return;
                            break;
                        default:
                            if (!_self.validateTextInput(_self.fields[i]["input"]))
                                return;
                            break;
                    }
                }

                if(validCb) validCb();

                var _post = _self.getPost();

                if (_post && _post != {}) {
                    _self.AjaxPoster.post(_post);
                }
            });
        },

        //===========================================================
        // getPost : Returns the post of the form as an object 
        //
        // @returns : post : Object containing keys and values for 
        //                    input names and values.
        //===========================================================
        getPost:function() {
            var post = {};

            this.form.find(':input').not('[type=radio]').each(function() {
                var inp = $(this);
                var inpVal = inp.val();

                if (inp.attr('type') == 'checkbox') {
                    if (inp.is(':checked')) {
                        inpVal = inpVal;
                    } else {
                        inpVal = null;
                    }
                }

                var n = inp.attr('name');
                if (n) post[n] = inpVal;
            });

            this.form.find(':radio').filter(':checked').each(function() {
                var inp = $(this);
                var inpVal = inp.val();
                post[inp.attr('name')] = inpVal;
            });
            //console.dir(post);
            return post;
        },

        //=====================================================================
        // validateTextInput : Validates a text input
        //
        // @params : input : jQuery object of the input to be validated
        //
        // @returns : bool
        //=====================================================================
        validateTextInput:function(input) {
            if (input.val() === undefined || input.val() === "") {
                input.addClass("error");
                return false;
            } else {
                return true;
            }
        },

        //=====================================================================
        // validateEmailInput : Validates an email input
        //
        // @params : input : jQuery object of the input to be validated
        //
        // @returns : bool
        //=====================================================================
        validateEmailInput:function(input) {
            if (input.val() === undefined || input.val() === "") {
                input.addClass("error");
                return false;
            } else {
                return true;
            }
        }       
    };

    return AjaxForm;
}));