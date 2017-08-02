/**
 * Created by Claiyre on 2017/8/2.
 */

function easyAjax(method,url,data,callback,async){
    var xhr = createXHR();
    //默认异步
    if(async === undefined){
        async = true;
    }
    //get时将查询字符串添加至url后面
    if(method.toLowerCase() === "get"){
        for(var key in data){
            url += (url.indexOf("?") === -1 ? "?":"&");
            url += encodeURIComponent(key) + "=" + encodeURIComponent(data[key])
        }
        data = null;
    }
    //异步
    if(async){
        xhr.onreadystatechange = function () {
            if(xhr.readyState === 4){
                if(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304){
                    callback(xhr.responseText)
                }
            }
        }
    }
    xhr.open(method,url,async);
    xhr.send(JSON.stringify(data));
    //同步时
    if(!async){
        if(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304){
            callback(xhr.responseText)
        }
    }

}
//创建xhr对象
function createXHR(){
    if(typeof XMLHttpRequest !== "undefined"){
        return new XMLHttpRequest();
    } else if(typeof ActiveXObject !== "undefined"){
        if(typeof arguments.callee.activeXString !== "string"){
            var version = ["Msxml2.XMLHTTP.6.0", "Msxml2.XMLHTTP.3.0", "Msxml2.XMLHTTP", "Microsoft.XMLHTTP"];
            for(var i=0; i<version.length; i++){
                try{
                    new ActiveXObject(version[i]);
                    arguments.callee.activeXString = version[i];
                    break;
                } catch (ex){
                    //跳过
                }
            }
        }
        return new ActiveXObject(arguments.callee.activeXString);
    } else {
        throw new Error("No XHR object available!");
    }
}



