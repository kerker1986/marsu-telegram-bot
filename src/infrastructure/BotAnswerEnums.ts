enum BotMessagesText {
    start = 'Приветствую! Вы можете создать тестирование или пройти уже существующие',
    start_reply = 'Прогресс создания/прохождения тестирование анулировано. Вы моежете начать сначала',
    create_testing_title = 'Введите название тестирования',
    create_testing_title_save = 'Название тестирования сохранено, добавьте вопросы',
    create_question_title = 'Введите название вопроса',
    create_question_title_save = 'Название вопроса сохранено, добавьте ответы к вопросу',
    create_answer_title = 'Введите название ответа',
    create_answer_title_save = 'Название ответа сохранено, вы можете добавить еще ответов',
}

enum BotButtonsText {
    create_testing = 'Создать тестирование',
    passing_testing = 'Пройти тестирование',
    back_to_start = 'Вернуться в начало',
    add_question = 'Добавить вопрос',
    add_answer = 'Добавить ответ',
    correct_answer = 'Указать правильный ответ',
}

export default {BotButtonsText, BotMessagesText};



