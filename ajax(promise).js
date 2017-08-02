/**
 * Created by Claiyre on 2017/8/2.
 */

//返回一个promise对象;默认异步：async=true
function promiseAjax(method,url,data,async=true){
    let xhr = createXHR();

    //若是get,则将数据编码到url后
    if(method.toLowerCase() === "get"){
        let key;
        for(key in data){
            url += (url.indexOf("?") === -1 ? "?" : "&");
            url += `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`
        }
    }

    //若是异步
    if(async){
        return new Promise((resolve,reject) => {
            xhr.onreadystatechange = ()=> {
                if(xhr.readyState === 4){
                    if(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304){
                        resolve(xhr.responseText);
                    } else {
                        reject(new Error(xhr.statusText));
                    }
                }
            };
            xhr.open(method,url,async);
            xhr.send(JSON.stringify(data));
        })
    } else {  //同步
        xhr.open(method,url,async);
        xhr.send(JSON.stringify(data));

        //虽然返回的是promise,但这里仍是同步，只是为保持形式上的一致
        return new Promise((resolve,reject) => {
            if(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304){
                resolve(xhr.responseText);
            } else {
                reject(new Error(xhr.statusText));
            }
        })
    }
}

function createXHR(){
    if(typeof XMLHttpRequest !== "undefined"){
        return new XMLHttpRequest();
    } else if(typeof ActiveXObject){
        if(typeof arguments.callee.activeXString !== "string"){
            const version = ["Msxml2.XMLHTTP.6.0", "Msxml2.XMLHTTP.3.0", "Msxml2.XMLHTTP", "Microsoft.XMLHTTP"];
            for(let i=0; i<version.length; i++){
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
        throw new Error("NO XHR object available!");
    }
}