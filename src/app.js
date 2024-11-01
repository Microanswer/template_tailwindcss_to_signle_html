var resultTitleDom = document.querySelector("#resultTitle");
var resultMsgDom = document.querySelector("#resultMsg");
var textareaInDom = document.querySelector("#textareaIn");
var minDom = document.querySelector("#min");
var maxDom = document.querySelector("#max");
var desc = "输入你的数字，再输入统计范围，开始统计即可得出结果。";

function printResult(title, msg) {
    resultTitleDom.textContent = title;
    resultMsgDom.innerHTML = msg;
}

printResult("", desc);

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
        printResult("", "");

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
            printResult("输入错误：", "你输入的数据中没有数字。");
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
            str3 = "不在统计范围的数字：" + unnumbers.join(", ") + ` (共${unnumbers.length}个)`;
        }

        var anlobj = {"0": allnumbers};

        var str2 = "";
        Object.keys(tjobj).forEach(num => {
            var count = tjobj[num];
            str2 += `数字【${num}】：出现了 ${count}次<br>`;

            if (typeof anlobj[count] === "undefined") {
                anlobj[count] = [num];
            } else {
                anlobj[count].push(num);
            }
        });

        var str1 = `统计的范围 [${min}~${max}]:<br><br>`;
        Object.keys(anlobj).forEach(count => {
            str1 += `出现【${count}】次的：${anlobj[count].join(", ")}`;
            if (anlobj[count].length > 0) {
                str1 += ` (共${anlobj[count].length}个)`;
            }
            str1 += `<br>`;
        });


        printResult("统计完成：", str1 + "<br><br>" + str2 + "<br><br>" + str3);


    } catch (err) {
        console.log(err);
        printResult("输入错误：", err.message);
    }
}

function reset() {
    printResult("", desc);
    textareaInDom.value = "";
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

window.onload = function () {

    document.querySelector("#btn-start").addEventListener("click", numberTime);
    document.querySelector("#btn-reset").addEventListener("click", reset);
    document.querySelector("#addNewAreaBtn").addEventListener("click", addNewArea);
    clearUserArea.addEventListener("click", onBtnClearUserAreaClick);

    // 将保存的范围显示出来
    readAndShowUserArea();

    // 监听用户选择的范围并保存
    document.querySelectorAll(".num-area input").forEach(inputDom => {
        inputDom.addEventListener("input", onAreaInput)
    });
}