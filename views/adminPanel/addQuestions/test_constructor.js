var form;


//функция, собирающая данные из формы для добавления вопросов
function setFormData() {
    let formData = {
        name: $('#name').val(),
        rightAnswer: []
    }
    //Обработчик всех ответов из формы
    let answerInputs = $('input.answer:not([disabled])')
    for (let i = 1; i <= answerInputs.length; i++) {
        formData[`answer${i}`] = $(`#answer${i}`).val();
    }
    if ($('input:radio[name=questionType]:checked').val() == 3){
        formData.rightAnswer.push('1')
    }
    else {
        Array.from($('input[name=rightAnswer]:checked')).forEach(val => formData.rightAnswer.push($(val).val()))
    }
    return formData;
}

const addTableRow = (formData) => {
    let lastChild = $('#questionsTable > tbody:last-child');
    let answersLi = '';
    for (let key in formData) {
        if(key.match(/^answer[0-9]+$/)) {
            let digits = key.match(/[0-9]+/gi).join('');
            let selector = formData.rightAnswer.includes(digits) ? ` class="right_answer"` : '';
            answersLi += `<li`+selector+`>${formData[key]}</li>`
        }
    }
    lastChild.append(`
        <tr>
            <th>
                ${formData.name}
            </th>
            <th>
                <ol>
                    ${answersLi}
                </ol>
                <button class="deleteQuestion btn btn-primary">Удалить</button>
            </th>
        </tr>
    `)
    $.get('/admin/getQuestionsLength').success(function(data){
        $('tr:last-child').attr('id', `question-${data.number}`);
        $('tr:last-child .deleteQuestion').attr('id', `question-${data.number}`);
    }) 
};

$( '#addQuestion' ).on('click', function() {
    const formData = setFormData();
    postData(formData);
})

//Обработчик запроса на удаление таблицы
function deleteQuestionHandler(id, obj) {
    $.ajax({
        url: `/admin/deleteQuestion/${id}`,
        type: 'DELETE',
        success: function(result) {
            console.log(result)
            $(`tr#${obj.id}`).remove();
        }
    });
}

//Привязка обработчика к кнопке
$( '.deleteQuestion' ).live('click', function(e) {
    deleteQuestionHandler(e.target.id.match(/[0-9]+/gi).join(''), e.target)
})

function addAnswer() {
    let lastAnswer = Number($('.answer:last').attr('id').match(/[0-9]+/).join(''))+1;
    let inputAttrs = `id='answer${lastAnswer}' class='answer form-control' type='text' name='answer${lastAnswer}' placeholder='вариант ответ ${lastAnswer}' for='addTest disabled=false'`
    let rightAnswerType = $('input:radio[name=questionType]:checked').val() == 1 ? 'radio' : 'checkbox';
    let appendElement = `
    <div class='input-group'>
        <input ${inputAttrs}></input>
        <div class='input-group-text'>
            <input name='rightAnswer' type='${rightAnswerType}' id='answer${lastAnswer}' for='addTest' value='${lastAnswer}' disabled=false></input>
        </div>
    </div>
    `
    $('#questionAnswers').append(appendElement)
    $('input[name=rightAnswer]:last').prop('disabled', false)
}

$('#addAnswer').on('click', () => addAnswer());

$('input:radio[name=questionType]').on('change', function() {
    if (this.value == 1) {
        $('input.answer').each(function() {
            $(this).prop('type', 'radio')
            $(this).prop('disabled', 'false')
        })
        $('#questionAnswers div').not('div.input-group:first').show();
        $('.input-group-text').show()
        $('#addAnswer').show()
    }
    else if (this.value == 2) {
        $('input.answer').each(function() {
            $(this).prop('type', 'checkbox')
            $(this).prop('disabled', 'false')
        })
        $('#questionAnswers div').not('div.input-group:first').show();
        $('.input-group-text').show()
        $('#addAnswer').show()
    }
    else if (this.value == 3) {
        $('input.answer').not(':first').each(function() {
            $(this).prop('disabled', 'true')
        })
        $('#questionAnswers div').not('div.input-group:first').hide();
        $('.input-group-text').hide()
        $('#addAnswer').hide()
    }
})