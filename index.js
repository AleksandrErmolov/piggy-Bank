let STORE = [];
let count = 0;
let currentUpdateCart;
let cardDataArr = [];

const mainForm = document.querySelector(".main-form")
const slider = document.querySelector(".form-slider")
const pMonth = document.querySelector(".form-change-month")
const bidPecent = document.querySelector(".input-form-percent")
const createMoneyBoxButton = document.querySelector(".form-button-ok")
const cancelMoneyBoxButton = document.querySelector(".form-button-cancel")
const needMoney = document.querySelector(".input-form-need")
const haveMoney = document.querySelector(".form-input-have")
const sectionForm = document.querySelector(".form")
const targetInputForm = document.querySelector(".form-input-target")
const resultText = document.querySelector(".p-pay-month");
const buttonOnboarding = document.querySelector('.button-onboarding')
const buttonOpenNewForm = document.querySelector('.footer-button-add-form')
const cardBar = document.querySelector(".card-bar")
const formEdit = document.querySelector('.form-edit')
const formEditTarget = formEdit.querySelector(".form-input-target")
const formEditNeedMoney = formEdit.querySelector(".input-form-need")
const formEditInputHave = formEdit.querySelector(".form-input-have")
const formEditSlider = formEdit.querySelector(".form-slider")
const formEditMonth = formEdit.querySelector(".p-pay-month")
const formEditButtonOk = formEdit.querySelector(".form-button-ok")
const formEditButtonCancel = formEdit.querySelector(".form-button-cancel")
const formEditResultText = formEdit.querySelector(".p-pay-month")
const formEditBidPecent = formEdit.querySelector(".input-form-percent")
const formEditPMonth = formEdit.querySelector(".form-change-month")
const grafica = document.querySelector("#grafica");


slider.addEventListener("input", changeSlider)
slider.addEventListener("change", payment)
needMoney.addEventListener("change", checkInput)
haveMoney.addEventListener("change", checkInput)
needMoney.addEventListener("keyup", checkInput)
haveMoney.addEventListener("keyup", checkInput)
createMoneyBoxButton.addEventListener("click", createMoneyBox)
cancelMoneyBoxButton.addEventListener("click", cancelMoneyBox)
mainForm.addEventListener('submit', dataForm)
buttonOnboarding.addEventListener('click', closeOnbourding)
buttonOpenNewForm.addEventListener('click', openForm)

//Функция для срабатывания нажатия на кнопку
function checkInput(event) {
    payment()
}


// Делаем расчёт кредитной ставки банка.
function changeSlider() {
    pMonth.innerText = slider.value + " мес."
    if (slider.value <= 1) {
        bidPecent.value = "5"
    } else if (slider.value % 6 === 0) {
        const z = 5;
        bidPecent.value = `${z + ((slider.value / 6) * 0.5)}`
    }
}

//Заполняем форму ежемесячного платежа.
function payment() {
    const needSumm = document.querySelector(".input-form-need").value;
    const haveSumm = document.querySelector(".form-input-have").value;
    let depositPercent = bidPecent.value;
    let depositMonth = slider.value;

    let x = (1 + ((depositPercent * 0.01) / 12));
    let xExponent = Math.pow(x, depositMonth);
    let y = (12 / (depositPercent * 0.01));
    let result = (((needSumm - (haveSumm * xExponent)) / ((xExponent - 1) * y))).toFixed(2);

    if (result === "NaN" || haveSumm === "" || needSumm === "") {
        resultText.innerText = 'Заполните все поля'
    } else if (needSumm <= 0 || haveSumm < 0) {
        resultText.innerText = "Значение не может быть отрицательным"
        createMoneyBoxButton.disabled = "disabled"
    } else if (needSumm > haveSumm && result < 0) {
        resultText.innerText = `Проценты по вкладу - позволят \n вам заработать без копилки\n за ${slider.value} мес.`
        createMoneyBoxButton.disabled = ""
    }
    else if (result < 0) {
        resultText.innerText = "Первоначальная сумма более или равна требуемой"
        createMoneyBoxButton.disabled = "disabled"
    } else {
        resultText.innerText = `${result} ₽`;
        createMoneyBoxButton.disabled = "";
    }
}


//Функция по нажатию на кнопку - Создать копилку
function createMoneyBox(event) {
    grafica.style.display = 'none'
    if (needMoney.value == "" || haveMoney.value == "" || targetInputForm.value == "") {
        resultText.innerText = "Есть не заполненые поля"
    } else {

        sectionForm.style.display = "none"
    }
}

//Функция по нажатию на кнопку Закрыть
function cancelMoneyBox(event) {
    sectionForm.style.display = "none"
    needMoney.value = ""
    haveMoney.value = ""
    resultText.innerText = "0 ₽"
    targetInputForm.value = ""
    slider.value = "1"
    pMonth.innerText = "1 мес."

    cardBar.style.display = "flex"
}


//Функция на срабатывание submith. Получаем значение формы//
function dataForm(event) {

    cardBar.innerHTML = ""
    event.preventDefault();
    const data = new FormData(event.target);
    cardBar.style.display = "flex";
    grafica.style.display = 'none'

    STORE.push({
        id: ++count,
        target: data.get("target"),
        needMoney: data.get("needMoney"),
        haveMoney: data.get("haveMoney"),
        month: data.get("month"),
        percentBank: data.get("percentBank"),
        result: resultText.innerText,
        isOpenGraph: false
    })


    STORE.forEach((item) => {

        const blockCard = document.createElement("div")
        blockCard.classList.add("card")
        const cardTitle = document.createElement("h2")
        cardTitle.classList.add("card__title")
        cardTitle.innerText = `${item.target}`
        const cardSubtitle = document.createElement("p")
        cardSubtitle.classList.add("card__subtitle")
        cardSubtitle.innerHTML = `Ежемесячное пополнение: <span class="card__value">${item.result}</span></p>`
        const buttonWrapper = document.createElement('div')
        buttonWrapper.classList.add("button-wrapper")
        const buttonGraf = document.createElement("button")
        buttonGraf.classList.add("card__graf", "card-btn")
        buttonGraf.innerText = "📊"
        const buttonRemake = document.createElement("button")
        buttonRemake.classList.add("card__remake", "card-btn")
        buttonRemake.innerText = "✏️"
        const buttonDelete = document.createElement("button")
        buttonDelete.classList.add("card__delete", "card-btn")
        buttonDelete.innerText = "🗑️"


        cardBar.append(blockCard)
        blockCard.append(cardTitle)
        blockCard.append(cardSubtitle)
        blockCard.append(buttonWrapper)
        buttonWrapper.append(buttonGraf)
        buttonWrapper.append(buttonRemake)
        buttonWrapper.append(buttonDelete)

        // ----------------- кусок кода для графика ------------------------//
        buttonGraf.addEventListener('click', (event) => {
            event.preventDefault();

            let totalAddPayments = parseFloat(item.result) * parseFloat(item.month);
            let firstPayment = parseFloat(item.haveMoney);
            let totalProfit = parseFloat(item.needMoney) - firstPayment - totalAddPayments;

            let labelArr = ["Первоначальный платеж", "Всего пополнений", "Тотал доход с пополнений"];
            let dataArr = {
                data: [firstPayment, totalAddPayments, totalProfit].map((item) => Math.round(item, 2)),

                backgroundColor: [
                    '#494947',
                    '#CB6139',
                    '#C29473',
                ],// Цвет фона

                borderColor: [
                    '#494947',
                    '#CB6139',
                    '#C29473',
                ],// Цвет границы
                borderWidth: 1,
            };
            grafica.style.display = item.isOpenGraph ? 'none' : 'block'
            item.isOpenGraph = !item.isOpenGraph

            let myChart = new Chart(grafica, {
                type: 'doughnut',// Тип графики
                data: {
                    labels: labelArr,
                    datasets: [
                        dataArr,
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                        },
                        title: {
                            display: true,
                            text: 'Распределение накоплений на вкладе по типу',
                        }
                    }
                },
            });
        });




        // --------------------------кусок кода для графика -----------------------------//


        buttonDelete.addEventListener('click', (event) => {
            grafica.style.display = 'none'

            let answer = confirm('Вы уверены, что хотите удалить копилку❓ \nНазад  её вернуть нельзя❗\nПотом придётся делать новую❗')
            if (answer === true) {
                event.target.parentElement.parentElement.remove()
                STORE.splice(STORE.findIndex((cart) => cart.id === item.id), 1)
            }


        })

        buttonRemake.addEventListener('click', (event) => {
            grafica.style.display = 'none'
            event.preventDefault();
            cardBar.style.display = "none";
            formEdit.style.display = "block";
            currentUpdateCart = item.id
            formEditTarget.value = item.target
            formEditNeedMoney.value = item.needMoney
            formEditInputHave.value = item.haveMoney
            formEditSlider.value = item.month
            formEditMonth.innerText = item.result
        })

        formEditNeedMoney.addEventListener("change", checkInput1)
        formEditInputHave.addEventListener("change", checkInput1)
        formEditInputHave.addEventListener("keyup", checkInput1)
        formEditNeedMoney.addEventListener("keyup", checkInput1)
        formEditSlider.addEventListener("input", changeSlider1)
        formEditSlider.addEventListener("change", payment1)


        function changeSlider1() {
            formEditPMonth.innerText = formEditSlider.value + " мес."
            if (formEditSlider <= 1) {
                formEditBidPecent.value = "5"
            } else if (formEditSlider.value % 6 === 0) {
                const z = 5;
                formEditBidPecent.value = `${z + ((formEditSlider.value / 6) * 0.5)}`
            }
        }

        function checkInput1(event) {
            payment1()
        }

        function payment1() {
            const needSumm = formEditNeedMoney.value;
            const haveSumm = formEditInputHave.value;
            let depositPercent = formEditBidPecent.value;
            let depositMonth = formEditSlider.value;

            let x = (1 + ((depositPercent * 0.01) / 12));
            let xExponent = Math.pow(x, depositMonth);
            let y = (12 / (depositPercent * 0.01));
            let result = (((needSumm - (haveSumm * xExponent)) / ((xExponent - 1) * y))).toFixed(2);

            if (result === "NaN" || haveSumm === "" || needSumm === "") {
                formEditResultText.innerText = 'Заполните все поля'
            } else if (needSumm <= 0 || haveSumm < 0) {
                formEditResultText.innerText = "Значение не может быть отрицательным"
                formEditButtonOk.disabled = "disabled"
            } else if (needSumm > haveSumm && result < 0) {
                formEditResultText.innerText = `Проценты по вкладу - позволят \n вам заработать без копилки📈\n за ${slider.value} мес.`
                formEditButtonOk.disabled = ""
            }
            else if (result < 0) {
                formEditResultText.innerText = "Cумма имеющихся денег - больше,\n чем вам нужно или равна требуемой❗"
                formEditButtonOk.disabled = "disabled"
            } else {
                formEditResultText.innerText = `${result} ₽`;
                formEditButtonOk.disabled = "";
            }
        }
    })

    formEditButtonOk.addEventListener('click', (event) => {
        event.preventDefault();
        grafica.style.display = 'none'
        const card = STORE.find((cart) => cart.id === currentUpdateCart)
        card.target = formEditTarget.value
        card.needMoney = formEditNeedMoney.value
        card.haveMoney = formEditInputHave.value
        card.month = formEditSlider.value
        card.result = formEditMonth.innerText
        cardBar.style.display = "flex";
        formEdit.style.display = "none";
        renderCard()
    })


    formEditButtonCancel.addEventListener('click', (event) => {
        grafica.style.display = 'none'

        event.preventDefault();
        cardBar.style.display = "flex";
        formEdit.style.display = "none";
    })


    needMoney.value = ""
    haveMoney.value = ""
    resultText.innerText = "0 ₽"
    targetInputForm.value = ""
    slider.value = "1"
    pMonth.innerText = "1 мес."

}


// график по накоплениям//

function drawDiagram(event) {
    let labelArr = ['Red', 'Orange', 'Yellow', 'Green'];
    console.log(cardDataArr);

    let dataArr = {
        data: cardDataArr,

        backgroundColor: [
            'rgba(163,221,203,0.2)',
            'rgba(232,233,161,0.2)',
            'rgba(230,181,102,0.2)',
            'rgba(229,112,126,0.2)',
        ],// Цвет фона

        borderColor: [
            'rgba(163,221,203,1)',
            'rgba(232,233,161,1)',
            'rgba(230,181,102,1)',
            'rgba(229,112,126,1)',
        ],// Цвет границы
        borderWidth: 1,
    }

    const myChart = new Chart(grafica, {
        type: 'doughnut',// Тип графики
        data: {
            labels: labelArr,
            datasets: [
                dataArr,
            ]
        },

        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Распределение накоплений на вкладе по типу'
                }
            }
        },
    });
}




// Кнопка онбординг
function closeOnbourding() {
    document.querySelector('.onboarding').style.display = "none"
    sectionForm.style.display = "block"
}

// кнопка +
function openForm() {
    grafica.style.display = 'none'
    document.querySelector('.onboarding').style.display = "none"
    sectionForm.style.display = "block"
    cardBar.style.display = "none"
    formEdit.style.display = "none"

}



//Функция на редактирование карточки//
function editCard(event) {
    grafica.style.display = 'none'
    cardBar.style.display = "none"
    formEdit.style.display = "none";

}


function renderCard() {
    cardBar.innerHTML = ""
    grafica.style.display = 'none'
    STORE.forEach((item) => {

        const blockCard = document.createElement("div")
        blockCard.classList.add("card")
        const cardTitle = document.createElement("h2")
        cardTitle.classList.add("card__title")
        cardTitle.innerText = `${item.target}`
        const cardSubtitle = document.createElement("p")
        cardSubtitle.classList.add("card__subtitle")
        cardSubtitle.innerHTML = `Ежемесячное пополнение: <span class="card__value">${item.result}</span></p>`
        const buttonWrapper = document.createElement('div')
        buttonWrapper.classList.add("button-wrapper")
        const buttonGraf = document.createElement("button")
        buttonGraf.classList.add("card__graf", "card-btn")
        buttonGraf.innerText = "📊"
        const buttonRemake = document.createElement("button")
        buttonRemake.classList.add("card__remake", "card-btn")
        buttonRemake.innerText = "✏️"
        const buttonDelete = document.createElement("button")
        buttonDelete.classList.add("card__delete", "card-btn")
        buttonDelete.innerText = "🗑️"


        cardBar.append(blockCard)
        blockCard.append(cardTitle)
        blockCard.append(cardSubtitle)
        blockCard.append(buttonWrapper)
        buttonWrapper.append(buttonGraf)
        buttonWrapper.append(buttonRemake)
        buttonWrapper.append(buttonDelete)

        // ----------------- кусок кода для графика ------------------------//
        buttonGraf.addEventListener('click', (event) => {
            event.preventDefault();

            let totalAddPayments = parseFloat(item.result) * parseFloat(item.month);
            let firstPayment = parseFloat(item.haveMoney);
            let totalProfit = parseFloat(item.needMoney) - firstPayment - totalAddPayments;

            let labelArr = ["Первоначальный платеж", "Всего пополнений", "Тотал доход с пополнений"];
            let dataArr = {
                data: [firstPayment, totalAddPayments, totalProfit].map((item) => Math.round(item, 2)),

                backgroundColor: [
                    '#494947',
                    '#CB6139',
                    '#C29473',
                ],// Цвет фона

                borderColor: [
                    '#494947',
                    '#CB6139',
                    '#C29473',
                ],// Цвет границы
                borderWidth: 1,
            };
            grafica.style.display = item.isOpenGraph ? 'none' : 'block'
            item.isOpenGraph = !item.isOpenGraph

            let myChart = new Chart(grafica, {
                type: 'doughnut',// Тип графики
                data: {
                    labels: labelArr,
                    datasets: [
                        dataArr,
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                        },
                        title: {
                            display: true,
                            text: 'Распределение накоплений на вкладе по типу',
                        }
                    }
                },
            });
        });



        // --------------------------кусок кода для графика -----------------------------//


        buttonDelete.addEventListener('click', (event) => {
            grafica.style.display = 'none'

            let answer = confirm('Вы уверены, что хотите удалить копилку❓ \nНазад  её вернуть нельзя❗\nПотом придётся делать новую❗')
            if (answer === true) {
                event.target.parentElement.parentElement.remove()
                STORE.splice(STORE.findIndex((cart) => cart.id === item.id), 1)
            }


        })

        buttonRemake.addEventListener('click', (event) => {
            grafica.style.display = 'none'
            event.preventDefault();
            cardBar.style.display = "none";
            formEdit.style.display = "block";
            currentUpdateCart = item.id
            formEditTarget.value = item.target
            formEditNeedMoney.value = item.needMoney
            formEditInputHave.value = item.haveMoney
            formEditSlider.value = item.month
            formEditMonth.innerText = item.result
        })

        formEditNeedMoney.addEventListener("change", checkInput1)
        formEditInputHave.addEventListener("change", checkInput1)
        formEditInputHave.addEventListener("keyup", checkInput1)
        formEditNeedMoney.addEventListener("keyup", checkInput1)
        formEditSlider.addEventListener("input", changeSlider1)
        formEditSlider.addEventListener("change", payment1)


        function changeSlider1() {
            formEditPMonth.innerText = formEditSlider.value + " мес."
            if (formEditSlider <= 1) {
                formEditBidPecent.value = "5"
            } else if (formEditSlider.value % 6 === 0) {
                const z = 5;
                formEditBidPecent.value = `${z + ((formEditSlider.value / 6) * 0.5)}`
            }
        }

        function checkInput1(event) {
            payment1()
        }

        function payment1() {
            const needSumm = formEditNeedMoney.value;
            const haveSumm = formEditInputHave.value;
            let depositPercent = formEditBidPecent.value;
            let depositMonth = formEditSlider.value;

            let x = (1 + ((depositPercent * 0.01) / 12));
            let xExponent = Math.pow(x, depositMonth);
            let y = (12 / (depositPercent * 0.01));
            let result = (((needSumm - (haveSumm * xExponent)) / ((xExponent - 1) * y))).toFixed(2);

            if (result === "NaN" || haveSumm === "" || needSumm === "") {
                formEditResultText.innerText = 'Заполните все поля'
            } else if (needSumm <= 0 || haveSumm < 0) {
                formEditResultText.innerText = "Значение не может быть отрицательным"
                formEditButtonOk.disabled = "disabled"
            } else if (needSumm > haveSumm && result < 0) {
                formEditResultText.innerText = `Проценты по вкладу - позволят \n вам заработать без копилки📈\n за ${slider.value} мес.`
                formEditButtonOk.disabled = ""
            } else if (needSumm < haveSumm) {
                formEditResultText.innerText = `Имеющиеся сумма больше нужной.`
                formEditButtonOk.disabled = ""
            } else if (result < 0) {
                formEditResultText.innerText = "Cумма имеющихся денег - больше,\n чем вам нужно или равна требуемой❗"
                formEditButtonOk.disabled = "disabled"
            } else {
                formEditResultText.innerText = `${result} ₽`;
                formEditButtonOk.disabled = "";
            }
        }
    })

    formEditButtonOk.addEventListener('click', (event) => {
        event.preventDefault();
        grafica.style.display = 'none'
        const card = STORE.find((cart) => cart.id === currentUpdateCart)
        card.target = formEditTarget.value
        card.needMoney = formEditNeedMoney.value
        card.haveMoney = formEditInputHave.value
        card.month = formEditSlider.value
        card.result = formEditMonth.innerText
        cardBar.style.display = "flex";
        formEdit.style.display = "none";
        renderCard()
    })


    formEditButtonCancel.addEventListener('click', (event) => {
        grafica.style.display = 'none'

        event.preventDefault();
        cardBar.style.display = "flex";
        formEdit.style.display = "none";
    })


    needMoney.value = ""
    haveMoney.value = ""
    resultText.innerText = "0 ₽"
    targetInputForm.value = ""
    slider.value = "1"
    pMonth.innerText = "1 мес."
}