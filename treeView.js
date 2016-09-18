/**
 * 主题树指令
 * **/
angular.module('app').directive('treeView', [function () {
    return {
        restrict: 'E',
        scope: {
            treeData: '=',   //要绑定的数据
            reset: '@',      //是否初始化，完全折叠，清除所有勾选
            nodeName: '@',   //树节点的字段名
            childName: '@',  //子节点集合的字段名
            checkName: '@',  //是否选择的字段名
            isDisabled: '@'  //是否禁用不全的菜单
        },
        templateUrl: G.path.src + '/common/treeView.html?v=' + G.load_version,
        link: function (scope, ele, attr) {

            //控制子代树是否全展开
            scope.openAll = function (item, key) {
                item.$$isExpend = key || false
                var child = item[scope.childName] || []
                var len = child.length
                if (len) {
                    for (var i = 0; i < len; i++) {
                        scope.openAll(child[i], key)
                    }
                }
            }

            //改变树分支展开和缩进的状态
            scope.itemExpended = function (item, $event) {
                item.$$isExpend = !item.$$isExpend;
                //控制取消选择时全部收起
                if (!item.$$isExpend) {
                    scope.openAll(item)
                }
                $event.stopPropagation();
            };

            //根据树的分支是否展开来显示图标
            scope.getItemIcon = function (item) {
                var isLeaf = scope.isLeaf(item);
                //树叶节点则不加图标
                if (isLeaf) {
                    return 'mar-left';
                }

                //根据展开的状态来定图标
                return item.$$isExpend ? 'fa fa-big fa-caret-down' : 'fa fa-big fa-caret-right';
            };

            //判断是不是树的叶节点，叶节点没有子代
            scope.isLeaf = function (item) {
                return !item[scope.childName] || !item[scope.childName].length;
            };

            //控制子代树的全选
            scope.checkAll = function (item, key) {
                //如果是根节点，则不传key值，值为自己当前值
                if (key !== undefined) {
                    item[scope.checkName] = key
                }
                var child = item[scope.childName] || []
                var len = child.length
                if (len > 0) {
                    for (var i = 0; i < len; i++) {
                        //将父级的值传给子级
                        var childItem = child[i]
                        scope.checkAll(child[i], item[scope.checkName])
                    }
                }
            }

            //勾选子节点时对父节点的反馈
            scope.parentCheck = function (item, parent) {
                var prev_parent = parent.$parent.$parent
                //一直递归到最外层的checkbox，有checkbox才有item属性
                if (parent.item) {
                    var child = parent.item[scope.childName] || []
                    //判断是否父节点是否只有一个子节点,是父节点的值就与子节点一致，否则判断有无
                    if (child.length <= 1) {
                        parent.item[scope.checkName] = item[scope.checkName]
                        scope.parentCheck(parent.item, prev_parent)
                    } else {
                        //不止一个子节点时，如果子节点的值为true则直接赋给父级，否则遍历父级的所有子代，如果无值为true则置为否
                        if (item[scope.checkName] == true) {
                            parent.item[scope.checkName] = item[scope.checkName]
                            scope.parentCheck(parent.item, prev_parent)
                        } else {
                            parent.item[scope.checkName] = false
                            for (var i in child) {
                                if (child[i][scope.checkName] == true) {
                                    parent.item[scope.checkName] = true
                                    break
                                }
                            }
                            scope.parentCheck(parent.item, prev_parent)
                        }
                    }
                }
            }
        }
    }
}])