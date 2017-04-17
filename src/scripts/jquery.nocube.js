;(function(jQuery,window,document,undefined){
    var NoCube=function(ele,opt){
        this.$element=ele;
        this.$stageEle=ele.find('.nocube-stage');
        this.$wrapperEle=ele.find('.nocube-wrapper');
        this.$pageEle=this.$wrapperEle.children();
        this.defaults={
            stopKey:'Control',
            zoomPercent:0.6,
            animateTime:0.5,
        }
        this.options=$.extend({},this.defaults,opt)
        this.stopKeyDown=false;
        this.startTransform=false;
        this.startPointX=0;
        this.startPointY=0;
        this.rotateX=0;
        this.rotateY=0;
        this.cornerDeg=360/this.$pageEle.length
    }

    NoCube.prototype={
        init:function(){
            this.$element
                .css('overflow','hidden')
                .css('cursor','move');
            this.$stageEle
                .width(this.$element.width())
                .height(this.$element.height());
            var pageCount=this.$pageEle.length;
            var pageSelectWrapper=$('<div></div>');
            this.$stageEle.append(pageSelectWrapper);
            
            while(pageCount--){
                pageSelectWrapper.append('<div></div>');
            }
            
        },
        bindEvents:function(){
            var that=this;
            that.$element
                .bind('mousedown',function(event){
                    if(that.stopKeyDown) return;
                    that.startTransform=true;
                
                    that.$stageEle.css('transition','none');
                    that.$wrapperEle.css('transition','none');

                    that.$stageEle
                        .width(that.$element.width()*that.options.zoomPercent)
                        .height(that.$element.height()*that.options.zoomPercent)
                        .addClass('nocube-stage-perspective')
                        .css('margin','10% auto');
                    
                    transformChildren(that.$element.height()*that.options.zoomPercent);
                    
                    that.startPointX=event.screenX;
                    that.startPointY=event.screenY;

                }).bind('mousemove',function(event){
                    if(!that.startTransform) return;
                    
                    var scrollY=event.screenY-that.startPointY;
                    var scrollX=event.screenX-that.startPointX;

                    var rotateX=that.rotateX-scrollY/2;

                    that.$wrapperEle.css('transform','rotateY('+(scrollX/20)+'deg) rotateX('+rotateX+'deg) ');
                }).bind('mouseup',function(event){
                    if(!that.startTransform) return;
                    that.startTransform=false;

                    that.$wrapperEle.css('transition','all ease-in-out .5s');
                    that.$stageEle.css('transition','all ease-in-out .5s');

                    var rotateX=(event.screenY-that.startPointY)/2;
                    that.$pageEle.each(function(index,item){
                        if(Math.abs(rotateX)>=Math.abs(index*that.cornerDeg)){
                            if(Math.abs(rotateX)<=Math.abs(index*that.cornerDeg)+Math.abs(that.cornerDeg/2)){
                                rotateX=rotateX>=0?index*that.cornerDeg:-index*that.cornerDeg;
                                return false;
                            }
                            if(Math.abs(rotateX)>Math.abs(index*that.cornerDeg)+Math.abs(that.cornerDeg/2)&&Math.abs(rotateX)<=Math.abs((index+1)*that.cornerDeg)){
                                rotateX=rotateX>=0?(index+1)*that.cornerDeg:-(index+1)*that.cornerDeg;
                                return false;
                            }
                        }
                    });
                    that.rotateX=that.rotateX-rotateX
                    
                    that.$wrapperEle.css('transform','rotateY(0deg) rotateX('+that.rotateX+'deg)');
                    setTimeout(function(){
                        that.$stageEle
                            .width(that.$element.width())
                            .height(that.$element.height())
                            .removeClass('nocube-stage-perspective')
                            .css('margin','0px auto');
                        transformChildren(that.$element.height());
                    },500)
                });
            
            transformChildren(that.$element.height());
            function transformChildren(height){
                that.$pageEle.each(function(index,item){
                    var translatePx=0.5*height*1/Math.tan(Math.PI/180*(180/that.$pageEle.length));

                    $(item).css("transform",'rotateX('+(-index*that.cornerDeg)+'deg) translateZ('+translatePx.toFixed(2)+'px)')
                })
            }
        },
        bindStopEvents:function(){
            var that=this;
            $('html').on('keydown',function(event){
                if(event.key===that.options.stopKey){
                    that.stopKeyDown=true;
                    ele.css('user-select','text');
                    ele.css('cursor','text');
                }
            }).on('keyup',function(event){
                if(event.key===that.options.stopKey){
                    that.stopKeyDown=false;
                    ele.css('user-select','none');
                    ele.css('cursor','move');
                }
            })
        }
    }

    $.fn.nocube=function(opt){
        var nocube=new NoCube(this,opt);
        nocube.init();
        nocube.bindEvents();
        // nocube.bindStopEvents();
    }
})($,window,document,undefined);