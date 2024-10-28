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

function numberTime() {
    try {
        printResult("", "");

        var hasDotNumber = document.querySelector("#hasDotNumber").checked;

        var textIn = textareaInDom.value;

        var min = parseFloat(minDom.value);
        var max = parseFloat(maxDom.value);
        var allnumbers = [];
        for (let i = min; i <= max; i++) {
            allnumbers.push(i);
        }

        var unnumbers = [];
        var numbers;

        if (hasDotNumber) {
            numbers = textIn.match(/[0-9]+(\.[0-9]+)?/g);
        } else {
            numbers = textIn.match(/[0-9]+/g);
        }
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

        var str1 = "";
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

document.querySelector("#btn-start").addEventListener("click", numberTime);
document.querySelector("#btn-reset").addEventListener("click", reset);
