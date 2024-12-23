var resultTitleDom = document.querySelector("#resultTitle");
var resultMsgDom = document.querySelector("#resultMsg");
var textareaInDom = document.querySelector("#textareaIn");
var minDom = document.querySelector("#min");
var maxDom = document.querySelector("#max");
var myKeyTemplate = document.querySelector(".my-key-template");
var desc = "输入你的数字，再输入统计范围，开始统计即可得出结果。";

/**
 * 保存用户输入的字符。
 *
 * @type {{key: string, numbers: string[]}[]}
 */
var inputedKeys = [];

/**
 * 输入方式
 * @type {"normal"|"keyboard"}
 */
var inputMode = "normal"; // 输入模式，默认 normal，可切换为 通过字符映射方式，值为：keyboard

function printResult(title, msg) {
    resultTitleDom.textContent = title;
    resultMsgDom.innerHTML = msg;
}

function applyIfhasDotOrNN(min, max) {
    // 如果范围中有小数，那么自动勾选 包含小数
    hasDotNumber.checked = !Number.isInteger(min) || !Number.isInteger(max);

    // 如果范围中有负数，那么自动勾选 包含负数
    hasNNumber.checked = min < 0 || max < 0;
}

function selectArea(min, max) {
    var a = document.querySelector(`input[value="${min},${max}"]`);

    if (!a) {
        a = document.querySelector(`input[value="0,50"]`);
        min = 0;
        max = 50;
    }
    localStorage.setItem("select-area", `${min},${max}`);
    a.checked = true;

    applyIfhasDotOrNN(min, max);
}

function showUserArea(min, max) {
    var lastAreaDom = document.querySelectorAll(".num-area");
    lastAreaDom = lastAreaDom[lastAreaDom.length - 1];

    var newAreaDom = lastAreaDom.cloneNode(true);
    newAreaDom.classList.add("user-area");
    var inputd = newAreaDom.querySelector("input");
    inputd.value = `${min},${max}`;
    inputd.addEventListener("input", onAreaInput);
    newAreaDom.querySelector("span.label-text").textContent = `${min}~${max}`;

    lastAreaDom.after(newAreaDom);
}

function readAndShowUserArea() {
    var userArea = JSON.parse(localStorage.getItem("user-area") || "[]");

    if (userArea.length > 0) {
        clearUserArea.classList.remove("hidden");
    }

    for (var i = 0; i < userArea.length; i++) {
        var a = userArea[i];
        showUserArea(a[0], a[1]);
    }

    // 恢复选择的范围
    setTimeout(() => {
        let sa = localStorage.getItem("select-area");
        if (!sa) return;

        sa = sa.split(",")
        selectArea(parseFloat(sa[0]), parseFloat(sa[1]));
    })
}

function numberTime() {
    try {
        printResult("统计结果", "统计中...");

        var hasDN = hasDotNumber.checked;
        var hasNN = hasNNumber.checked;

        var textIn = textareaInDom.value;

        let val = document.querySelector(".num-area input:checked").value;
        let vals = val.split(",");

        var min_ = parseFloat(vals[0]);
        var max_ = parseFloat(vals[1]);

        var min = Math.min(min_, max_);
        var max = Math.max(max_, min);

        var allnumbers = [];
        for (let i = min; i <= max; i++) {
            allnumbers.push(i);
        }

        var unnumbers = [];
        var numbers;
        var reg = "[0-9]+";

        if (hasDN) {
            reg = reg + "(\\.[0-9]+)?";
            // numbers = textIn.match(/[0-9]+(\.[0-9]+)?/g);
        }
        if (hasNN) {
            reg = "-?" + reg;
            // numbers = textIn.match(/[0-9]+/g);
        }

        numbers = textIn.match(new RegExp(reg, "g"));

        if (!numbers || numbers.length <= 0) {
            printResult("输入错误", "你输入的数据中没有数字。");
            return;
        }

        var tjobj = {};
        for (var i = 0; i < numbers.length; i++) {
            let nu = parseFloat(numbers[i]);

            let indexInAll = allnumbers.indexOf(nu);
            if (indexInAll !== -1) {
                allnumbers.splice(indexInAll, 1);
            }

            if (min <= nu && nu <= max) {
                if (typeof tjobj[nu] === "undefined") {
                    tjobj[nu] = 1;
                } else {
                    tjobj[nu] += 1;
                }
            } else {
                unnumbers.push(nu);
            }
        }

        var str3 = "";
        if (unnumbers.length > 0) {
            str3 = "<div class='text-gray-400'>不在统计范围的数字：" + unnumbers.join(", ") + ` (共${unnumbers.length}个)</div>`;
        }

        var anlobj = {"0": allnumbers};

        var str2 = "";
        Object.keys(tjobj).forEach(num => {
            var count = tjobj[num];
            str2 += `数字【${num}】：出现 ${count}次<br>`;

            if (typeof anlobj[count] === "undefined") {
                anlobj[count] = [num];
            } else {
                anlobj[count].push(num);
            }
        });
        if (!str2) {
            str2 = "没有出现在统计范围内的数字"
        }

        var str1 = ``;
        Object.keys(anlobj).forEach((count) => {
            str1 += `<div class="">出现【${count}】次: ${anlobj[count].map(num => `<span class="">${num}</span>`).join(" ")}`;
            if (anlobj[count].length > 0) {
                str1 += ` <b>(共${anlobj[count].length}个)</b>`;
            }
            str1 += `</div>`;
        });


        printResult(`统计完成，统计范围 [${min}~${max}]`, str1 + "<hr class='my-2'>" + str2 + "<hr class='my-2'>" + str3);


    } catch (err) {
        console.log(err);
        printResult("输入错误", err.message);
    }
}

function reset() {
    printResult("统计结果", desc);
    textareaInDom.value = "";
    inputedKeys = [];
    setTimeout(() => {
        renderUserInputedKeys();
    })
}

function addNewArea() {
    var min_ = parseFloat(minDom.value || "0");
    var max_ = parseFloat(maxDom.value || "0");
    var min = Math.min(min_, max_);
    var max = Math.max(min_, max_);

    // 保存
    var userArea = JSON.parse(localStorage.getItem("user-area") || "[]");
    if (!userArea.find(ar => ar.join("") === [min, max].join(""))) {
        userArea.push([min, max]);
    } else {
        // 已经有了。
        newAreaCreaterDom.classList.add("hidden");
        selectArea(min, max);
        minDom.value = "";
        maxDom.value = "";
        return;
    }
    localStorage.setItem("user-area", JSON.stringify(userArea));


    showUserArea(min, max);

    clearUserArea.classList.remove("hidden");
    newAreaCreaterDom.classList.add("hidden");
    setTimeout(() => {
        selectArea(min, max);
    })
    minDom.value = "";
    maxDom.value = "";
}

function onAreaInput() {
    // 保存选择的统计范围
    localStorage.setItem("select-area", this.value);

    let [min, max] = this.value.split(",").map(v => parseFloat(v));
    applyIfhasDotOrNN(min, max);
}

function onBtnClearUserAreaClick() {
    localStorage.removeItem("user-area");
    document.querySelectorAll(".user-area").forEach(function (dom){
        dom.remove();
    });
    clearUserArea.classList.add("hidden");

    // 重新选择一下用户选择的范围，因为有可能用户把已选择的自己的范围清除了，那么要重新选择。
    // 重新选择的时候只需要传入记录的用户选择的范围就可以了，如果用户刚才清除了这个范围，
    // 那么在选择的时候则找不到原来的dom了，会自动选择默认值。
    setTimeout(() => {
        let sa = localStorage.getItem("select-area");
        if (!sa) return;
        sa = sa.split(",")
        selectArea(parseFloat(sa[0]), parseFloat(sa[1]));
    })
}

function removeOneInKey(key) {
    var inputedKIndex = inputedKeys.findIndex(k => k.key === key);
    if (inputedKIndex === -1) {
        return;
    }

    var inputedK = inputedKeys[inputedKIndex];

    inputedK.numbers.pop();

    if (inputedK.numbers.length <= 0) {
        inputedKeys.splice(inputedKIndex, 1);
    }

    setTimeout(() => {
        renderUserInputedKeys();
    });
}

function renderUserInputedKeys() {
    if (inputedKeys.length > 0) {
        keyInputPlaceholder.classList.add("hidden");

        var updatedKey = [];

        // 更新界面上已有的数据。
        keyInputScreen.querySelectorAll(".inputed-key").forEach(function (keyDom) {
            var keyTextDom = keyDom.querySelector(".key-text");
            var k = keyDom.getAttribute("data-key");
            var count = keyTextDom.textContent.split("×").pop().match(/[0-9]+/);
            if (keyTextDom.textContent.includes("×") && count && count.length > 0) {
                count = parseInt(count[0]);
            } else {
                count = 1;
            }

            var inputedKey = inputedKeys.find(ik => ik.key === k);
            if (inputedKey) { // 界面上有此数据,且用户输入列表中也有。将用户输入里的数据回写到界面
                if (inputedKey.numbers.length > 1) {
                    keyTextDom.textContent = `${inputedKey.key} × ${inputedKey.numbers.length}`;
                } else {
                    keyTextDom.textContent = `${inputedKey.key}`;
                }
                if (count !== inputedKey.numbers.length) {
                    keyDom.classList.add("animate-keychange");
                    setTimeout(() => {
                        keyDom.classList.remove("animate-keychange");
                    }, 150)
                }
                updatedKey.push(inputedKey);
            } else { // 界面上有，但是用户输入列表没有，将其中界面移除。
                keyDom.remove();
            }
        });

        // 将界面上没有的数据，但是用户输入了，显示到界面上。
        for (var i = 0; i < inputedKeys.length; i++) {
            var userInputedKey = inputedKeys[i];

            // 如果此数据已经更新，则不需处理，
            if (updatedKey.find(uk => uk.key === userInputedKey.key)) {
                continue;
            }

            // 此时数据没有显示到界面上，立即创建并显示。
            var newInputKey = templateKey.cloneNode(true);
            newInputKey.id = "";
            newInputKey.classList.remove("hidden");
            newInputKey.setAttribute("data-key", userInputedKey.key);
            newInputKey.setAttribute("data-number", userInputedKey.numbers[0]);
            if (userInputedKey.numbers.length <= 1) {
                newInputKey.querySelector(".key-text").textContent = userInputedKey.key;
            } else {
                newInputKey.querySelector(".key-text").textContent = userInputedKey.key + "×" + userInputedKey.numbers.length;
            }
            newInputKey.querySelector(".key-del").addEventListener("click", function () {
                removeOneInKey(this.parentElement.getAttribute("data-key"));
            });
            keyInputScreen.appendChild(newInputKey);
        }

    } else {
        keyInputScreen.querySelectorAll(".inputed-key").forEach(function (keyDom) {
            keyDom.remove();
        });
        keyInputPlaceholder.classList.remove("hidden");
    }

    // 整理所有的数字，显示到大输入框。
    let numberStrs = [];
    for (let i = 0; i < inputedKeys.length; i++) {
        // for (let j = 0; j < inputedKeys[i].numbers.length; j++) {
        //
        // }
        numberStrs.push("[" + inputedKeys[i].numbers.join("  ") + "]");
    }
    textareaInDom.value = numberStrs.join("  ");
}

function onBtnKeyClick() {
    var numbers = this.getAttribute("data-numbers"); // 用逗号分割的数字字符串。
    var key = this.textContent.trim();

    var inputedK = inputedKeys.find(k => k.key === key);
    if (!inputedK) {
        inputedK = {key: key, numbers: []};
        inputedKeys.push(inputedK);
    }
    inputedK.numbers.push(numbers);

    renderUserInputedKeys();
}

function onBtnShowKeyClick() {
    if (inputMode === "normal") {
        mainBoardDom.classList.add("hidden");
        keyBoardDom.classList.remove("hidden");
        inputMode = "keyboard";
        this.textContent = "输入完成";
    } else {
        mainBoardDom.classList.remove("hidden");
        keyBoardDom.classList.add("hidden");
        inputMode = "normal";

        this.textContent = "通过字符输入";
    }
}

function onBtnKeyBoardOkClick() {
    mainBoardDom.classList.remove("hidden");
    keyBoardDom.classList.add("hidden");
    inputMode = "normal";
    btnShowKeyInput.textContent = "通过字符输入";
}

function renderCustomKey() {
    var customKeys = JSON.parse(localStorage.getItem("custom-keys") || "{}");

    // 先将所有的界面上已有的自定义字符映射移除。
    document.querySelectorAll(".custom-key").forEach(function (d) {
        d.remove();
    });

    var myKeyList = document.querySelector(".my-key-list");
    var myKeyListEmpty = document.querySelector(".my-key-list-empty");
    var keys = Object.keys(customKeys);
    if (keys.length > 0) {
        myKeyListEmpty.classList.add("hidden");
    } else {
        myKeyListEmpty.classList.remove("hidden");
    }

    keys.forEach(function (key) {

        let newCustomKeyDom = myKeyTemplate.cloneNode(true);
        newCustomKeyDom.classList.add("custom-key");
        newCustomKeyDom.classList.remove("hidden", "my-key-template")
        newCustomKeyDom.setAttribute("data-numbers", customKeys[key]);
        newCustomKeyDom.textContent = key;
        newCustomKeyDom.addEventListener("click", onBtnKeyClick);
        myKeyList.appendChild(newCustomKeyDom);
    });
}

function onBtnDelKeyClick() {
    var kText = this.getAttribute("data-key");
    var customKeys = JSON.parse(localStorage.getItem("custom-keys") || "{}");
    delete customKeys[kText];
    localStorage.setItem("custom-keys", JSON.stringify(customKeys));

    renderCustomKey();
    setTimeout(() => {
        renderAllKeysMap();
    })
}

/**
 *
 * @returns {{key: string, numbers: string, custom: boolean}[]}
 */
function getAllKeysMap() {
    var arr = [];
    Array.from(document.querySelectorAll(".my-key-list .my-key")).reverse().forEach(function (key) {
        var kText = key.textContent.trim();
        var kNumbers = key.getAttribute("data-numbers");
        arr.push({key: kText, numbers: kNumbers, custom: key.classList.contains("custom-key")});
    });
    return arr;
}

// 将所有的字符映射规则渲染到弹出框中。
function renderAllKeysMap() {
    let html = '';
    let allKeysMap = getAllKeysMap();
    if (allKeysMap.length > 0) {
        html = `<table class="table table-xs"><thead><tr><th>字符</th><th>数字列表</th><th>操作</th></tr></thead><tbody>`;
        allKeysMap.forEach(function (key) {
            var kText = key.key;
            var kNumbers = key.numbers;
            html += `<tr><td>${kText}</td><td>${kNumbers}</td><td><button data-key="${kText}" class="custom-key-del btn btn-xs btn-error whitespace-nowrap" ${key.custom ? "" : "disabled"}>删除</button></td></tr>`;
        });
        html += "</tbody></table>";
    } else {
        html = `<div class="text-center p-5 text-gray-600 flex flex-row flex-wrap justify-center items-center h-full gap-2">没有定义任何字符按钮，你可以通过<kbd class="kbd kbd-sm">新增映射</kbd>或<kbd class="kbd kbd-sm">导入</kbd>来添加字符按钮</div>`
    }

    document.querySelector(".keysmap").innerHTML = html;

    setTimeout(() => {
        document.querySelectorAll(".custom-key-del").forEach(function (delBtn) {
            delBtn.addEventListener("click", onBtnDelKeyClick);
        })
    })
}

function addCustomKey(k, numbers) {
    let customKeys = JSON.parse(localStorage.getItem("custom-keys") || "{}");
    customKeys[k] = numbers;
    localStorage.setItem("custom-keys", JSON.stringify(customKeys));
}

/**
 *  批量添加自定义字符映射
 *
 * @param keys {{key: string, numbers: string, custom: boolean}[]}
 */
function addCustomKeys(keys) {
    if (keys.length <= 0) {
        return;
    }
    let customKeys = JSON.parse(localStorage.getItem("custom-keys") || "{}");
    for (let i = 0; i < keys.length; i++) {
        let k = keys[i];
        customKeys[k.key] = k.numbers;
    }
    localStorage.setItem("custom-keys", JSON.stringify(customKeys));
}

function onBtnAddNewCustomKeyClick() {
    var k = customKeyInput.value.trim();
    var numbers = customKeyNumbersInput.value.trim();
    if (k.length <= 0 || numbers.length <= 0 || !numbers.match(/[0-9]/)) {
        // 输入不规范，啥也不做。
        return;
    }

    addCustomKey(k, numbers);

    renderCustomKey();
    customKeyInput.value = "";
    customKeyNumbersInput.value = "";
    newCustomKeyCreaterDom.classList.add('hidden');

    setTimeout(() => {
        renderAllKeysMap();
    })
}

function onBtnKeyBoardClearClick() {
    inputedKeys = [];
    setTimeout(() => {
        renderUserInputedKeys();
    })
}

function onPasteInputInput(event) {

}
function onPasteInputPaste(event) {
    event.preventDefault();
    var text =  (event.originalEvent || event).clipboardData.getData('text/plain');
    document.execCommand("insertText", false, text);
}

// 保存粘贴识别的字符结果
var pasteDataResult = [];

function onBtnParseKeyTextClick() {
    parseKeyTextAndShow(pasteInput.textContent.trim());
}

function onBtnConfirmPasteClick() {
    inputedKeys = pasteDataResult;
    pasteDataResult = [];
    renderUserInputedKeys();
    pasteInput.textContent = '';
    parseResult.classList.add('hidden');
    modal_paste.close();
}

/**
 *  解析已有的字符串，将字符串中符合映射表中的字符提取出来。
 *
 * @param str
 *
 * @return {{html: string, keys: {key: string, numbers: string[]}[]}}
 */
function parseKeyText(str) {
    var html = str;
    var keys = [];
    var allKeys = getAllKeysMap();
    allKeys = allKeys.sort(function(k1,k2){
        return k2.key.length - k1.key.length;
    });
    for (var i = 0; i < allKeys.length; i++) {
        var key = allKeys[i];
        html = html.replace(new RegExp(key.key, "g"), function (match) {
            var ok = keys.find(k => k.key === match);
            if (!ok) {
                ok = {
                    key: match,
                    numbers: []
                }
                keys.push(ok);
            }
            ok.numbers.push(allKeys.find(k => k.key === match).numbers);
            return `<span class="text-success font-bold">${match}</span>`
        });
    }

    return {html: html, keys: keys}
}

function parseKeyTextAndShow(str) {

    var res = parseKeyText(str);

    pasteDataResult = res.keys;

    pasteInput.innerHTML = res.html;

    if (res.keys.length > 0) {
        parseResult.classList.remove("hidden");
        parseResultKeys.innerHTML = res.keys.map(k => {
            var t = ""
            if (k.numbers.length <= 1) {
                t = `${k.key}`
            } else {
                t = `${k.key}×${k.numbers.length}`;
            }
            return `<div class="badge badge-xs badge-accent py-2">${t}</div>`
        }).join("");
    } else {
        parseResult.classList.add("hidden");
        parseResultKeys.innerHTML = "";
    }
}

function doDownload(content, filename) {
    let eleLink = document.createElement('a');
    eleLink.download = filename;
    eleLink.classList.add("hidden");
    eleLink.style.display = 'none';
    let blob = new Blob([content]);
    eleLink.href = URL.createObjectURL(blob);
    document.body.appendChild(eleLink);
    eleLink.click();
    document.body.removeChild(eleLink);
}

function onSelectCustomKeyFile(e) {
    let f = this.files[0];
    if (!f) {
        return;
    }

    let fr = new FileReader();
    fr.onload = function () {
        try {
            let allKeysMap = JSON.parse(fr.result);
            addCustomKeys(allKeysMap.reverse());
            renderCustomKey();
            setTimeout(() => {
                renderAllKeysMap();
            });
        }catch (err) {
            window.alert("导入出错，请选择正确的配置文件。错误信息：" + err.message);
        }
    }

    fr.readAsText(f);
}

function onExportCustomKeyClick() {
    let fileContent = JSON.stringify(getAllKeysMap(), null, 2);
    doDownload(fileContent, "数字统计.自定义字符按钮.json");
}

window.onload = function () {

    document.querySelector("#btn-start").addEventListener("click", numberTime);
    document.querySelector("#btn-reset").addEventListener("click", reset);
    document.querySelector("#addNewAreaBtn").addEventListener("click", addNewArea);
    clearUserArea.addEventListener("click", onBtnClearUserAreaClick);

    btnShowKeyInput.addEventListener("click", onBtnShowKeyClick);
    btnKeyBoardOk.addEventListener("click", onBtnKeyBoardOkClick);
    btnAddNewCustomKey.addEventListener("click", onBtnAddNewCustomKeyClick);
    btnKeyBoardClear.addEventListener("click", onBtnKeyBoardClearClick);

    // 将保存的范围显示出来
    readAndShowUserArea();

    // 将保存的自定义字符映射显示出来
    renderCustomKey();

    // 监听用户选择的范围并保存
    document.querySelectorAll(".num-area input").forEach(inputDom => {
        inputDom.addEventListener("input", onAreaInput)
    });

    // 监听字符按钮
    document.querySelectorAll(".my-key").forEach(keyDom => {
        keyDom.addEventListener("click", onBtnKeyClick);
    });

    setTimeout(() => {
        renderAllKeysMap();
    })

    // 监听字符粘贴框的粘贴事件
    pasteInput.addEventListener("paste", onPasteInputPaste);
    pasteInput.addEventListener("input", onPasteInputInput);
    btnParseKeyText.addEventListener("click", onBtnParseKeyTextClick);
    btnConfirmPaste.addEventListener("click", onBtnConfirmPasteClick);

    // 监听导入、导出
    importCustomKeyInput.addEventListener("change", onSelectCustomKeyFile);
    exportCustomKey.addEventListener("click", onExportCustomKeyClick)
}