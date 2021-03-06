/*
* Auth: lgh
* 粗仿 幕课网分类导航
* http://www.imooc.com/course/list
*/

// require compoent
var Tabswitch = require('./_component/tabswitch')('mc_tab');
var Uls = require('./_component/uls')('pc_uls');
var List = require('widgets/listView/list');
var Pt = require('widgets/itemView/pic_title');
var render = React.render;

var ss;

/*
* cntData {Array}   二维数组
* ele     {String}  页面元素的ID
* {return}  渲染结构到指定ID
*/

function abc(data){
    ss = _.flatten(data,true)
    ss.sort(function(a,b){
        var A_substring = a.footer[0].v.substring(2)
        var B_substring = b.footer[0].v.substring(2)
        if(A_substring < B_substring){
            return 1;
        }else if(A_substring > B_substring){
            return -1;
        }
    })
}

function likeImooc( navData,listData, ele, opts ){
    // 绑定tab的item元素的方法
    abc(listData)
    var tabItemDefaultMethod = function(){
        $('.tabswitch li[data-cls="first"]').addClass('active');
        $(this).click(function(e){
            console.log(listData==='');
            $(this).addClass('active')
            $(this).siblings().removeClass('active')
            var idf = $(this).attr('data-idf');
            if($(this).attr('data-cls')=="first") {
                SA.setter('pc_uls', { data: ss })
            }
            else{
                SA.setter('pc_uls', { data: listData[idf-1] })
            }
        })
    }


    a_listClass = opts && opts.navListClass ? opts.navListClass : 'coupons-nav';
    a_itemClass = opts && opts.navItemClass ? opts.navItemClass : '';

    // 渲染结构到页面
    render(
        <div>
            <Tabswitch data={navData} listClass={a_listClass} itemClass={a_itemClass} itemDefaultMethod={tabItemDefaultMethod}>
                <Uls data={ss} nodata={'您目前还没有订单'} listClass={'coupons_list like_app_list'} itemMethod={opts.listcb}  itemView={Pt}/>
            </Tabswitch>
        </div>
        ,document.getElementById(ele)
    )
}

module.exports = likeImooc
