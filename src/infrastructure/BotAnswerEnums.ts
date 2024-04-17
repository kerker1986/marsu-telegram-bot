enum BotMessagesText {
    start = 'Приветствую! Вы можете создать тестирование или пройти уже существующие',
    start_reply = 'Прогресс создания/прохождения тестирование анулировано. Вы моежете начать сначала',
    create_testing_title = 'Введите название тестирования',
    create_testing_title_save = 'Название тестирования сохранено, добавьте вопросы',
    create_question_title = 'Введите вопрос',
    create_question_title_save = 'Вопрос сохранен, добавьте ответы к вопросу',
    create_answer_title = 'Введите ответ',
    create_answer_title_save = 'Ответ сохранен, вы можете добавить еще ответов',
    pick_correct_answer = 'Укажите правильный ответ',
    pick_correct_answer_save = 'Правильный ответ сохранен, вы можете добавить вопросы или сохранить тестирование',
    create_testing_save = 'Ваше тестирование сохранено, вы можете пройти его или создать новое',
    passing_testing_save = 'Вы прошли тестирование! Ваши результаты:',
}

enum BotButtonsText {
    create_testing = 'Создать тестирование',
    passing_testing = 'Пройти тестирование',
    back_to_start = 'Вернуться в начало',
    add_question = 'Добавить вопрос',
    add_answer = 'Добавить ответ',
    pick_correct_answer = 'Указать правильный ответ',
    save_testing = 'Сохранить тестирование',
}

export default {BotButtonsText, BotMessagesText};



