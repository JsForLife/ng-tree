/**
 * 基于二叉树先序遍历的数据抓取
 * 参数说明：
 * result-最终返回的结果数组
 * org-未处理前的源数据(origin)
 * child-子节点集合的字段名
 * key-是否选择的标志字段
 * val-想从当前节点抓取的目标属性值
 * cb-将递归结果作为参数回调函数
 * end-是否为最后节点的标志位，决定何时调用callback的关键
 * **/
F.treeRecursive = function(org,child,key,val,cb,result,end){
    //初始化结果数组
    result = result || []
    //初始化是否为最后节点的标志位
    if(end == undefined){
        end = true
    }
    //初始化每层最右节点下标
    var endIndex = org.length - 1
    angular.forEach(org,function(item,index){
        //节点上的关键标志为true时，抓取想要的某个属性值
        if(item[key] == true){
            if(item[val]){result.push(item[val])}
        }
        //获取子节点
        var children = item[child] || []
        var len = children.length
        //若父节点和当前子节点都是最右节点,则为true，否则为false
        //其次这里不直接用end的原因是为了防止全局变量带来的污染
        var nextEnd = end && (index === endIndex)
        //若子节点存在，递归子节点
        if(children.length){
            F.treeRecursive(children,child,key,val,cb,result,nextEnd)
        }else if(nextEnd){
            cb && cb(result)
        }
    })
}